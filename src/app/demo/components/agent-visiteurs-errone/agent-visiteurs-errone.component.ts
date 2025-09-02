// agent-visiteurs-errone.component.ts
import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { saveAs } from 'file-saver';
import { AgentForCreateDtos } from '../../api/agentVisiteur';
import { AgentVisiteurService } from '../../service/agent-visiteur.service';
import { GeneralService } from '../../service/general/general.service';

@Component({
  selector: 'app-agent-visiteurs-errone',
  templateUrl: './agent-visiteurs-errone.component.html',
  styleUrls: ['./agent-visiteurs-errone.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class AgentVisiteursErroneComponent implements OnInit {
  agentVisiteurs: AgentForCreateDtos[] = [];
  loading: boolean = true;
  pdfFile: File | null = null;

  constructor(
    private agentService: AgentVisiteurService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
      public generalService: GeneralService
  ) {}

  ngOnInit(): void {
    this.loadAgents();
  }

  loadAgents() {
    this.loading = true;
    this.agentService.getAllAgentForCreation().subscribe({
      next: (data) => {
        this.agentVisiteurs = data;
        this.loading = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur lors du chargement des données'
        });
        this.loading = false;
      }
    });
  }

  updateSentStatus(agent) {
    this.agentService.updateSentToCneh(agent.id,agent).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Statut mis à jour'
        });
        this.loadAgents();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Échec de la mise à jour'
        });
      }
    });
  }

  onFileSelect(event: any, agentId: number) {
    const file = event.files[0];
    if (file && file.type === 'application/pdf') {
      this.agentService.uploadCapPdf(agentId, file).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'PDF téléchargé avec succès'
          });
          this.loadAgents();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Échec du téléchargement du PDF'
          });
        }
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Avertissement',
        detail: 'Veuillez sélectionner un fichier PDF'
      });
    }
  }

  delete(id: number) {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.agentService.deleteErroneAgent(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Opération effectuée avec succès'
            });
            this.loadAgents();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Une erreur est survenue'
            });
          }
        });
      }
    });
  }

  exportToCsv() {
    const headers = ['Centre', 'Cin', 'Numero Cap', 'Etat', 'Envoyé à CNEH'];
    const csvData = [
      headers.join(','),
      ...this.agentVisiteurs.map(agent => 
        `${agent.centre},${agent.cin},${agent.cap},${agent.etat},${agent.isSentToCneh ? 'Oui' : 'Non'}`
      )
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'agents.csv');
  }

  downloadCapPdf(id: number, fileName: string) {
    this.agentService.downloadCapPdf(id).subscribe({
      next: (blob) => {
        saveAs(blob, fileName || 'document.pdf');
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Échec du téléchargement du fichier'
        });
      }
    });
  }

}