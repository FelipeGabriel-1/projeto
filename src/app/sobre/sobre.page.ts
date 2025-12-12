// src/app/sobre/sobre.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  // Componentes Antigos:
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, 
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, 
  IonLabel, IonAvatar, IonIcon, IonItemDivider, 
  // Componentes Novos/Ausentes (AQUI ESTÁ A CORREÇÃO):
  IonListHeader, IonFooter, IonButton, IonText 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  cloudOutline, saveOutline, personCircleOutline, schoolOutline, 
  calendarOutline, codeSlashOutline, businessOutline, bookOutline, 
  peopleOutline, logOutOutline, informationCircleOutline, sparklesOutline,
  checkmarkCircleOutline, arrowBackOutline // Novos ícones para o checklist e footer
} from 'ionicons/icons';

// Adicionando todos os ícones usados
addIcons({ 
  cloudOutline, saveOutline, personCircleOutline, schoolOutline, calendarOutline, 
  codeSlashOutline, businessOutline, bookOutline, peopleOutline, 
  logOutOutline, informationCircleOutline, sparklesOutline, checkmarkCircleOutline,
  arrowBackOutline 
});

interface Membro {
  nome: string;
  matricula: string;
  funcao: string;
}

@Component({
  selector: 'app-sobre',
  templateUrl: './sobre.page.html',
  styleUrls: ['./sobre.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, 
    // Certifique-se de que TODOS estes estão listados:
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, 
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, 
    IonLabel, IonAvatar, IonIcon, IonItemDivider, IonText,
    // Componentes que faltavam e causavam o erro NG8001:
    IonListHeader, IonFooter, IonButton 
  ]
})
export class SobrePage implements OnInit {

  // ... (O restante das suas propriedades e o construtor ficam iguais)
  nomeApp: string = "Clima Fácil";
  descricaoApp: string = "Aplicativo mobile para consulta de clima em tempo real e sugestão de vestuário, utilizando autenticação e histórico local.";
  apiUsada: string = "OpenWeatherMap API";
  recursoNativo: string = "Sistema de Arquivos para armazenamento do Histórico de Buscas (Requisito Mínimo)";
  
  // Informações da Turma
  curso: string = "Graduação Análise e Desenvolvimento de Sistemas (ADS)";
  modulo: string = "Mobile";
  ano: string = "2025";
  semestre: string = "4";
  professor: string = "Charles Bastos";

  // Membros do Grupo
  membros: Membro[] = [
    { nome: "Caio Moreno", matricula: "24110313", funcao: "Líder do Projeto" }
  ];

  constructor() { }

  ngOnInit() {
  }
}