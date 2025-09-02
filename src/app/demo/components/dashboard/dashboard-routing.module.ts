import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../service/guard/auth.guard';
import { AutorisedGuard } from '../../service/guard/autorised.guard';
import { DashboardComponent } from './dashboard.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '' , data: {breadcrumb: 'Profil', role:'R-DAHS'},canActivate: [AuthGuard, AutorisedGuard], 
        component: DashboardComponent }
    ])],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }
