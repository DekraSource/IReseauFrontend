import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EtalonnagesComponent } from './etalonnages.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '' , component: EtalonnagesComponent }
    ])],
    exports: [RouterModule]
})
export class EtalonnagesRoutingModule { }
