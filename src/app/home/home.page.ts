import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonIcon
} from '@ionic/angular/standalone';

import { Router, RouterLink } from '@angular/router';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    FormsModule,
    IonContent,
    IonIcon,
    RouterLink  // <- AGORA O routerLink FUNCIONA
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
    try {
      await signInWithEmailAndPassword(this.auth, this.email, this.password);
      this.router.navigate(['/clima']);
    } catch (err) {
      console.error(err);
      alert('Email ou senha incorretos.');
    }
  }

}
