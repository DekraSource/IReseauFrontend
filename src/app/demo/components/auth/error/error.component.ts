import { Component } from '@angular/core';

@Component({
  selector: 'app-error-page',
  template: `
    <div class="error-page">
      <h1>Oops, une erreur est survenue !</h1>
      <p>Veuillez réessayer plus tard ou contacter le support.</p>
      <button (click)="goHome()">Retourner à l'accueil</button>
    </div>
  `,
  styles: [`
    .error-page {
      text-align: center;
      margin-top: 50px;
    }
    button {
      margin-top: 20px;
    }
  `]
})
export class ErrorPageComponent {
  goHome() {
    // Navigate to the home page or another page
    window.location.href = '/';
  }
}
