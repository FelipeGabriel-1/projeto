import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, query, orderBy, limit } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface HistoricoBusca {
  cidade: string;
  temperatura: string;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class HistoricoService {
  private firestore = inject(Firestore);
  private historicoCollection = collection(this.firestore, 'historico');

  constructor() { }

  // Salva uma nova busca no Firebase
  async adicionarBusca(cidade: string, temperatura: string) {
    try {
      await addDoc(this.historicoCollection, {
        cidade: cidade,
        temperatura: temperatura,
        data: new Date()
      });
    } catch (e) {
      console.error('Erro ao salvar histórico:', e);
    }
  }

  // Busca todo o histórico ordenado por data
  getHistorico(): Observable<HistoricoBusca[]> {
    const q = query(this.historicoCollection, orderBy('data', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<HistoricoBusca[]>;
  }

  // Busca apenas os últimos 3 (para exibir na Home/Inicial se quiser)
  getHistoricoRecente(): Observable<HistoricoBusca[]> {
    const q = query(this.historicoCollection, orderBy('data', 'desc'), limit(3));
    return collectionData(q, { idField: 'id' }) as Observable<HistoricoBusca[]>;
  }
}