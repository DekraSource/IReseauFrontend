import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MarqueVehiculeComponent } from './marque-vehicule.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '' , component: MarqueVehiculeComponent }
    ])],
    exports: [RouterModule]
})
export class MarqueVehiculeRoutingModule { }
