import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { AuthGuard } from './demo/service/guard/auth.guard';
import { AutorisedGuard } from './demo/service/guard/autorised.guard';
import { ErrorPageComponent } from './demo/components/auth/error/error.component';
import { EquipementTypesComponent } from './demo/components/parametrage/equipement-types/equipement-types.component';
import { CarburantVehiculeComponent } from './demo/components/parametrage/carburant-vehicule/carburant-vehicule.component';
import { GenreVehiculeComponent } from './demo/components/parametrage/genre-vehicule/genre-vehicule.component';
import { MarqueVehiculeComponent } from './demo/components/parametrage/marque-vehicule/marque-vehicule.component';
import { UtilisationVehiculeComponent } from './demo/components/parametrage/utilisation-vehicule/utilisation-vehicule.component';
import { FormationTypeComponent } from './demo/components/parametrage/formation-type/formation-type.component';
import { ChefCentreComponent } from './demo/components/chef-centre/chef-centre.component';
import { FormationsComponent } from './demo/components/formations/formations.component';
import { EquipementsComponent } from './demo/components/equipements/equipements.component';
import { ValidationEquipementsComponent } from './demo/components/validation-equipements/validation-equipements.component';
import { LignesComponent } from './demo/components/lignes/lignes.component';
import { ListControlesComponent } from './demo/components/list-controles/list-controles.component';
import { AgentVisiteursErroneComponent } from './demo/components/agent-visiteurs-errone/agent-visiteurs-errone.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
            {
                path: '',canActivate: [AuthGuard], component: AppLayoutComponent,
                children: [
//section routing gestion
                    { path: 'agent-visiteurs', loadChildren: () => import('./demo/components/agent-visiteur/agent-visiteur.module').then(m => m.AgentVisiteursModule)  },
                    { path: 'reaffectation-agent-visiteur', loadChildren: () => import('./demo/components/reaffectation-agent-visiteur/reaffectation-agent-visiteur.module').then(m => m.ReaffectationAgentVisiteurModule)  },
                    { path: 'agent-visiteurs-errone', loadChildren: () => import('./demo/components/agent-visiteurs-errone/agent-visiteurs-errone.module').then(m => m.AgentVisiteursErroneModule)  },
                    { path: 'chef-centre', loadChildren: () => import('./demo/components/chef-centre/chef-centre.module').then(m => m.ChefCentreModule)  },
                    { path: 'formations', loadChildren: () => import('./demo/components/formations/formations.module').then(m => m.FormationsModule)  },
                    { path: 'equipements', loadChildren: () => import('./demo/components/equipements/equipements.module').then(m => m.EquipementsModule)  },
                    { path: 'etalonnages', loadChildren: () => import('./demo/components/etalonnages/etalonnages.module').then(m => m.EtalonnagesModule)  },
                    { path: 'validation-equipements', loadChildren: () => import('./demo/components/validation-equipements/validation-equipements.module').then(m => m.ValidationEquipementsModule)  },
                    { path: 'lignes', loadChildren: () => import('./demo/components/lignes/lignes.module').then(m => m.LignesModule)  },
                    { path: 'list-controles', loadChildren: () => import('./demo/components/list-controles/list-controles.module').then(m => m.ListControlesModule)  },

//section routing parametrage
                    { path: 'parametrage-notifications', data: { role: 'R-PAR' }, loadChildren: () => import('./demo/components/parametrage/parametrage-notifications/parametrage-notifications.module').then(m => m.ParametrageNotificationsModule)  },
                    { path: 'equipement-types', data: { role: 'R-PAR' }, loadChildren: () => import('./demo/components/parametrage/equipement-types/equipement-types.module').then(m => m.EquipementTypesModule)  },
                    { path: 'carburant-vehicule',data: { role: 'R-PAR' }, loadChildren: () => import('./demo/components/parametrage/carburant-vehicule/carburant-vehicule.module').then(m => m.CarburantVehiculeModule)  },
                    { path: 'genre-vehicule',data: { role: 'R-PAR' }, loadChildren: () => import('./demo/components/parametrage/genre-vehicule/genre-vehicule.module').then(m => m.GenreVehiculeModule)  },
                    { path: 'marque-vehicule',data: { role: 'R-PAR' }, loadChildren: () => import('./demo/components/parametrage/marque-vehicule/marque-vehicule.module').then(m => m.MarqueVehiculeModule)  },
                    { path: 'utilisation-vehicule',data: { role: 'R-PAR' }, loadChildren: () => import('./demo/components/parametrage/utilisation-vehicule/utilisation-vehicule.module').then(m => m.UtilisationVehiculeModule)  },
                    { path: 'formation-type',data: { role: 'R-PAR' }, loadChildren: () => import('./demo/components/parametrage/formation-type/formation-type.module').then(m => m.FormationTypeModule)  },
                    { path: '', canActivate: [AuthGuard, AutorisedGuard], data: { role: 'R-DAHS' }, loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    { path: 'erreur', canActivate: [AuthGuard, AutorisedGuard], data: { role: 'R-ERREUR' }, loadChildren: () => import('./demo/components/help/erreur/erreur.module').then(m => m.ErreurModule) },
                    { path: '**', redirectTo: '' },
                ]
            },
        //        { path: 'agent-visiteurs', component: AgentVisiteursComponent },
        // { path: 'chef-centre', component: ChefCentreComponent },
        // { path: 'formations', component: FormationsComponent },
        // { path: 'equipements', component: EquipementsComponent },
        // { path: 'validation-equipements', component: ValidationEquipementsComponent },
        // { path: 'lignes', component: LignesComponent },
        // { path: 'list-controles', component: ListControlesComponent },
        // { path: 'agent-visiteurs-errone', component: AgentVisiteursErroneComponent },
            { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
            { path: 'notfound', component: NotfoundComponent },
            { path: 'error', component: ErrorPageComponent },
            { path: '**', redirectTo: '/error' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
