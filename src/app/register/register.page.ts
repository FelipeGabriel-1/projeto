import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonIcon
} from '@ionic/angular/standalone';

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
    if (this.password !== this.confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      alert('Conta criada com sucesso!');
      this.router.navigate(['/home']);
    } catch (err) {
      console.error(err);
      alert('Erro ao criar conta.');
    }
  }

}

