import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UtilisationVehiculeComponent } from './utilisation-vehicule.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '' , component: UtilisationVehiculeComponent }
    ])],
    exports: [RouterModule]
})
export class UtilisationVehiculeRoutingModule { }
