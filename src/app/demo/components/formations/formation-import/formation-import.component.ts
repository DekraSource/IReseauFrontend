// formation-import.component.ts
import { Component } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import { FormationService } from 'src/app/demo/service/formation.service';
import { FormationExcelDto } from 'src/app/demo/api/formation';

@Component({
  selector: 'app-formation-import',
  templateUrl: './formation-import.component.html'
})
export class FormationImportComponent {
  requiredChefCentre = true;
  uploadedFile: File | null = null;
  formationExcelData: FormationExcelDto[] = [];
  loading = false;

  constructor(
    public ref: DynamicDialogRef,
    private formationService: FormationService,
    private messageService: MessageService
  ) {}

  async onFileSelect(event: any): Promise<void> {
    this.uploadedFile = event.files[0];
    if (!this.uploadedFile) return;

    this.loading = true;
    try {
      // Read Excel file
      const data = await this.readExcelFile(this.uploadedFile);
      
      // Process data
      this.formationExcelData = data.map(row => ({
        isChefCentre: this.requiredChefCentre,
        centre: row[0]?.toString(),
        nomComplete: row[1]?.toString(),
        cin: row[2]?.toString(),
        animateur1: row[3]?.toString(),
        animateur2: row[4]?.toString(),
        dateDebut: this.parseDate(row[5]),
        dateFin: this.parseDate(row[6]),
        dateValidation: this.parseDate(row[7]),
        numValidation: row[8]?.toString(),
        resultat: row[9]?.toString()?.toUpperCase() === 'TRUE',
        formationType: row[10]?.toString()
      }));

      // Verify data with backend
      const verifiedData = await this.formationService.verifyImport(this.formationExcelData).toPromise();
      this.formationExcelData = verifiedData || [];
      this.formationExcelData= this.formationExcelData.sort((a, b) => {
  if (!!a.error === !!b.error) {
    return (a.error ?? '').localeCompare(b.error ?? '');
  }
  return (a.error ? 1 : 0) - (b.error ? 1 : 0); // choose 1 or -1 to switch order
});
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'File processed successfully'
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'Failed to process file'
      });
    } finally {
      this.loading = false;
    }
  }

  private async readExcelFile(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e: any) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          // Skip header row and return data
          resolve(jsonData.slice(1));
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  }

  private parseDate(value: any): Date | undefined {
    if (!value) return undefined;
    
    // Handle Excel serial date numbers
    if (typeof value === 'number') {
      return new Date((value - 25569) * 86400 * 1000);
    }
    
    // Handle string dates
    if (typeof value === 'string') {
      const date = new Date(value);
      return isNaN(date.getTime()) ? undefined : date;
    }
    
    return undefined;
  }

  async submitImport(): Promise<void> {
    if (this.formationExcelData.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'No valid data to import'
      });
      return;
    }

    this.loading = true;
    try {
      await this.formationService.importFormations({
        data: this.formationExcelData.filter(item => !item.error),
        isChefCentre: this.requiredChefCentre
      }).toPromise();

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Data imported successfully'
      });
      this.ref.close(true);
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.error?.message || 'Failed to import data'
      });
    } finally {
      this.loading = false;
    }
  }

  onCancel(): void {
    this.ref.close(false);
  }
}