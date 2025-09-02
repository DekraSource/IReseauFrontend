import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  isLoading: boolean = false;

    showLoader() {
        this.isLoading = true;
    }

    hideLoader() {
        this.isLoading = false;
    }

}