import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { getAuth } from 'firebase/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    provideFirebaseApp(() =>
      initializeApp({
        apiKey: "AIzaSyDoA4yV2eCe5YF711aXGWZfB7ZubWQBqEU",
        authDomain: "clima-app-7f6ca.firebaseapp.com",
        projectId: "clima-app-7f6ca",
        storageBucket: "clima-app-7f6ca.firebasestorage.app",
        messagingSenderId: "144464200852",
        appId: "1:144464200852:web:e566f8551a638b1f78a081",
        measurementId: "G-KB1LE2JYZX"
      })
    ),

    provideAuth(() => getAuth()),
  ],
};
