
// chef-centres.component.ts
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ChefCentreDtos } from '../../api/chefcentre';
import { KeyValuesDtos } from '../../api/keyValues';
import { ChefCentreService } from '../../service/chef-centre.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ChefCentreFormComponent } from './chef-centre-form/chef-centre-form.component';
import { GeneralService } from '../../service/general/general.service';

@Component({
  selector: 'app-chef-centre',
  templateUrl: './chef-centre.component.html',
  styleUrls: ['./chef-centre.component.scss'],
  providers: [DialogService, MessageService, ConfirmationService]
})
export class ChefCentreComponent implements OnInit {
  chefCentres: ChefCentreDtos[] = [];
  centres: KeyValuesDtos[] = [];
  niveauFormationTypes: KeyValuesDtos[] = [];
  loading = true;
    ref: DynamicDialogRef | undefined;
  
  // Form dialog state
  showForm = false;
  currentChefId?: number;
  formEditMode = false;
  selectedChef: ChefCentreDtos = null;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private chefService: ChefCentreService,
        public dialogService: DialogService,
          public generalService: GeneralService
    
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.chefService.getAll().subscribe({
      next: (data) => {
        this.chefCentres = data;
        this.loading = false;
      },
      error: () => {
        this.showError('Failed to load data');
        this.loading = false;
      }
    });

    this.chefService.getCentresForLookUp().subscribe(data => this.centres = data);
    this.chefService.getNiveauFormationTypes().subscribe(data => this.niveauFormationTypes = data);
  }

  openNewForm(): void {
       this.ref = this.dialogService.open(ChefCentreFormComponent, {
         header: 'New chef  centre',
         width: '70%',
         contentStyle: { overflow: 'auto' },
         baseZIndex: 10000,
         data: { chef: null }
       });
   
       this.ref.onClose.subscribe((result: boolean) => {
         if (result) {
           this.loadData();
         }
       });
  }

  editChef(chef: ChefCentreDtos): void {
  this.ref = this.dialogService.open(ChefCentreFormComponent, {
         header: 'edit chef  centre',
         width: '70%',
         contentStyle: { overflow: 'auto' },
         baseZIndex: 10000,
         data: { chef }
       });
   
       this.ref.onClose.subscribe((result: boolean) => {
         if (result) {
           this.loadData();
         }
       });
  }

  handleFormSubmit(formData: any): void {
    const operation = this.formEditMode 
      ? this.chefService.update(this.currentChefId!, formData)
      : this.chefService.create(formData);

    operation.subscribe({
      next: () => {
        this.showSuccess(`Chef Centre ${this.formEditMode ? 'updated' : 'created'} successfully`);
        this.loadData();
        this.showForm = false;
      },
      error: () => this.showError('Operation failed')
    });
  }

  confirmDelete(id: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this record?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.chefService.delete(id).subscribe({
          next: () => {
            this.showSuccess('Chef Centre deleted successfully');
            this.loadData();
          },
          error: () => this.showError('Delete failed')
        });
      }
    });
  }

  exportData(): void {
    this.chefService.export().subscribe(blob => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = 'ChefCentres.xlsx';
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }

  isAdminOrHotline(): boolean {
    return true;
  }

  isAdminOrHotlineOrCC(): boolean {
    return true;
  }

  private showSuccess(message: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message
    });
  }

  private showError(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message
    });
  }
}