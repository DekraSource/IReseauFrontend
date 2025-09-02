import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// PrimeNG Modules
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';

// Components
import { LignesComponent } from './lignes.component';

// Services
import { LignesService } from '../../service/lignes.service';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        RouterModule.forChild([{ path: '', component: LignesComponent }]),

        // PrimeNG Modules
        ToolbarModule, // <-- Ajoutez cette ligne
        TableModule,
        ToastModule,
        TagModule,
        ButtonModule,
        InputTextModule,
        DropdownModule,
        CalendarModule
    ],
    declarations: [LignesComponent],
    providers: [LignesService]
})
export class LignesModule { }
