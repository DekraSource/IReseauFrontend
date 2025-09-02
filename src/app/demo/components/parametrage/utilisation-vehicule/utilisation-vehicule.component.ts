// utilisation-vehicule.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { UtilisationVehiculeDtos } from 'src/app/demo/api/utilisationVehicule';
import { UtilisationVehiculeService } from 'src/app/demo/service/utilisation-vehicule.service';

@Component({
  selector: 'app-utilisation-vehicule',
  templateUrl: './utilisation-vehicule.component.html',
  styleUrls: ['./utilisation-vehicule.component.scss'],
  providers: [MessageService, DialogService]
})
export class UtilisationVehiculeComponent implements OnInit {
  filterUtilisationVehicules: UtilisationVehiculeDtos[] = [];
  utilisationVehicules: UtilisationVehiculeDtos[] = [];
  visible = false;
  model: UtilisationVehiculeDtos = {} as UtilisationVehiculeDtos;

  constructor(
    private messageService: MessageService,
    private dialogService: DialogService,
    private utilisationVehiculeService: UtilisationVehiculeService
  ) {}

  ngOnInit(): void {
    this.getUtilisationVehicules();
  }

  getUtilisationVehicules(): void {
    this.utilisationVehiculeService.getAll().subscribe(data => {
      this.utilisationVehicules = data;
      this.filterUtilisationVehicules = data;
    });
  }

  edit(utilisationVehicule: UtilisationVehiculeDtos): void {
    this.model = utilisationVehicule;
        this.filterUtilisationVehicules=this.filterUtilisationVehicules.filter(w => 
    w && !w.libelle && w.eosLibelle
  );

    this.visible = true;
  }
  cancel(): void {
    this.visible = false;
  }

  submit(): void {
     this.utilisationVehiculeService.update(this.model).subscribe({
      next: () => {
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Opération effectuée avec succès'});
        this.getUtilisationVehicules();
        this.visible = false;
      },
      error: (err) => {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Erreur est survenue'});
      }
    });
  }

  rowStyleFunc(rowData: any): any {
    if (!rowData.eosLibelle) {
      return {'background-color': '#ffef31', 'font-style': 'italic','color': '#fff'};
    } else if (!rowData.libelle) {
      return {'background-color': '#de3123', 'font-style': 'italic','color': '#fff'};
    }
    return {};
  }

 
}