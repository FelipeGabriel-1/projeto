import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from './app/app.routes'; // Importa as rotas CORRETAS
import { AppComponent } from './app/app.component';

// Importações e configurações do Firebase
import { provideFirebaseApp } from '@angular/fire/app';
import { initializeApp } from 'firebase/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    // Configura o roteamento com as rotas exportadas
    provideRouter(routes, withPreloading(PreloadAllModules)),

    // Inicialização do Firebase (lendo o environment.ts)
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    // Injeção de dependência para o serviço de Autenticação
    provideAuth(() => getAuth()),
  ],
});