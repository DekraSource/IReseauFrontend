import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { MessageService } from 'primeng/api'; // To display messages
import { Router } from '@angular/router';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: any): void {
    const messageService = this.injector.get(MessageService); // Get the MessageService instance
    const router = this.injector.get(Router); // Get the Router instance
    
    let errorMessage = 'Une erreur inattendue est survenue.';

    // Check for network errors
    if (navigator.onLine === false) {
      // If the browser is offline, display a network-related message
      errorMessage = 'Pas de connexion réseau. Veuillez vérifier votre connexion internet.';
    } else if (error instanceof ErrorEvent) {
      // Client-side error (non-HTTP)
      errorMessage = `Erreur côté client : ${error.message}`;
    } else {
      // Server-side or unexpected error
      errorMessage = `Erreur côté serveur : ${error.message}`;
    }

    // Log the error to the console for debugging purposes
    //console.error('Erreur capturée par GlobalErrorHandler:', error);

    // Show error message using PrimeNG's MessageService
    // messageService.add({
    //   severity: 'error',
    //   summary: 'Erreur',
    //   detail: errorMessage,
    //   life: 5000 // The message will be visible for 5 seconds
    // });

    // Optional: Navigate to a generic error page if needed
    // router.navigate(['/error']); // Uncomment if you have an error page

    // Optionally, rethrow the error if you want it to propagate
    //throw error;
  }
}
