import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { OrderListModule } from 'primeng/orderlist';
import { CardModule } from 'primeng/card';
import { TimelineModule } from 'primeng/timeline';
import { ScrollerModule } from 'primeng/scroller';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { SkeletonModule } from 'primeng/skeleton';
import { ParametrageNotificationsRoutingModule } from './parametrage-notifications-routing.module';
import { DialogModule } from 'primeng/dialog';
import {ParametrageNotificationsComponent} from "./parametrage-notifications.component";
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {  InputTextareaModule } from 'primeng/inputtextarea';
import { EditorModule } from 'primeng/editor';

@NgModule({
    imports: [

         CommonModule, // Use CommonModule for feature modules
                 FormsModule,
                 ChartModule,
                 MenuModule,
                 TableModule,
                 StyleClassModule,
                 PanelMenuModule,
                 ButtonModule,
                 ParametrageNotificationsRoutingModule,
                 ProgressBarModule,
                 ToastModule,
                 PanelModule,
                TagModule,
                TooltipModule ,
                CheckboxModule,
                 DropdownModule,
                 OrderListModule,
                 CardModule,
                 TimelineModule,
                 ScrollerModule,
                SelectButtonModule,
                 CalendarModule,
                 InputNumberModule,
                 InputTextModule,
                 SkeletonModule,
                  FormsModule,
           ReactiveFormsModule,
           DialogModule,
           ToolbarModule,
           ConfirmDialogModule,
           InputTextareaModule,
           EditorModule
    ],
    declarations: [ParametrageNotificationsComponent]
})
export class ParametrageNotificationsModule { }
