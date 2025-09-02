// chef-centre-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { ChefCentreService } from 'src/app/demo/service/chef-centre.service';
import { KeyValuesDtos } from 'src/app/demo/api/keyValues';
import { ChefCentreDtos } from 'src/app/demo/api/chefcentre';


@Component({
  selector: 'app-chef-centre-form',
  templateUrl: './chef-centre-form.component.html',
  styleUrls: ['./chef-centre-form.component.scss']
})
export class ChefCentreFormComponent implements OnInit {
  chef: ChefCentreDtos;
  form: FormGroup;
  loading = false;
  isNew = false;
  centres: KeyValuesDtos[] = [];
  niveauFormationTypes: KeyValuesDtos[] = [];
  sexeOptions = [
    { label: 'Homme', value: 'Homme' },
    { label: 'Femme', value: 'Femme' }
  ];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private fb: FormBuilder,
    private chefService: ChefCentreService,
    private messageService: MessageService
  ) {
    this.chef = this.config.data.chef || this.getDefaultChef();
    this.isNew = this.chef.id === 0;
  }

  ngOnInit(): void {
    this.initForm();
    this.loadLookups();
  }

  private getDefaultChef(): ChefCentreDtos {
    return {
      id: 0,
      nom: '',
      prenom: '',
      email: '',
      niveauFormationTypeId: -1,
      centreId: -1,
      tel: '',
      cin: '',
      cnss: '',
      sexe: '',
      dateAffectaion: null
    };
  }

  initForm(): void {
    this.form = this.fb.group({
      nom: [this.chef.nom, Validators.required],
      prenom: [this.chef.prenom],
      email: [this.chef.email, [Validators.email]],
      niveauFormationTypeId: [this.chef.niveauFormationTypeId],
      centreId: [this.chef.centreId, Validators.required],
      tel: [this.chef.tel],
      cin: [this.chef.cin],
      cnss: [this.chef.cnss],
      sexe: [this.chef.sexe],
      dateAffectaion: [this.chef.dateAffectaion ? new Date(this.chef.dateAffectaion) : null],

    });

    if (this.centres.length === 1) {
      this.form.patchValue({ centreId: this.centres[0].Key });
    }
  }

  loadLookups(): void {
    this.chefService.getCentresForLookUp().subscribe({
      next: (centres) => {
        this.centres = centres;
        this.initForm(); // Re-initialize form after centres load
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load centres'
        });
      }
    });

    this.chefService.getNiveauFormationTypes().subscribe({
      next: (types) => {
        this.niveauFormationTypes = types;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load education levels'
        });
      }
    });
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
    const chefToSave = { ...this.chef, ...this.form.value };

    const saveOperation = this.isNew
      ? this.chefService.create(chefToSave)
      : this.chefService.update(chefToSave.id, chefToSave);

    saveOperation.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Chef Centre saved successfully'
        });
        this.ref.close(true);
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error || 'Failed to save Chef Centre'
        });
      }
    });
  }

  onCancel(): void {
    this.ref.close(false);
  }
}