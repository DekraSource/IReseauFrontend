import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KeyValuesDtos } from 'src/app/demo/api/keyValues';
import { EquipementDtos, LigneDtos } from 'src/app/demo/api/equipement';
import { EquipementService } from 'src/app/demo/service/equipement.service';
import { GeneralService } from 'src/app/demo/service/general/general.service';
@Component({
  selector: 'app-equipement-form',
  templateUrl: './equipement-form.component.html',
  styleUrl: './equipement-form.component.scss'
})
export class EquipementFormComponent implements OnInit {
  equipement: EquipementDtos;
  form: FormGroup;
  loading = false;
  centres: KeyValuesDtos[] = [];
  types: KeyValuesDtos[] = [];
  lignes: LigneDtos[] = [];
  filteredLignes: LigneDtos[] = [];
  isEdit = false;
  isCC = false; // Should be set based on user role

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private fb: FormBuilder,
    private equipementService: EquipementService,
    private messageService: MessageService,
         public generalService: GeneralService

  ) {
    this.equipement = this.config.data.equipement || {
      id: 0,
      identifiant: '',
      isRemplacent: false,
      marque: '',
      modele: '',
      protocole: '',
      referenceHomologation: '',
      ligneCentreId: -1,
      ligneId: -1,
      equipementTypeId: -1,
      societeEtalonnage: '',
      adresseSocieteEtalonnage: '',
      telSocieteEtalonnage: ''
    };
    this.isEdit = this.equipement.id !== 0;
  }

  ngOnInit(): void {
    this.initForm();
    this.loadLookups();
  }

  initForm(): void {
    this.form = this.fb.group({
      identifiant: [this.equipement.identifiant, Validators.required],
      isRemplacent: [this.equipement.isRemplacent],
      marque: [this.equipement.marque, Validators.required],
      modele: [this.equipement.modele, Validators.required],
      protocole: [this.equipement.protocole, Validators.required],
      referenceHomologation: [this.equipement.referenceHomologation, Validators.required],
      ligneCentreId: [this.equipement.ligneCentreId, Validators.required],
      ligneId: [this.equipement.ligneId, Validators.required],
      equipementTypeId: [this.equipement.equipementTypeId, Validators.required],
      dateEtalonnage: [this.equipement.dateEtalonnage ? new Date(this.equipement.dateEtalonnage) : null],
      dateExpirationEtalonnage: [this.equipement.dateExpirationEtalonnage ? new Date(this.equipement.dateExpirationEtalonnage) : null],
      dateHomologation: [this.equipement.dateHomologation ? new Date(this.equipement.dateHomologation) : null],
      dateMiseService: [this.equipement.dateMiseService ? new Date(this.equipement.dateMiseService) : null],
      societeEtalonnage: [this.equipement.societeEtalonnage],
      adresseSocieteEtalonnage: [this.equipement.adresseSocieteEtalonnage],
      telSocieteEtalonnage: [this.equipement.telSocieteEtalonnage]
    });

    if (this.isEdit &&  !this.generalService.canActivate('U-Id')) {
      this.form.get('identifiant')?.disable();
    }
     this.form.get('ligneCentreId')?.valueChanges.subscribe(s => {
      this.filterLignes();
      this.form.get('ligneId')?.setValue(this.equipement.ligneId);
    });
  }

  loadLookups(): void {
    this.equipementService.getCentresForLookUp().subscribe(centres => {
      this.centres = centres;
    });

    this.equipementService.getTypesForLookUp().subscribe(types => {
      this.types = types;
    });

    this.equipementService.getLignesForLookUp().subscribe(lignes => {
      this.lignes = lignes;
      this.filterLignes();
    });
  }

  onCentreChange(): void {
    this.filterLignes();
    this.form.patchValue({ ligneId: -1 });
  }

  filterLignes(): void {
    const centreId = this.form.get('ligneCentreId')?.value;
    this.filteredLignes = this.lignes.filter(l => l.centreId === centreId);
    this.filteredLignes.forEach(element => {
      element.displayName=element.type +'/' +element.numLigne
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields' });
      return;
    }

    this.loading = true;
    const formValue = this.form.getRawValue();
    const equipementToSave: EquipementDtos = {
      ...this.equipement,
      ...formValue
    };

    const saveOperation = this.isEdit
      ? this.equipementService.update(equipementToSave)
      : this.equipementService.add(equipementToSave);

    saveOperation.subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Equipement saved successfully' });
        this.ref.close(true);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save equipement' });
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.ref.close(false);
  }
}