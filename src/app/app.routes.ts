// src/app/app.routes.ts

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home', // Redireciona para a tela de login ao iniciar
    pathMatch: 'full',
  },
  {
    path: 'home', // ROTA PARA O LOGIN
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'register', // ROTA PARA O CADASTRO
    loadComponent: () => import('./register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'inicial', // DASHBOARD
    loadComponent: () => import('./inicial/inicial.page').then((m) => m.InicialPage),
  },
  {
    path: 'historico', // ROTA PARA O HISTÓRICO
    loadComponent: () => import('./historico/historico.page').then(m => m.HistoricoPage)
  },
  {
    path: 'sobre', // ROTA PARA A TELA SOBRE O GRUPO
    loadComponent: () => import('./sobre/sobre.page').then(m => m.SobrePage)
  }
];