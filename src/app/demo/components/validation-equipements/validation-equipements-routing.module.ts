import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ValidationEquipementsComponent } from './validation-equipements.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '' , component: ValidationEquipementsComponent }
    ])],
    exports: [RouterModule]
})
export class ValidationEquipementsRoutingModule { }
