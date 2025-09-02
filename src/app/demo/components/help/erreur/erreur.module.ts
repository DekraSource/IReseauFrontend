import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErreurComponent } from './erreur.component';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { StyleClassModule } from 'primeng/styleclass';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { FieldsetModule } from 'primeng/fieldset';
import { RippleModule } from 'primeng/ripple';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ErreurService } from 'src/app/demo/service/erreur.service';
import { ErreurRoutingModule } from './erreur-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ToolbarModule,
        MessagesModule,
		MessageModule,
        DialogModule,
        FieldsetModule,
        RippleModule,
		ToastModule,
        FileUploadModule,
        InputTextModule,
		InputTextareaModule,
        TableModule,
        StyleClassModule,
        ButtonModule,
        ErreurRoutingModule,
        PanelModule,
		TooltipModule,
        DropdownModule,
        TagModule,
        DividerModule
    ],
    providers: [ErreurService, ConfirmationService],
    declarations: [ErreurComponent]

})
export class ErreurModule { }
