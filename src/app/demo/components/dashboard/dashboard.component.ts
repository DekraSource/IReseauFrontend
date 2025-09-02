import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { saveAs } from 'file-saver';
import { EquipementControleDtos, TableauBordDtos } from '../../api/tableauBord';
import { EquipementDtos } from '../../api/equipement';
import { DashboardService } from '../../service/dashboard.service';

@Component({
     selector: 'app-index',
     templateUrl: './dashboard.component.html',
     styleUrls: ['./dashboard.component.scss'],
      providers: [MessageService]

})
export class DashboardComponent implements  OnInit {
  tableauBords: TableauBordDtos;
  equipements: EquipementDtos[] = [];
  equipementControles: EquipementControleDtos[] = [];
  loadingEquipements = false;
  loadingControls = false;
  activeIndex = 0;

  constructor(
    private dashboardService: DashboardService,
    private messageService: MessageService
  ) {
    // initialize tableauBords with zero values
    this.tableauBords = {
      TotalCentre: 0,
      TotalAgentVisiteur: 0,
      TotalChefCentre: 0,
      TotalLigne: 0,
      TotalEquipement: 0,
      TotalEquipementEtalonner: 0,
      TotalEquipementNonEtalonner: 0,
      TotalEquipementNonValide: 0,
      TotalFormationAgent: 0,
      TotalFormationAgentValide: 0,
      TotalFormationChef: 0,
      TotalFormationChefValide: 0
    };
  }

  ngOnInit(): void {
    this.loadDashboard();
    this.loadEquipements();
    this.loadEquipementControls();
  }

  loadDashboard() {
    this.dashboardService.getDashboard().subscribe({
      next: (data) => this.tableauBords = data,
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load dashboard data' })
    });
  }

  loadEquipements() {
    this.loadingEquipements = true;
    this.dashboardService.getEquipements().subscribe({
      next: (data) => this.equipements = data,
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load equipment data' }),
      complete: () => this.loadingEquipements = false
    });
  }

  loadEquipementControls() {
    this.loadingControls = true;
    this.dashboardService.getEquipementControles().subscribe({
      next: (data) => this.equipementControles = data,
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load control data' }),
      complete: () => this.loadingControls = false
    });
  }

  getExpirationStatus(date: Date): string {
    if (!date) return 'secondary';
    const today = new Date();
    const diffDays = Math.floor((new Date(date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays > 10) return 'success';
    if (diffDays > 3) return 'warning';
    return 'danger';
  }

  getEquipmentStatus(equipment: EquipementDtos): string {
    if (equipment.dateEnvoiCneh && equipment.isValide) {
      return 'Synchronized';
    } else if (!equipment.isValide) {
      return 'To validate';
    } else if (equipment.isValide && !equipment.dateEnvoiCneh) {
      return 'Sync error';
    }
    return '';
  }

  exportData() {
    this.dashboardService.exportEquipementControles().subscribe({
      next: (blob) => saveAs(blob, 'EquipementParCentre.Xlsx'),
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to export data' })
    });
  }
}
