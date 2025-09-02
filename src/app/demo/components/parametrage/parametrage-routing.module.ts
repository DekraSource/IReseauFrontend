import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
// import { AuthGuard } from '../../service/guard/auth.guard';
// import { AutorisedGuard } from '../../service/guard/autorised.guard';

@NgModule({
    imports: [RouterModule.forChild([

        { path: '', loadChildren: () => import('./carburant-vehicule/carburant-vehicule.module').then(m => m.CarburantVehiculeModule) },

        //{ path: 'equipement-types', loadChildren: () => import('./equipement-types/equipement-types.module').then(m => m.EquipementTypesModule) },
        //{ path: 'genre-vehicule', loadChildren: () => import('./genre-vehicule/genre-vehicule.module').then(m => m.GenreVehiculeModule) },
        //{ path: 'marque-vehicule', loadChildren: () => import('./marque-vehicule/marque-vehicule.module').then(m => m.MarqueVehiculeModule) },
        // { path: 'utilisation-vehicule', loadChildren: () => import('./utilisation-vehicule/utilisation-vehicule.module').then(m => m.UtilisationVehiculeModule) },
        // { path: 'formation-type', loadChildren: () => import('./formation-type/formation-type.module').then(m => m.FormationTypeModule) },
        // { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class ParametragesRoutingModule { }
//   { path: 'equipement-types', component: EquipementTypesComponent },
//                 { path: 'carburant-vehicule', component: CarburantVehiculeComponent },
//                 { path: 'genre-vehicule', component: GenreVehiculeComponent },
//                 { path: 'marque-vehicule', component: MarqueVehiculeComponent },
//                 { path: 'utilisation-vehicule', component: UtilisationVehiculeComponent },
//                 { path: 'formation-type', component: FormationTypeComponent },
//                 { path: '', redirectTo: 'equipement-types', pathMatch: 'full' }
