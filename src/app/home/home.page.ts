// src/app/home/home.page.ts

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonIcon,
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { CommonModule } from '@angular/common'; 
// CORREÇÃO: addIcons não é importado de /standalone
import { addIcons } from 'ionicons'; 
import { mailOutline, lockClosedOutline } from 'ionicons/icons'; 


// 1. Registra os ícones antes do @Component
addIcons({ mailOutline, lockClosedOutline });

@Component({ // 🚨 CORRIGIDO: @Component no lugar certo
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    FormsModule,
    IonContent,
    IonIcon,
    RouterLink,
    CommonModule
  ]
})
export class HomePage {

  email: string = '';
  password: string = '';

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  async login() {
    // IMPORTANTE: Se o HTML foi corrigido (com name e form), o this.email/password não será mais vazio.
    try {
      if (!this.email || !this.password) {
        alert('Por favor, preencha o e-mail e a senha.');
        return; 
      }
      
      await signInWithEmailAndPassword(this.auth, this.email, this.password);
      
      // SUCESSO: Navega se o login for válido
      this.router.navigate(['/inicial']); 
      
    } catch (err: any) {
      console.error(err);
      
      const errorMessage = this.getFirebaseErrorMessage(err);
      // Lembrete: Se a senha estiver incorreta no Firebase, este alerta é disparado.
      alert(`Erro no Login: ${errorMessage}`);
    }
  }

  // Função auxiliar para melhorar a mensagem de erro
  private getFirebaseErrorMessage(error: any): string {
    switch (error.code) {
      case 'auth/invalid-email':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'E-mail ou senha incorretos.'; 
      case 'auth/too-many-requests':
        return 'Muitas tentativas falhas. Tente novamente mais tarde.'; 
      default:
        return 'Ocorreu um erro desconhecido no login.';
    }
  }
}