// marque-vehicule.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { MarqueVehiculeDtos } from 'src/app/demo/api/marqueVehicule';
import { MarqueVehiculeService } from 'src/app/demo/service/marque-vehicule.service';

@Component({
  selector: 'app-marque-vehicule',
  templateUrl: './marque-vehicule.component.html',
  styleUrls: ['./marque-vehicule.component.scss'],
  providers: [MessageService]
})
export class MarqueVehiculeComponent implements OnInit {
  marqueVehicules: MarqueVehiculeDtos[] = [];
  model: MarqueVehiculeDtos = {} as MarqueVehiculeDtos;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private marqueVehiculeService: MarqueVehiculeService
  ) {}

  ngOnInit(): void {
    this.getMarqueVehicules();
  }

  getMarqueVehicules(): void {
   this.marqueVehiculeService.getAll().subscribe(data => {
      this.marqueVehicules = data;
    });
  }

  edit(marque: MarqueVehiculeDtos): void {
     this.marqueVehiculeService.update(marque).subscribe({
      next: () => {
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Opération effectuée avec succès'});
        this.getMarqueVehicules();
      },
      error: (err) => {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Erreur est survenue'});
      }
    });
  }

rowStyleFunc(item: any): any {
  if (!item.codeEos) {
    return {'background-color': '#de3123', 'font-style': 'italic','color': '#fff'};
  }
  return {};
}

  cellStyleFunc(rowData: MarqueVehiculeDtos): any {
    if (!rowData.codeEos) {
      return {'color': '#fff !important'};
    }
    return {};
  }
}