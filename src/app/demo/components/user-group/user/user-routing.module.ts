import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserComponent } from './user.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', data: {breadcrumb: 'Utilisateur', role:'R-USER'}, component:UserComponent},
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class UserRoutingModule { }