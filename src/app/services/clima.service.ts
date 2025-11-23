// src/app/services/clima.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class ClimaService {
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  private apiKey = environment.openWeatherApiKey; 

  constructor(private http: HttpClient) { }

  buscarClima(cidade: string) {
    // CORREÇÃO: Removemos '&units=metric' para que a API retorne em KELVIN.
    // A conversão para Celsius será feita na InicialPage.
    const url = `${this.apiUrl}?q=${cidade}&appid=${this.apiKey}&lang=pt_br`;
    
    return this.http.get(url);
  }
}