import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EquipementTypesComponent } from './equipement-types.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '' , component: EquipementTypesComponent }
    ])],
    exports: [RouterModule]
})
export class EquipementTypesRoutingModule { }
