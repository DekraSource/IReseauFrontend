// equipement-validation.component.ts
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EquipementDtos, LigneDtos } from '../../api/equipement';
import { EquipementService } from '../../service/equipement.service';
import { KeyValuesDtos } from '../../api/keyValues';
import { EquipementFormComponent } from '../equipements/equipement-form/equipement-form.component';
import { GeneralService } from '../../service/general/general.service';



@Component({
  selector: 'app-validation-equipements',
  templateUrl: './validation-equipements.component.html',
  providers: [ConfirmationService, MessageService, DialogService]
})
export class ValidationEquipementsComponent implements OnInit {
  equipements: EquipementDtos[] = [];
  selectedEquipements: EquipementDtos[] = [];
  loading = true;
  lignes: LigneDtos[] = [];
  types: KeyValuesDtos[] = [];
  centres: KeyValuesDtos[] = [];
  currentEquipment: EquipementDtos | null = null;
  displayDetail: boolean = false;
  ref: DynamicDialogRef | undefined;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private equipementService: EquipementService,
     public generalService: GeneralService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.equipementService.getAllPourValidation().subscribe({
      next: (data) => {
        this.equipements = data;
        this.loading = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load equipements'
        });
        this.loading = false;
      }
    });

    this.equipementService.getLignesForLookUp().subscribe(data => this.lignes = data);
    this.equipementService.getTypesForLookUp().subscribe(data => this.types = data);
    this.equipementService.getCentresForLookUp().subscribe(data => this.centres = data);
  }

  getRowStyle(equipement: EquipementDtos): any {
    if (equipement.dateSuppression) {
      return {'background-color': 'rgba(220, 53, 69, 0.5)'};
    }
    return {};
  }

  getExpirationStatus(date: Date | undefined): string {
    if (!date) return 'secondary';
    
    const today = new Date();
    const warningDate = new Date();
    warningDate.setDate(today.getDate() + 10);
    const dangerDate = new Date();
    dangerDate.setDate(today.getDate() + 3);

    if (date > warningDate) return 'success';
    if (date > dangerDate) return 'warning';
    return 'danger';
  }

  validateSingle(equipement: EquipementDtos): void {
    this.confirmationService.confirm({
      message: equipement.dateSuppression 
        ? 'Êtes-vous sûr de vouloir valider la suppression?' 
        : 'Êtes-vous sûr de vouloir valider la modification?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.equipementService.valider([equipement.id]).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Opération effectuée avec succès'
            });
            this.loadData();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Erreur est survenue'
            });
          }
        });
      }
    });
  }

  validateSelected(): void {
    if (this.selectedEquipements.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Aucun équipement sélectionné'
      });
      return;
    }

    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir valider les équipements sélectionnés?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const ids = this.selectedEquipements.map(e => e.id);
        this.equipementService.valider(ids).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Opération effectuée avec succès'
            });
            this.loadData();
            this.selectedEquipements = [];
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Erreur est survenue'
            });
          }
        });
      }
    });
  }

editEquipement(equipement: EquipementDtos) {
   this.ref = this.dialogService.open(EquipementFormComponent, {
      header: 'Edit Equipement',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      data: { equipement }
    });

    this.ref.onClose.subscribe((result: boolean) => {
      if (result) {
        this.loadData();
      }
    });
  }



  canValidate(): boolean {
    return true;
  }
}