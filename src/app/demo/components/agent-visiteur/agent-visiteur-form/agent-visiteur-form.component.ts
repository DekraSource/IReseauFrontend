// agent-visiteur-form.component.ts
import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgentVisiteurService } from 'src/app/demo/service/agent-visiteur.service';
import { AffecterAgentDtos, AgentVisiteurDtos } from 'src/app/demo/api/agentVisiteur';
import { KeyValuesDtos } from 'src/app/demo/api/keyValues';

@Component({
  selector: 'app-agent-visiteur-form',
  templateUrl: './agent-visiteur-form.component.html',
  styleUrls: ['./agent-visiteur-form.component.scss']
})
export class AgentVisiteurFormComponent implements OnInit {
  agent: AgentVisiteurDtos;
  affecterAgent: AffecterAgentDtos;
  form: FormGroup;
  affecterForm: FormGroup;
  loading = false;
  centres: KeyValuesDtos[] = [];
  isNew = false;
  showAffecterForm = false;
  filteredCentres: KeyValuesDtos[] = [];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private fb: FormBuilder,
    private agentVisiteurService: AgentVisiteurService,
    private messageService: MessageService
  ) {
    this.agent = this.config.data.agent || this.getDefaultAgent();
    this.affecterAgent = this.getDefaultAffecterAgent();
    this.isNew = this.agent.id === 0;
    this.showAffecterForm = this.isNew;
  }

  ngOnInit(): void {
    this.initForms();
    this.loadCentres();
  }

  private getDefaultAgent(): AgentVisiteurDtos {
    return {
      id: 0,
      centreId: -1,
      numeroCap: '',
      nom: '',
      prenom: '',
      mail: '',
      tel: '',
      cin: '',
      cnss: '',
      statutAdministratif: '',
      anneeAutorisation: null,
      dateAffectation: null,
      dateCap: null,
      dateExpirationCap: null,
      categorieCap: '',
      isActif: true
    };
  }

  private getDefaultAffecterAgent(): AffecterAgentDtos {
    return {
      numeroCap: '',
      cin: '',
      centreId: -1
    };
  }

  initForms(): void {
      this.form = this.fb.group({
          centreId: [this.agent.centreId, Validators.required],
          numeroCap: [{value: this.agent.numeroCap, disabled: true}, Validators.required],
          nom: [{value: this.agent.nom, disabled: true}, Validators.required],
          prenom: [{value: this.agent.prenom, disabled: true}, Validators.required],
          mail: [this.agent.mail, [Validators.required, Validators.email]],
          tel: [this.agent.tel, Validators.required],
          cin: [{value: this.agent.cin, disabled: true}, Validators.required],
          cnss: [this.agent.cnss],
          statutAdministratif: [this.agent.statutAdministratif],
          anneeAutorisation: [this.agent.anneeAutorisation ? Number(this.agent.anneeAutorisation) : null],
          dateAffectation: [this.agent.dateAffectation ? new Date(this.agent.dateAffectation) : null],
          dateCap: [{value: this.agent.dateCap ? new Date(this.agent.dateCap) : null, disabled: true}],
          dateExpirationCap: [{value: this.agent.dateExpirationCap ? new Date(this.agent.dateExpirationCap) : null, disabled: true}],
          categorieCap: [this.agent.categorieCap],
          isActif: [this.agent.isActif]
      });

    this.affecterForm = this.fb.group({
      numeroCap: [this.affecterAgent.numeroCap, Validators.required],
      cin: [this.affecterAgent.cin, Validators.required],
      centreId: [this.affecterAgent.centreId, Validators.required]
    });
  }

  loadCentres(): void {
    this.agentVisiteurService.getCentresForLookUp().subscribe({
      next: (centres) => {
        this.centres = centres;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load centres'
        });
      }
    });
  }

  onAffecter(): void {
    if (this.affecterForm.invalid) {
      this.affecterForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Please fill all required fields'
      });
      return;
    }

    this.loading = true;
    this.agentVisiteurService.affecterAgent(this.affecterForm.value).subscribe({
      next: (agent) => {
        this.agent = agent;
        this.form.patchValue(agent);
        this.showAffecterForm = false;
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Agent assigned successfully'
        });
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error || 'Failed to assign agent'
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
    const agentToSave = { ...this.agent, ...this.form.getRawValue() };

    const saveOperation = this.isNew
      ? this.agentVisiteurService.create(agentToSave)
      : this.agentVisiteurService.update(agentToSave.id, agentToSave);

    saveOperation.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Agent saved successfully'
        });
        this.ref.close(true);
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error || 'Failed to save agent'
        });
      }
    });
  }

  onCancel(): void {
    this.ref.close(false);
  }
}
