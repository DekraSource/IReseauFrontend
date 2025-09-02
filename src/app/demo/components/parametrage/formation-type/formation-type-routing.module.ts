import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormationTypeComponent } from './formation-type.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '' , component: FormationTypeComponent }
    ])],
    exports: [RouterModule]
})
export class FormationTypeRoutingModule { }
