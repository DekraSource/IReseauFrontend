import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EquipementsComponent } from './equipements.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '' , component: EquipementsComponent }
    ])],
    exports: [RouterModule]
})
export class EquipementsRoutingModule { }
