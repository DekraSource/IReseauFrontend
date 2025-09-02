import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Lignes } from '../../../demo/api/Lignes';
import { LignesService } from '../../service/lignes.service';
import { Table } from 'primeng/table';
import { GeneralService } from '../../service/general/general.service';

@Component({
    selector: 'app-lignes',
    templateUrl: './lignes.component.html',
    styleUrls: ['./lignes.component.scss'],
    providers: [MessageService]
})
export class LignesComponent implements OnInit {
    lignes: Lignes[] = [];
    loading = true;
    @ViewChild('dt') dt: Table;

    constructor(
        private lignesService: LignesService,
        private messageService: MessageService,
         public generalService: GeneralService
    ) { }

    ngOnInit(): void {
        this.loadLignes();
    }

    loadLignes(): void {
        this.loading = true;
        this.lignesService.getAll().subscribe({
            next: (data) => {
                this.lignes = data;
                this.loading = false;
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Échec du chargement des lignes'
                });
                this.loading = false;
            }
        });
    }
}
