// src/app/inicial/inicial.page.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { Auth, signOut } from '@angular/fire/auth';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs'; 
import { take } from 'rxjs/operators'; 
import { HttpClient, HttpClientModule } from '@angular/common/http'; // <-- NOVO: HttpClient para Reverse Geocoding

// Importa a biblioteca do Capacitor para Geolocalização
import { Geolocation } from '@capacitor/geolocation'; 

// Importa os serviços essenciais
import { ClimaService } from '../services/clima.service'; 
import { HistoricoService, HistoricoBusca } from '../services/historico.service'; 

import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonButtons, 
  IonMenu, IonMenuButton, IonList, IonItem, IonInput, IonLabel, IonCard, IonCardHeader, 
  IonCardTitle, IonCardContent, AlertController, LoadingController, IonText,
  IonGrid, IonRow, IonCol 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  logOutOutline, searchOutline, sunnyOutline, timeOutline, 
  cloudyOutline, rainyOutline, thunderstormOutline, snowOutline, 
  partlySunnyOutline, thermometerOutline, informationCircleOutline,
  locationOutline, refreshOutline, waterOutline, leafOutline, shirtOutline // leafOutline é a correção para o ícone de Vento
} from 'ionicons/icons'; 

interface ClimaConvertido {
  name: string;
  temp: number;
  temp_min: number;
  temp_max: number;
  humidity: number;    
  wind_speed: number;  
  description: string;
  main: string; 
}

addIcons({ 
  logOutOutline, searchOutline, sunnyOutline, timeOutline, 
  cloudyOutline, rainyOutline, thunderstormOutline, snowOutline, 
  partlySunnyOutline, thermometerOutline, informationCircleOutline,
  locationOutline, refreshOutline, waterOutline, leafOutline, shirtOutline
});


@Component({
  standalone: true,
  selector: 'app-inicial',
  templateUrl: './inicial.page.html',
  styleUrls: ['./inicial.page.scss'],
  imports: [
    CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, 
    IonIcon, IonButtons, IonMenu, IonMenuButton, IonList, IonItem, IonInput, IonLabel, 
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonText, RouterModule,
    IonGrid, IonRow, IonCol, HttpClientModule // <--- NOVO: HttpClientModule para a geolocalização
  ]
})
export class InicialPage implements OnInit {
  
  cidade: string = '';
  climaAtual: any = null; 
  climaDisplay: ClimaConvertido | null = null; 
  sugestaoRoupa: string = '';
  historico$!: Observable<HistoricoBusca[]>; 

  climaCardClass: string = 'fundo-default'; 
  climaIconName: string = 'thermometer-outline';  
  
  private readonly MS_TO_KMH = 3.6;
  private readonly KELVIN_TO_CELSIUS = 273.15; 
  // ** ATENÇÃO: SUBSTITUA ESTA CHAVE PELA SUA CHAVE DO OpenWeatherMap **
  private readonly API_KEY = '1400cd7fc0a795e68dd061c39c1cd13f'; 

  private auth = inject(Auth); 
  private router = inject(Router);
  private climaService = inject(ClimaService);
  private historicoService = inject(HistoricoService);
  private alertController = inject(AlertController);
  private loadingController = inject(LoadingController);
  private http = inject(HttpClient); // <--- NOVO: Injeção do HttpClient
  
  constructor() {}

  ngOnInit() {
    this.historico$ = this.historicoService.getHistoricoRecente();
    // Tenta buscar o clima por localização ao iniciar
    this.getCurrentLocationAndSearch(); 
  }

  // NOVO MÉTODO: BUSCA POR GEOLOCALIZAÇÃO
  async getCurrentLocationAndSearch() {
    try {
      const permission = await Geolocation.checkPermissions();
      if (permission.location !== 'granted') {
        await Geolocation.requestPermissions();
      }

      const position = await Geolocation.getCurrentPosition({ timeout: 10000 });
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      
      const loading = await this.presentLoading('Localizando e Buscando Clima...');
      
      // 1. REVERSE GEOCODING (COORDENADAS -> NOME DA CIDADE)
      const GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${this.API_KEY}`;
      
      this.http.get<any[]>(GEOCODING_URL).pipe(take(1)).subscribe({
          next: (geoData) => {
              if (geoData && geoData.length > 0) {
                  const cityName = geoData[0].name;
                  this.cidade = cityName;
                  // 2. BUSCAR CLIMA
                  this.buscarClimaInterno(cityName, loading);
              } else {
                  loading.dismiss();
                  this.presentAlert('Erro de Localização', 'Não foi possível encontrar o nome da cidade a partir das coordenadas.');
              }
          },
          error: (e) => {
              loading.dismiss();
              this.presentAlert('Erro de Geolocalização', 'Não foi possível obter o nome da cidade. Por favor, use a busca manual.');
              console.error('Erro no Reverse Geocoding:', e);
          }
      });
      
    } catch (e: any) {
      console.error('Erro ao obter geolocalização:', e);
    }
  }

  // FUNÇÃO INTERNA REUTILIZÁVEL PARA BUSCAR O CLIMA (USADA PELA BUSCA MANUAL E GEOLOCALIZAÇÃO)
  private buscarClimaInterno(cidade: string, loading: HTMLIonLoadingElement) {
    
    this.climaService.buscarClima(cidade).pipe(take(1)).subscribe({
      next: (data: any) => {
        this.climaAtual = data; 
        
        const tempC = parseFloat((data.main.temp - this.KELVIN_TO_CELSIUS).toFixed(1));
        const minC = parseFloat((data.main.temp_min - this.KELVIN_TO_CELSIUS).toFixed(1));
        const maxC = parseFloat((data.main.temp_max - this.KELVIN_TO_CELSIUS).toFixed(1));
        
        this.climaDisplay = {
          name: data.name,
          temp: tempC,
          temp_min: minC,
          temp_max: maxC,
          humidity: data.main.humidity, 
          wind_speed: parseFloat((data.wind.speed * this.MS_TO_KMH).toFixed(1)), 
          description: data.weather[0].description,
          main: data.weather[0].main
        };

        this.sugerirRoupas(tempC, data.weather[0].description); 
        this.aplicarEstilosClima(this.climaDisplay.main); 
        
        this.historicoService.adicionarBusca(cidade, `${tempC}°C`)
          .catch((err: any) => console.error("Erro ao salvar histórico:", err)); 
        
        loading.dismiss();
      },
      error: (e: any) => { 
        console.error('Erro na busca de clima:', e);
        loading.dismiss();
        let errorMessage = 'Ocorreu um erro desconhecido.';
        if (e.status === 404) {
            errorMessage = 'Cidade não encontrada. Verifique o nome.';
        } else if (e.status === 401) {
            errorMessage = 'Chave da API inválida. Verifique o environment.ts.';
        }
        this.presentAlert('Erro na Busca', errorMessage);
        this.climaAtual = null;
        this.climaDisplay = null;
        this.sugestaoRoupa = '';
        this.climaCardClass = 'fundo-default';
        this.climaIconName = 'thermometer-outline';
      }
    });
  }

  // FUNÇÃO DE BUSCA MANUAL ATUALIZADA (AGORA CHAMA A FUNÇÃO INTERNA)
  async buscarClima() {
    if (!this.cidade) {
      this.presentAlert('Atenção', 'Por favor, digite o nome da cidade.');
      return;
    }

    const loading = await this.presentLoading('Buscando clima...');
    const cidadeBuscada = this.cidade.trim(); 
    this.buscarClimaInterno(cidadeBuscada, loading);
  }
  
  aplicarEstilosClima(mainCondition: string) {
    switch (mainCondition.toLowerCase()) {
        case 'clear':
            this.climaCardClass = 'fundo-sol';
            this.climaIconName = 'sunny-outline';
            break;
        case 'clouds':
            this.climaCardClass = 'fundo-nublado';
            this.climaIconName = 'cloudy-outline';
            break;
        case 'rain':
        case 'drizzle':
            this.climaCardClass = 'fundo-chuva';
            this.climaIconName = 'rainy-outline';
            break;
        case 'thunderstorm':
            this.climaCardClass = 'fundo-tempestade';
            this.climaIconName = 'thunderstorm-outline';
            break;
        case 'snow':
            this.climaCardClass = 'fundo-neve';
            this.climaIconName = 'snow-outline';
            break;
        case 'mist':
        case 'smoke':
        case 'haze':
        case 'fog':
            this.climaCardClass = 'fundo-neblina';
            this.climaIconName = 'partly-sunny-outline'; 
            break;
        default:
            this.climaCardClass = 'fundo-default';
            this.climaIconName = 'thermometer-outline';
            break;
    }
  }

  sugerirRoupas(temperatura: number, condicao: string) {
    let sugestaoBase = '';
    
    if (temperatura >= 30) {
      sugestaoBase = '☀️ **Calor Intenso.** Use roupas leves, shorts e camiseta. Não esqueça do protetor solar!';
    } else if (temperatura >= 20) {
      sugestaoBase = '👕 **Agradável.** Ideal para camiseta ou blusa fina. Considere um casaco leve à noite.';
    } else if (temperatura >= 10) {
      sugestaoBase = '🧥 **Frio Moderado.** Vista casaco, calça e talvez um cachecol. Prepare-se para o vento.';
    } else {
      sugestaoBase = '🥶 **Muito Frio.** Agasalhe-se bem! Casaco pesado, luvas e touca são necessários.';
    }

    if (condicao.toLowerCase().includes('chuva') || condicao.toLowerCase().includes('rain')) {
        this.sugestaoRoupa = sugestaoBase + ' **Alerta: Não esqueça do guarda-chuva ou capa de chuva!** ☔';
    } else {
        this.sugestaoRoupa = sugestaoBase;
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
      this.router.navigate(['/home']); 
    } catch (e: any) { 
      console.error('Erro ao fazer logout:', e);
      this.presentAlert('Erro', 'Não foi possível sair no momento.');
    }
  }
  
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentLoading(message: string) {
    const loading = await this.loadingController.create({
      message,
      duration: 5000 
    });
    await loading.present();
    return loading; 
  }
}