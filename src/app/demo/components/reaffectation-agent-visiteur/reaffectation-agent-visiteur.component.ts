// components/reaffectation-agent-visiteur-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ReaffectationAgentVisiteurDtos } from '../../api/reaffectationAgentVisiteur';
import { ReaffectationAgentVisiteurService } from '../../service/reaffectation-agent-visiteur.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { KeyValueCentreDtos } from '../../api/keyValues';
import { GeneralService } from '../../service/general/general.service';

@Component({
  selector: 'app-reaffectation-agent-visiteur',
  templateUrl: './reaffectation-agent-visiteur.component.html',
  styleUrls: ['./reaffectation-agent-visiteur.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class ReaffectationAgentVisiteurComponent implements OnInit {
  reaffectations: ReaffectationAgentVisiteurDtos[] = [];
  centres: KeyValueCentreDtos[] = [];
  filteredAgents: KeyValueCentreDtos[] = []; // Agents filtered by source centre
  selectedReaffectation: ReaffectationAgentVisiteurDtos | null = null;
  displayDialog: boolean = false;
  loading: boolean = true;
  loadingAgents: boolean = false;
  reaffectationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private reaffectationService: ReaffectationAgentVisiteurService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
     public generalService: GeneralService
  ) {
    this.reaffectationForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadData();
    this.loadCentres();
    this.setupFormListeners();
  }

  createForm(): FormGroup {
    return this.fb.group({
      id: [0, Validators.required],
      agentId: [null, Validators.required], // New form control
      sourceCentreId: [null, Validators.required],
      destinationCentreId: [null, Validators.required],
      isImmediate: [false],
      dateAffectation: [null],
      dateRetour: [null],
    });
  }

  setupFormListeners(): void {
    // Listen to immediate transfer checkbox changes
    this.reaffectationForm.get('isImmediate')?.valueChanges.subscribe((isImmediate: boolean) => {
      const dateAffectationControl = this.reaffectationForm.get('dateAffectation');
      
     
        dateAffectationControl?.enable();
        dateAffectationControl?.setValue(null);
    });

    // Listen to source centre changes to filter agents
    this.reaffectationForm.get('sourceCentreId')?.valueChanges.subscribe((centreId: number) => {
      this.filterAgentsByCentre(centreId);
      
      // Reset agent selection when source centre changes
      if (centreId) {
        this.reaffectationForm.get('agentId')?.setValue(null);
      }
    });
  }

  filterAgentsByCentre(centreId: number): void {
    if (!centreId) {
      this.filteredAgents = [];
      return;
    }

    this.loadingAgents = true;
    this.reaffectationService.getAgentVisiteursByCentre(centreId).subscribe({
      next: (agents) => {
        this.filteredAgents = agents;
        this.loadingAgents = false;
      },
      error: (error) => {
        this.loadingAgents = false;
        this.handleError('Erreur lors du filtrage des agents');
      }
    });
  }

  loadData(): void {
    this.loading = true;
    this.reaffectationService.getAll().subscribe({
      next: (data) => {
        this.reaffectations = data;
        this.loading = false;
      },
      error: (error) => {
        this.handleError('Erreur lors du chargement des données');
        this.loading = false;
      }
    });
  }

  loadCentres(): void {
    this.reaffectationService.getCentreForLookUp().subscribe({
      next: (data) => {
        this.centres = data;
      },
      error: (error) => {
        this.handleError('Erreur lors du chargement des centres');
      }
    });
  }



  showDialog(reaffectation?: ReaffectationAgentVisiteurDtos): void {
    if (reaffectation) {
      // Edit mode - Recreate the form with existing data
      const isImmediate = !reaffectation.dateAffectation;
      
      this.reaffectationForm = this.fb.group({
        id: [reaffectation.id, Validators.required],
        agentVisiteurId: [reaffectation.agentVisiteurId, Validators.required],
        sourceCentreId: [reaffectation.sourceCentreId, Validators.required],
        destinationCentreId: [reaffectation.destinationCentreId, Validators.required],
        isImmediate: [isImmediate],
        dateAffectation: [reaffectation.dateAffectation!=null?new Date(reaffectation.dateAffectation):null],
        dateRetour: [reaffectation.dateRetour!=null?new Date(reaffectation.dateRetour):null],
      });

      // Filter agents based on source centre
      this.filterAgentsByCentre(reaffectation.sourceCentreId);

      if (isImmediate) {
        this.reaffectationForm.get('dateAffectation')?.disable();
      } else {
        this.reaffectationForm.get('dateAffectation')?.enable();
      }
    } else {
      // Create mode - Recreate the form with default values
      this.reaffectationForm = this.fb.group({
        id: [0, Validators.required],
        agentVisiteurId: [null, Validators.required],
        sourceCentreId: [null, Validators.required],
        destinationCentreId: [null, Validators.required],
        isImmediate: [false],
        dateAffectation: [null],
        dateRetour: [null],
      });
      this.reaffectationForm.get('dateAffectation')?.enable();
      this.filteredAgents = [...this.filteredAgents]; // Reset filtered agents
    }

    // Re-setup listeners after form recreation
    this.setupFormListeners();
    
    this.displayDialog = true;
  }

  save(): void {
    if (this.reaffectationForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const formValue = this.reaffectationForm.getRawValue();
    const reaffectationData: ReaffectationAgentVisiteurDtos = {
      id: formValue.id,
      agentVisiteurId: formValue.agentVisiteurId,
      agentVisiteur: {} as any, // Will be populated by backend
      sourceCentreId: formValue.sourceCentreId,
      sourceCentre: {} as any,
      destinationCentreId: formValue.destinationCentreId,
      destinationCentre: {} as any,
      dateAffectation: formValue.isImmediate ?null : formValue.dateAffectation,
      dateRetour: formValue.dateRetour,
      dateExecution: formValue.dateExecution,
      isImmediate: formValue.isImmediate
    };

    const operation = reaffectationData.id === 0
      ? this.reaffectationService.create(reaffectationData)
      : this.reaffectationService.update(reaffectationData.id, reaffectationData);

    operation.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Opération effectuée avec succès'
        });
        this.displayDialog = false;
        this.loadData();
      },
      error: (error) => {
        this.handleError('Erreur lors de l\'opération');
      }
    });
  }

  deleteReaffectation(id: number): void {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer cette réaffectation ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.reaffectationService.delete(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Réaffectation supprimée avec succès'
            });
            this.loadData();
          },
          error: (error) => {
            this.handleError('Erreur lors de la suppression');
          }
        });
      }
    });
  }

  getCentreName(centreId: number): string {
    const centre = this.centres.find(c => c.key === centreId);
    return centre ? centre.values : 'N/A';
  }

  getAgentName(agentId: number): string {
    const agent = this.filteredAgents.find(a => a.key === agentId);
    return agent ? agent.values : 'N/A';
  }

  markFormGroupTouched(): void {
    Object.keys(this.reaffectationForm.controls).forEach(key => {
      const control = this.reaffectationForm.get(key);
      if (control instanceof FormControl) {
        control.markAsTouched();
      }
    });
  }

  handleError(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Erreur',
      detail: message
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.reaffectationForm.get(fieldName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getFieldError(fieldName: string): string {
    const control = this.reaffectationForm.get(fieldName);
    if (control && control.errors) {
      if (control.errors['required']) {
        return 'Ce champ est requis';
      }
    }
    return '';
  }
}