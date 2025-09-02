// etalonnage-form.component.ts
import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EtalonnageDtos, InterventionTypeEnum } from 'src/app/demo/api/equipement';
import { KeyValuesDtos } from 'src/app/demo/api/keyValues';
import { EtalonnageService } from 'src/app/demo/service/etalonnage.Service';

@Component({
  selector: 'app-etalonnage-form',
  templateUrl: './etalonnage-form.component.html',
  styleUrls: ['./etalonnage-form.component.scss']
})
export class EtalonnageFormComponent implements OnInit {
  etalonnage: EtalonnageDtos;
  form: FormGroup;
  loading = false;
  interventionTypes: KeyValuesDtos[] = [];
  files: File[] = []; // Similar to Blazor's IList<IBrowserFile>
  isEdit = false;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private fb: FormBuilder,
    private etalonnageService: EtalonnageService,
    private messageService: MessageService
  ) {
    this.etalonnage = this.config.data.etalonnage || {
      id: 0,
      interventionTypeId: -1,
      dateIntervention: new Date(),
      moisExpiration: 0,
      constats: '',
      rapportIntervention: '',
      equipementId: this.config.data.equipementId
    };
    this.isEdit = this.etalonnage.id !== 0;
  }

  ngOnInit(): void {
    this.initForm();
    this.loadInterventionTypes();
  }

  initForm(): void {
    this.form = this.fb.group({
      interventionTypeId: [this.etalonnage.interventionTypeId, Validators.required],
      dateIntervention: [this.etalonnage.dateIntervention, Validators.required],
      moisExpiration: [this.etalonnage.moisExpiration],
      constats: [this.etalonnage.constats],
      file: [null]
    });
  }

  loadInterventionTypes(): void {
    this.etalonnageService.getInterventionTypesForLookUp().subscribe(types => {
      this.interventionTypes = types;
    });
  }

onFileSelect(event: any): void {
    this.files = [];
    if (event.files && event.files.length > 0) {
      const file = event.files[0];
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'File size exceeds 2MB limit'
        });
        return;
      }
      this.files.push(file);
    }
  }
// Similar to Blazor's Submit method
  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all required fields'
      });
      return;
    }

    this.loading = true;
    const formValue = this.form.value;
    const etalonnageToSave: EtalonnageDtos = {
      ...this.etalonnage,
      ...formValue
    };

    try {
      if (this.files.length > 0) {
        // First upload the file
        const filePath = await this.etalonnageService.uploadFile(this.files[0]).toPromise();
        etalonnageToSave.rapportIntervention = filePath;
      } else if (!this.isEdit) {
        throw new Error('Please attach a file');
      }

      // Then save the etalonnage
      const result = await this.etalonnageService.saveEtalonnage(etalonnageToSave).toPromise();
      
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Etalonnage saved successfully'
      });
      this.ref.close(true);
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'Failed to save etalonnage'
      });
    } finally {
      this.loading = false;
    }
  }
  onCancel(): void {
    // this.ref.close(false);
  }

  get isEtalonnage(): boolean {
    return this.form.get('interventionTypeId')?.value === InterventionTypeEnum.Etalonnage;
  }

  get expirationDate(): string | null {
    if (!this.isEtalonnage || !this.form.get('dateIntervention')?.value || !this.form.get('moisExpiration')?.value) {
      return null;
    }
    const date = new Date(this.form.get('dateIntervention')?.value);
    date.setMonth(date.getMonth() + this.form.get('moisExpiration')?.value);
    return date.toLocaleDateString();
  }
}