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
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';

// Components
import { EquipementTypesComponent } from './equipement-types.component';
import {EquipementTypeService} from "../../../service/equipement-types.service";

// Services


@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        RouterModule.forChild([{ path: '', component: EquipementTypesComponent }]),

        // PrimeNG Modules
        ToolbarModule,
        TableModule,
        ToastModule,
        TagModule,
        InputTextModule,
        DropdownModule
    ],
    declarations: [EquipementTypesComponent],
    providers: [EquipementTypeService]
})
export class EquipementTypesModule { }
