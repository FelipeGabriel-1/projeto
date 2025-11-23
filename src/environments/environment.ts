export const environment = {
  production: false,
  
  // CHAVE DA OPENWEATHERMAP (necessária para ClimaService)
  openWeatherApiKey: '1400cd7fc0a795e68dd061c39c1cd13f', 

  // CONFIGURAÇÃO DO FIREBASE (necessária para main.ts)
  // Renomeado de 'firebase' para 'firebaseConfig' para o AngularFire
  firebaseConfig: {
    apiKey: "AIzaSyBbRa_cXIPVwEnjqGh2qBQBVqM_rWvc3kw",
    authDomain: "formadora-953bc.firebaseapp.com",
    projectId: "formadora-953bc",
    storageBucket: "formadora-953bc.firebasestorage.app",
    messagingSenderId: "830614100468",
    appId: "1:830614100468:web:f52f14ce36d0ebc56201a1",
    measurementId: "G-2QH268VHSV"
  }
};