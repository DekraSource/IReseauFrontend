import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { FormationTypeDtos } from 'src/app/demo/api/formationType';
import { FormationTypeService } from 'src/app/demo/service/formation-type.service';

@Component({
  selector: 'app-formation-type',
  templateUrl: './formation-type.component.html',
  providers: [MessageService, ConfirmationService]
})
export class FormationTypeComponent implements OnInit {
  formationTypes: FormationTypeDtos[] = [];
  visible = false;
  model: FormationTypeDtos = {} as FormationTypeDtos;

  constructor(
    private formationTypeService: FormationTypeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadFormationTypes();
  }

  loadFormationTypes(): void {
    this.formationTypeService.getAll().subscribe({
      next: (data) => this.formationTypes = data,
      error: (err) => this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load formation types'
      })
    });
  }




}