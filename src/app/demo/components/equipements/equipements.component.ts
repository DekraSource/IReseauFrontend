import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EquipementDtos } from '../../api/equipement';
import { EquipementService } from '../../service/equipement.service';
import { EquipementFormComponent } from './equipement-form/equipement-form.component';
import { Table } from 'primeng/table';
import { GeneralService } from '../../service/general/general.service';

@Component({
  selector: 'app-equipements',
  templateUrl: './equipements.component.html',
  styleUrl: './equipements.component.scss',
  providers: [DialogService, MessageService, ConfirmationService]

})
export class EquipementsComponent implements OnInit {
  equipements: EquipementDtos[] = [];
  loading = true;
  ref: DynamicDialogRef | undefined;
// In your component class
// Add these to your component class
 @ViewChild('dt') dt: Table;

  statutMatchModes = [
    { label: 'Equals', value: 'equals' },
    { label: 'Contains', value: 'contains' }
  ];

  // Custom filter function for Statut column
  filterStatut(value: any, filter: any): boolean {
    if (filter === undefined || filter === null || filter.trim() === '') {
      return true;
    }
    
    const status = this.getSyncStatus(value);
    return status.label.toLowerCase().includes(filter.toLowerCase());
  }

  constructor(
    private equipementService: EquipementService,
    public dialogService: DialogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
     public generalService: GeneralService
  ) { }

  ngOnInit(): void {
    // this.dt.filter['date'] = (value: Date, filter: Date): boolean => {
    //   if (filter === undefined || filter === null) {
    //     return true;
    //   }
    //   return value >= filter;
    // };
    this.loadEquipements();
  }

  loadEquipements(): void {
    this.loading = true;
    this.equipementService.getAll().subscribe({
      next: (data) => {
        this.equipements = data;
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load equipements' });
        this.loading = false;
      }
    });
  }

  openNew(): void {
    this.ref = this.dialogService.open(EquipementFormComponent, {
      header: 'New Equipement',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      data: { equipement: null }
    });

    this.ref.onClose.subscribe((result: boolean) => {
      if (result) {
        this.loadEquipements();
      }
    });
  }

  editEquipement(equipement: EquipementDtos): void {
    this.ref = this.dialogService.open(EquipementFormComponent, {
      header: 'Edit Equipement',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      data: { equipement }
    });

    this.ref.onClose.subscribe((result: boolean) => {
      if (result) {
        this.loadEquipements();
      }
    });
  }

  deleteEquipement(id: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this equipement?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.equipementService.delete(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Equipement Deleted', life: 3000 });
            this.loadEquipements();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete equipement' });
          }
        });
      }
    });
  }

  exportData(): void {
    this.equipementService.export().subscribe({
      next: (data) => {
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Equipements.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to export data' });
      }
    });
  }

  getStatusSeverity(dateExpiration: Date | undefined): string {
    if (!dateExpiration) return 'info';
    
    const now = new Date();
    const expirationDate = new Date(dateExpiration);
    const diffDays = Math.floor((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays > 10) return 'success';
    if (diffDays > 3) return 'warning';
    return 'danger';
  }

  getStatusLabel(isRemplacent: boolean): string {
    return isRemplacent ? 'Remplacement' : 'Principal';
  }

  getStatusSeverityForLabel(isRemplacent: boolean): string {
    return isRemplacent ? 'info' : 'success';
  }

  getSyncStatus(equipement: EquipementDtos): { label: string, severity: string } {
    if ((equipement.dateEnvoiCneh || equipement.isRemplacent) && equipement.isValide) {
      return { label: 'Synchronisé', severity: 'success' };
    }
    if (!equipement.isValide) {
      return { label: 'A valider', severity: 'warning' };
    }
    if (!equipement.isRemplacent && equipement.isValide && !equipement.dateEnvoiCneh) {
      return { label: 'Erreur synchronisation', severity: 'danger' };
    }
    return { label: 'Unknown', severity: 'info' };
  }
}