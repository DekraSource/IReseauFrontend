import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-erreur',
    templateUrl: './erreur.component.html',
    styleUrls: ['./erreur.component.scss']
})
export class ErreurComponent implements OnInit {
    accessDenied: boolean = false;
    errorMessage: string = "Une erreur est survenue";

    constructor(private router: Router) {
    }

    ngOnInit() {
    }
}