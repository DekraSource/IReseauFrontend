import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CarburantVehiculeComponent } from './carburant-vehicule.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '' , component: CarburantVehiculeComponent }
    ])],
    exports: [RouterModule]
})
export class CarburantVehiculeRoutingModule { }
