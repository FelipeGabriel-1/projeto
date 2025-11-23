import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  // ADIÇÃO dos componentes que faltavam: BackButton, Card, Note, etc.
  IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, 
  IonLabel, IonIcon, IonButtons, IonMenuButton, IonText, 
  IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonNote 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { thermometerOutline, timeOutline, calendarOutline } from 'ionicons/icons';
// CAMINHO CORRETO E INTERFACE CORRETA
// CORREÇÃO DO CAMINHO:
import { HistoricoService, HistoricoBusca } from '../services/historico.service';
// ...
// ADICIONE ESTA LINHA:
import { Observable } from 'rxjs'; 

// ... restante do código ...

@Component({
  selector: 'app-historico',
  templateUrl: './historico.page.html',
  styleUrls: ['./historico.page.scss'],
  standalone: true,
  imports: [
    // CORREÇÃO: Todos os componentes Ion usados no HTML devem estar listados aqui
    IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, 
    IonLabel, IonIcon, IonButtons, IonMenuButton, IonText, 
    IonBackButton, IonCard, IonCardHeader, IonCardTitle, IonNote, 
    CommonModule, FormsModule
  ]
})
export class HistoricoPage implements OnInit {
  private historicoService = inject(HistoricoService);
  
  // Variável para guardar a lista do Firebase
  historico$!: Observable<HistoricoBusca[]>;

  constructor() {
    addIcons({ thermometerOutline, timeOutline, calendarOutline });
  }

  ngOnInit() {
    // Carrega os dados assim que a página abre
    this.historico$ = this.historicoService.getHistorico();
  }
}