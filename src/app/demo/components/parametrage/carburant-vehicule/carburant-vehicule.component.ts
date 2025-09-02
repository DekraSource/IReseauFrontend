import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CarburantVehiculeDtos } from 'src/app/demo/api/carburantvehicule';
import { CarburantVehiculeService } from 'src/app/demo/service/carburantvehicule.service';

@Component({
  selector: 'app-carburant-vehicule',
  templateUrl: './carburant-vehicule.component.html',
  providers: [MessageService]
})
export class CarburantVehiculeComponent implements OnInit {
  carburantVehicules: CarburantVehiculeDtos[] = [];
  carburantForm: FormGroup;
  displayDialog: boolean = false;

  constructor(
    private fb: FormBuilder,
    private carburantService: CarburantVehiculeService,
    private messageService: MessageService
  ) {
    this.carburantForm = this.fb.group({
      id: [null],
      libelle: [''],
      eosLibelle: [''],
      code: [''],
      eosCode: ['']
    });
  }

  ngOnInit(): void {
    this.loadCarburantVehicules();
  }

  loadCarburantVehicules(): void {
    this.carburantService.getAll().subscribe({
      next: (data: any) => {
        this.carburantVehicules = Array.isArray(data) ? data : [data]; // ensure it's always an array
      },
      error: (err) => {
        console.error('Failed to load carburant vehicules', err);
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Chargement échoué' });
      }
    });
  }

  edit(item: CarburantVehiculeDtos): void {
    this.carburantForm.patchValue(item);
    this.displayDialog = true;
  }

  onCancel(): void {
    this.displayDialog = false;
    this.carburantForm.reset();
  }

  onSubmit(): void {
    const model: CarburantVehiculeDtos = this.carburantForm.value;

    this.carburantService.update(model).subscribe({
      next: (response) => {
        if (response.status === 200 || response.status === 204) {
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Modification réussie' });
          this.loadCarburantVehicules();
          this.displayDialog = false;
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Attention', detail: 'Mise à jour partielle ou non confirmée' });
        }
      },
      error: (err) => {
        console.error('Update failed', err);
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de la mise à jour' });
      }
    });
  }

getRowStyle(rowData: CarburantVehiculeDtos): any {
  if (!rowData.eosCode) {
    return { 'background-color': '#ffef31', 'font-style': 'italic' };
  }
  if (!rowData.code) {
    return { 'background-color': '#de3123', 'font-style': 'italic', 'color': 'white' };
  }
  return {};
}
}
