import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GenreVehiculeComponent } from './genre-vehicule.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '' , component: GenreVehiculeComponent }
    ])],
    exports: [RouterModule]
})
export class GenreVehiculeRoutingModule { }
