import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import {GridData, GridQuery, ListControlesDtos, ListTokensDtos} from '../../api/listControles';
import { KeyValueCentreDtos, KeyValuesDtos } from '../../api/keyValues';
import { ListControlesService } from '../../service/list.controles.service';
import {query} from "@angular/animations";

@Component({
  selector: 'app-list-controles',
  templateUrl: './list-controles.component.html',
  styleUrls: ['./list-controles.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class ListControlesComponent implements OnInit {
  centres: KeyValueCentreDtos[] = [];
  centre: KeyValueCentreDtos = { key: 0, values: '' };
  listControle: GridData<ListControlesDtos>;
  listTokens: ListTokensDtos[] = [];
  loading = false;
  displayDialog = false;
  currentControl: ListControlesDtos | null = null;
  constructor(
    private listControlesService: ListControlesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadCentres();
  }

  loadCentres(): void {
    this.listControlesService.getCentres().subscribe({
      next: (centres) => this.centres = centres,
      error: () => this.showError('Failed to load centres')
    });
  }
    loadControle(event: any) {
        const page = event.first / event.rows;
        const size = event.rows;
        this.loading = true;
        const query={
            CentreId: this.centre?.key || -1,
            Page: page,
            PageSize: size,
            Sorts: [],
            Filters: []
        };
        this.listControlesService.getControls(query).subscribe(res => {
            this.listControle = {
                data: res.data,
                totalItems: res.totalItems
            };
            this.loading = false;
        });
    }

  loadControls(): void {
    this.loading = true;
    const query = this.buildQuery();

    this.listControlesService.getControls(query).subscribe({
      next: (response) => {
        this.listControle = response;
        this.loading = false;
      },
      error: () => {
        this.showError('Failed to load controls');
        this.loading = false;
      }
    });
  }

  showControlDetail(control: ListControlesDtos): void {
    this.currentControl = control;
    this.listControlesService.getTokensByControlId(control.id).subscribe({
      next: (tokens) => {
               this.listTokens = tokens;
        this.displayDialog = true;
      },
      error: () => this.showError('Failed to load tokens')
    });
  }
  private buildQuery(): GridQuery {
    return {
      CentreId: this.centre?.key || -1,
      Page: 0,
      PageSize: 10,
      Sorts: [],
      Filters: []
    };
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
  getStatusChip(control: ListControlesDtos): { label: string, color: string } {
  if (control.isCanceled) {
    return { label: 'Canceled', color: 'danger' };
  }
  else if (control.resultat !== undefined && control.resultat !== null) {
    return control.resultat
      ? { label: 'Completed', color: 'success' }
      : { label: 'Failed', color: 'warning' };
  }
  else {
    return { label: 'In Progress', color: 'secondary' };
  }
}
getStatusIcon(control: ListControlesDtos): string {
  if (control.isCanceled) {
    return 'pi pi-times-circle'; // Cancelled icon
  }
  else if (control.resultat !== undefined && control.resultat !== null) {
    return control.resultat
      ? 'pi pi-check-circle' // Completed successfully icon
      : 'pi pi-exclamation-circle'; // Failed icon
  }
  else {
    return 'pi pi-spinner'; // In progress icon (consider adding animation)
  }
}
}
