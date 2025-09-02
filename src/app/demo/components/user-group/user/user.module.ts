import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { MessageService } from 'primeng/api/messageservice';
import { ConfirmationService } from 'primeng/api/confirmationservice';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { PanelModule } from 'primeng/panel';
import { CalendarModule } from 'primeng/calendar';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { PaginatorModule } from 'primeng/paginator';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { TooltipModule } from 'primeng/tooltip';
import { UserComponent } from './user.component';
import {PickListModule} from 'primeng/picklist';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { PasswordModule } from 'primeng/password';

@NgModule({
    imports: [
        CommonModule,
        UserRoutingModule,	
		OverlayPanelModule,
        TableModule,
		FileUploadModule,
		FormsModule,
		ButtonModule,
		RippleModule,
		ToastModule,
		ToolbarModule,
		RatingModule,
		InputTextModule,
		InputTextareaModule,
		DropdownModule,
		RadioButtonModule,
		InputNumberModule,
		MessagesModule,
		MessageModule,
		DialogModule,
		PanelModule,
		CalendarModule,
		InputGroupModule, 
		InputGroupAddonModule,
		PaginatorModule,
		CheckboxModule,
		ReactiveFormsModule,
		SelectButtonModule,
		ConfirmDialogModule,
		ConfirmPopupModule,
		TooltipModule,
		PickListModule,
		ClipboardModule,
		PasswordModule
    ],
    declarations: [UserComponent],
    providers: []
})
export class UserModule { }