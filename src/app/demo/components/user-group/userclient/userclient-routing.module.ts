import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserClientComponent } from './userclient.component';
// import { UserComponent } from './user/user.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', data: {breadcrumb: 'Userclient', role:'R-PRO'}, component:UserClientComponent},
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class UserClientRoutingModule { }