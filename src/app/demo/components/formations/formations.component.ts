import { Component, OnInit } from '@angular/core';
import { FormationDto } from '../../api/formation';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { FormationService } from '../../service/formation.service';
import { FormationImportComponent } from './formation-import/formation-import.component';
import { FormationFormComponent } from './formation-form/formation-form.component';
import { GeneralService } from '../../service/general/general.service';
// import { FormationFormComponent } from './formation-form/formation-form.component';
// import { FormationImportComponent } from './formation-import/formation-import.component';

@Component({
  selector: 'app-formations',
  templateUrl: './formations.component.html',
  styleUrl: './formations.component.scss',
  providers: [DialogService, MessageService, ConfirmationService]
})
export class FormationsComponent implements OnInit {
  formations: FormationDto[] = [];
  loading = true;
  isChefCentre: boolean = true;  // default
  searchText = '';
  tabItems: MenuItem[] = [];
  activeItem!: MenuItem;
  constructor(
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private formationService: FormationService,
     public generalService: GeneralService
  ) {}

  ngOnInit(): void {
    this.tabItems = [
      {
        label: 'Chef Centre',
        icon: 'pi pi-briefcase',   // ✅ Add icon
        id: 'chef',
        command: () => {
          this.isChefCentre = true;
          this.loadFormations();
          
          this.activeItem = this.tabItems[0];
          this.updateTabClasses();
        }
      },
      {
        label: 'Agent Visiteur',
        icon: 'pi pi-user',   // ✅ Add icon
        id: 'agent',
        command: () => {
          this.isChefCentre = false;
          this.loadFormations();
          
          this.activeItem = this.tabItems[1];
          this.updateTabClasses();
        }
      }
    ];
    // Default selection
    this.activeItem = this.tabItems[0];
              this.updateTabClasses();

    this.loadFormations();
  }
updateTabClasses() {
  this.tabItems[0].styleClass = this.isChefCentre ? 'tab-active' : '';
  this.tabItems[1].styleClass = !this.isChefCentre ? 'tab-active' : '';
}
  loadFormations(): void {
    this.loading = true;
   if (this.isChefCentre==true) {
     this.formationService.getAllForChefCentre().subscribe({
      next: (data) => {
        this.formations = data;
        this.loading = false;
      },
      error: () => {
        this.showError('Failed to load formations');
        this.loading = false;
      }
    });
   }else
   {
this.formationService.getAllForAgentVisiteur().subscribe({
      next: (data) => {
        this.formations = data;
        this.loading = false;
      },
      error: () => {
        this.showError('Failed to load formations');
        this.loading = false;
      }
    });
   }
  }



  openNewForm(): void {
    const ref = this.dialogService.open(FormationFormComponent, {
      header: 'New Formation',
      width: '70%',
      data: {
        isChefCentre: this.isChefCentre
      }
    });

    ref.onClose.subscribe((reload: boolean) => {
      if (reload) {
        this.loadFormations();
      }
    });
  }
openImportDialog(): void {
    const ref = this.dialogService.open(FormationImportComponent, {
      header: 'Import Formations',
      width: '100%',
      height: '100%',
      style: { 'max-height': '100%' }
    });

    ref.onClose.subscribe((reload: boolean) => {
      if (reload) {
        this.loadFormations();
      }
    });
  }
  editFormation(formation: FormationDto): void {
    const ref = this.dialogService.open(FormationFormComponent, {
      header: 'Edit Formation',
      width: '70%',
      data: {
        formation: formation,
        isChefCentre: this.isChefCentre
      }
    });

    ref.onClose.subscribe((reload: boolean) => {
      if (reload) {
        this.loadFormations();
      }
    });
  }

  confirmDelete(id: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this record?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.formationService.deleteFormation(id).subscribe({
          next: () => {
            this.showSuccess('Formation deleted successfully');
            this.loadFormations();
          },
          error: () => this.showError('Delete failed')
        });
      }
    });
  }



  canImport(): boolean {
return true;
  }

  canEdit(): boolean {
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