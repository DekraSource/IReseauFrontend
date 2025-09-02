// formation-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { FormationService } from 'src/app/demo/service/formation.service';
import { KeyValuesDtos } from 'src/app/demo/api/keyValues';

@Component({
  selector: 'app-formation-form',
  templateUrl: './formation-form.component.html'
})
export class FormationFormComponent implements OnInit {
  form: FormGroup;
  loading = false;
  isNew = false;
  isChefCentre = true;
  chefCentres: KeyValuesDtos[] = [];
  agentVisiteurs: KeyValuesDtos[] = [];
  formationTypes: KeyValuesDtos[] = [];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private fb: FormBuilder,
    private formationService: FormationService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      numValidation: [''],
      dateValidation: [null, Validators.required],
      animateur1: [''],
      animateur2: [''],
      dateDebut: [null, Validators.required],
      dateFin: [null, Validators.required],
      chefCentreId: [null],
      agentVisiteurId: [null],
      formationTypeId: [null, Validators.required],
      resultat: [false]
    });

    this.isChefCentre = this.config.data?.isChefCentre ?? true;
  }

  ngOnInit(): void {
    if (this.config.data?.formation) {
      this.isNew = false;
      const formation = this.config.data.formation;
      this.form.patchValue({
        ...formation,
        dateValidation: new Date(formation.dateValidation),
        dateDebut: new Date(formation.dateDebut),
        dateFin: new Date(formation.dateFin)
      });
    } else {
      this.isNew = true;
    }

    this.loadLookups();
    this.updateValidators();
  }

  loadLookups(): void {
    this.formationService.getChefCentres().subscribe(centres => {
      this.chefCentres = centres;
    });
    
    this.formationService.getAgentVisiteurs().subscribe(agents => {
      this.agentVisiteurs = agents;
    });
    
    this.formationService.getFormationTypes().subscribe(types => {
      this.formationTypes = types;
    });
  }

  updateValidators(): void {
    if (this.isChefCentre) {
      this.form.get('agentVisiteurId')?.clearValidators();
      this.form.get('chefCentreId')?.setValidators(Validators.required);
    } else {
      this.form.get('chefCentreId')?.clearValidators();
      this.form.get('agentVisiteurId')?.setValidators(Validators.required);
    }
    this.form.get('agentVisiteurId')?.updateValueAndValidity();
    this.form.get('chefCentreId')?.updateValueAndValidity();
  }

  toggleFormationType(): void {
    this.isChefCentre = !this.isChefCentre;
    this.updateValidators();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Please fill all required fields'
      });
      return;
    }

    this.loading = true;
    const formationData = this.form.value;

    const operation = this.isNew
      ? this.formationService.createFormation(formationData)
      : this.formationService.updateFormation(this.config.data.formation.id, formationData);

    operation.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Formation saved successfully'
        });
        this.ref.close(true);
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error || 'Failed to save Formation'
        });
      }
    });
  }

  onCancel(): void {
    this.ref.close(false);
  }
}