import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';

import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [FormsModule, IonContent, IonIcon]
})
export class RegisterPage {

  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private auth: Auth, private router: Router) {}

  async register() {
    // 1. Validação de Senhas (Início)
    if (this.password !== this.confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }
    
    // 2. Validação básica se os campos estão preenchidos
    if (!this.email || !this.password) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    try {
      // Tenta criar o usuário no Firebase
      await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      
      // Sucesso
      alert('Conta criada com sucesso! Você será redirecionado para a Home.');
      this.router.navigate(['/home']);
      
    } catch (err) {
      // Tratamento de Erros: Aqui é onde melhoramos o código!
      console.error(err);
      
      // Chamamos uma função para traduzir o código de erro do Firebase
      const errorMessage = this.getFirebaseErrorMessage(err);
      
      alert(`Erro ao criar conta: ${errorMessage}`);
    }
  }
  
  /**
   * Função auxiliar para traduzir códigos de erro do Firebase
   */
  private getFirebaseErrorMessage(error: any): string {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'O e-mail fornecido já está em uso.';
      case 'auth/invalid-email':
        return 'O formato do e-mail é inválido.';
      case 'auth/weak-password':
        return 'A senha deve ter pelo menos 6 caracteres.';
      case 'auth/operation-not-allowed':
        return 'A criação de contas com e-mail/senha está desabilitada no Firebase.';
      default:
        return 'Um erro desconhecido ocorreu.';
    }
  }

}