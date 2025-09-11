// etalonnages.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { EtalonnageService } from '../../service/etalonnage.Service';
import { EtalonnageDtos } from '../../api/equipement';
import { EtalonnageFormComponent } from './etalonnages-form/etalonnage-form.component';
import { GeneralService } from '../../service/general/general.service';

@Component({
  selector: 'app-etalonnages',
  templateUrl: './etalonnages.component.html',
  styleUrls: ['./etalonnages.component.scss'],
  providers: [ConfirmationService]
})
export class EtalonnagesComponent implements OnInit {
  @Input() equipementId!: number;
  @Input() isCC = false;
  
  etalonnages: EtalonnageDtos[] = [];
  loading = true;
  ref: DynamicDialogRef | undefined;

  constructor(
    private etalonnageService: EtalonnageService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService,
             public generalService: GeneralService
    
  ) { }

  ngOnInit(): void {
    this.loadEtalonnages();
  }

  loadEtalonnages(): void {
    this.loading = true;
    this.etalonnageService.getByEquipementId(this.equipementId).subscribe({
      next: (data) => {
        this.etalonnages = data;
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load etalonnages' });
        this.loading = false;
      }
    });
  }

  openNew(): void {
    this.ref = this.dialogService.open(EtalonnageFormComponent, {
      header: 'Nouvel étalonnage',
      width: '50%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      data: { 
        equipementId: this.equipementId,
        etalonnage: null 
      }
    });

    this.ref.onClose.subscribe((result: boolean) => {
      if (result) {
        this.loadEtalonnages();
      }
    });
  }

  downloadFile(id: number, fileName: string): void {
    this.etalonnageService.downloadFile(id).subscribe({
      next: (data) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to download file' });
      }
    });
  }

  uploadFile(event: any, etalonnage: EtalonnageDtos): void {
    const file = event.target.files[0];
    if (file) {
      this.etalonnageService.update(etalonnage, file).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'File uploaded successfully' });
          this.loadEtalonnages();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to upload file' });
        }
      });
    }
  }

  deleteEtalonnage(id: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this etalonnage?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.etalonnageService.delete(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Etalonnage Deleted', life: 3000 });
            this.loadEtalonnages();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete etalonnage' });
          }
        });
      }
    });
  }
}