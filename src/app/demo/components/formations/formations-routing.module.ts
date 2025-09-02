import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormationsComponent } from './formations.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '' , component: FormationsComponent }
    ])],
    exports: [RouterModule]
})
export class FormationsRoutingModule { }
