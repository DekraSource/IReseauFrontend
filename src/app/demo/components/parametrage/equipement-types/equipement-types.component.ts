import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import {EquipementTypeService} from "../../../service/equipement-types.service";
import {EquipementType} from "../../../api/equipementTypes";

@Component({
    selector: 'app-equipement-types',
    templateUrl: './equipement-types.component.html',
    styleUrls: ['./equipement-types.component.scss'],
    providers: [MessageService]
})
export class EquipementTypesComponent implements OnInit {
    equipementTypes: EquipementType[] = [];
    loading = true;
    @ViewChild('dt') dt: Table;

    constructor(
        private equipementTypeService: EquipementTypeService,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.loadEquipementTypes();
    }

    loadEquipementTypes(): void {
        this.loading = true;
        this.equipementTypeService.getAll().subscribe({
            next: (data) => {
                this.equipementTypes = data;
                this.loading = false;
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Échec du chargement des types d\'équipements'
                });
                this.loading = false;
            }
        });
    }
}
