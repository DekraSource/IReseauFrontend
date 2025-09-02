import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from 'primeng/api'; // For toast notifications
import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';
import { LoadingService } from '../loading.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(
    private storageService: AuthGuard,
    private router: Router,
    private _loadingService: LoadingService,
    private messageService: MessageService // Injecting MessageService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.storageService.get_DataSession('jwt_token');
    
    // Attach token to headers if available
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        this._loadingService.isLoading = false; // Ensure to hide loader

        let errorMessage = '';

       // Handle Network Errors (status === 0 and navigator.onLine is false)
       if (error.status === 0 && !navigator.onLine) {
        errorMessage = 'Pas de connexion réseau. Veuillez vérifier votre connexion internet.';
      } 
      // Handle Server Unreachable (status === 0 and navigator.onLine is true, likely a CORS or server issue)
      else if (error.status === 0 && navigator.onLine) {
        errorMessage = 'Le serveur est injoignable. Veuillez réessayer plus tard ou contacter support.';
      } 
      // Handle HTTP errors with specific status codes
      else {
        switch (error.status) {
          case 400: 
          if (error.error?.message) {
            errorMessage = `Erreur: ${error.error.message}`;
          } else {
            errorMessage = 'Erreur de requête, veuillez vérifier les informations fournies.';
          }
            break;
          case 401: // Unauthorized
            errorMessage = 'Votre session a expiré. Veuillez vous reconnecter.';
            this.router.navigate(['/auth']);
            localStorage.clear();
            break;
          case 403: // Forbidden
            errorMessage = "Vous n'avez pas l'autorisation d'effectuer cette action.";
            break;
          case 404: // Not Found
            errorMessage = 'La ressource demandée est introuvable.';
            break;
          case 500: // Internal Server Error
            errorMessage = 'Une erreur du serveur est survenue. Veuillez réessayer plus tard.';
            break;
          default:
            errorMessage = `Erreur inattendue : ${error.message}`;
        }
      }

        // Check for warnings in the error response
        if (error.error?.warnings) {
          error.error.warnings.forEach((warning: string) => {
            this.messageService.add({
              severity: 'warn',
              summary: 'Avertissement',
              detail: warning,
              life: 5000,
            });
          });
        } else {
        // Display the error message via PrimeNG Toast with severity, summary, and life
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Erreur', 
          detail: errorMessage, 
          life: 5000 // Display message for 5 seconds
        });
      }

        return throwError(() => error);
      })
    );
  }
}

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
];