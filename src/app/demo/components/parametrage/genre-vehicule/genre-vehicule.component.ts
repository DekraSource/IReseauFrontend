// genre-vehicule.component.ts
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { GenreVehiculeDtos, MesureRequiseDtos } from 'src/app/demo/api/genreVehicule';
import { KeyValueCentreDtos } from 'src/app/demo/api/keyValues';
import { GenreVehiculeService } from 'src/app/demo/service/genre-vehicule.service';




@Component({
  selector: 'app-genre-vehicule',
  templateUrl: './genre-vehicule.component.html',
  styleUrls: ['./genre-vehicule.component.scss'],
  providers: [DialogService, MessageService, ConfirmationService]
})
export class GenreVehiculeComponent implements OnInit {
  genreVehicules: GenreVehiculeDtos[] = [];
  vehiculeTypes: KeyValueCentreDtos[] = [];
  energies: KeyValueCentreDtos[] = [];
  mesureTypes: KeyValueCentreDtos[] = [];
  mesureRequises: MesureRequiseDtos[] = [];
  filteredMesureRequises: MesureRequiseDtos[] = [];
  
  selectedEnergieFilter = 0;
  selectedTypeFilter = 0;
  
  visible = false;
  model: GenreVehiculeDtos = {} as GenreVehiculeDtos;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private genreVehiculeService: GenreVehiculeService,
    
  ) {}

  ngOnInit(): void {
    this.getGenreVehicules();
    this.getEnergie();
    this.getVehiculeType();
    this.getMesureType();
  }

  getGenreVehicules(): void {
   this.genreVehiculeService.getGenreVehicules().subscribe(data => {
      this.genreVehicules = data;
    });
  }

  getVehiculeType(): void {
     this.genreVehiculeService.getVehiculeTypes().subscribe(data => {
      this.vehiculeTypes = data;
    });
  }

  getEnergie(): void {
     this.genreVehiculeService.getEnergies().subscribe(data => {
      this.energies = data;
    });
  }

  getMesureType(): void {
     this.genreVehiculeService.getMesureTypes().subscribe(data => {
      this.mesureTypes = data;
    });
  }

  exportData(): void {
     this.genreVehiculeService.export().subscribe(blob => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = 'GenreVehicules.Xlsx';
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }

  edit(genreVehicule: GenreVehiculeDtos): void {
    this.model = genreVehicule;
    this.genreVehiculeService.getMesureRequiseByGenreId(genreVehicule.id).subscribe(data => {
      this.mesureRequises = data;
      this.filteredMesureRequises = data;
      this.visible = true;
    });
  }
ngAfterViewInit() {
}
  cancel(): void {
    this.visible = false;
  }

  submit(): void {
    this.genreVehiculeService.saveMesureRequises(this.mesureRequises).subscribe({
      next: () => {
        this.getGenreVehicules();
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Opération effectuée avec succès'});
        this.visible = false;
      },
      error: (err) => {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Erreur est survenue'});
      }
    });
  }

  exoneration(id: number): void {
   this.confirmationService.confirm({
    message: 'Êtes-vous sûr de vouloir exonérer ce véhicule ?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Oui',
    rejectLabel: 'Non',
    accept: () => {
      this.genreVehiculeService.exoneration(id).subscribe({
        next: () => {
          this.getGenreVehicules();
          this.messageService.add({
            severity: 'success', 
            summary: 'Succès', 
            detail: 'Opération effectuée avec succès'
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error', 
            summary: 'Erreur', 
            detail: 'Erreur est survenue'
          });
        }
      });
    }
  });
  }

  rowStyleFunc(rowData: GenreVehiculeDtos, index: number): any {
    if (!rowData.codeEos) {
      return {'background-color': '#de3123', 'font-style': 'italic'};
    }
    return {};
  }

  cellStyleFunc(rowData: GenreVehiculeDtos): any {
    if (!rowData.codeEos) {
      return {'color': '#fff !important'};
    }
    return {};
  }

  updateFilteredMesureRequises(): void {
    this.filteredMesureRequises = this.mesureRequises.filter(x => 
      (this.selectedEnergieFilter === 0 || x.energieId === this.selectedEnergieFilter) && 
      (this.selectedTypeFilter === 0 || x.vehiculeType === this.selectedTypeFilter)
    );
  }
  getVehiculeTypeName(key: number): string {
  if (!this.vehiculeTypes || !key) return '';
  const type = this.vehiculeTypes.find(t => t.key === key);
  return type ? type.values : '';
}

getEnergieName(key: number): string {
  if (!this.energies || !key) return '';
  const energy = this.energies.find(e => e.key === key);
  return energy ? energy.values : '';
}
}