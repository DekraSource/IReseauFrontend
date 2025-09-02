import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';
// import { UserComponent } from './user/user.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', data: {breadcrumb: 'Profil', role:'R-PRO'}, component:ProfileComponent},
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class ProfileRoutingModule { }