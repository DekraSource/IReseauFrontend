// agent-visiteur.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { AgentVisiteurFormComponent } from './agent-visiteur-form/agent-visiteur-form.component';
import { AgentVisiteurDtos } from '../../api/agentVisiteur';
import { AgentVisiteurService } from '../../service/agent-visiteur.service';
import { RolesGuard } from '../../service/guard/autorised_roles.guard';
import { GeneralService } from '../../service/general/general.service';

@Component({
  selector: 'app-agent-visiteur',
  templateUrl: './agent-visiteur.component.html',
  styleUrls: ['./agent-visiteur.component.scss'],
  providers: [DialogService, MessageService, ConfirmationService]
})
export class AgentVisiteurComponent implements OnInit {
  agentVisiteurs: AgentVisiteurDtos[] = [];
  loading = true;
  ref: DynamicDialogRef | undefined;

  @ViewChild('dt') dt: Table;

  constructor(
    private agentVisiteurService: AgentVisiteurService,
    public dialogService: DialogService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
     public generalService: GeneralService
  ) { }

  ngOnInit(): void {
    this.loadAgentVisiteurs();
  }

  loadAgentVisiteurs(): void {
    this.loading = true;
    this.agentVisiteurService.getAll().subscribe({
      next: (data) => {
        this.agentVisiteurs = data;
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load agents' });
        this.loading = false;
      }
    });
  }

  openNew(): void {
    this.ref = this.dialogService.open(AgentVisiteurFormComponent, {
      header: 'New Agent Visiteur',
      width: '40%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      data: { agent: null }
    });

    this.ref.onClose.subscribe((result: boolean) => {
      if (result) {
        this.loadAgentVisiteurs();
      }
    });
  }

  editAgent(agent: AgentVisiteurDtos): void {
    this.ref = this.dialogService.open(AgentVisiteurFormComponent, {
      header: 'Edit Agent Visiteur',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      data: { agent }
    });

    this.ref.onClose.subscribe((result: boolean) => {
      if (result) {
        this.loadAgentVisiteurs();
      }
    });
  }

  deleteAgent(id: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this agent?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.agentVisiteurService.delete(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Agent Deleted', life: 3000 });
            this.loadAgentVisiteurs();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete agent' });
          }
        });
      }
    });
  }

  exportData(): void {
    this.agentVisiteurService.export().subscribe({
      next: (data) => {
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'AgentVisiteurs.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to export data' });
      }
    });
  }

  getStatusSeverity(date: Date): string {
    if (!date) return 'info';
    
    const now = new Date();
    const expirationDate = new Date(date);
    const diffDays = Math.floor((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return diffDays > 10 ? 'success' : 'danger';
  }


}