import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ParametrageNotificationsComponent } from './parametrage-notifications.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '' , component: ParametrageNotificationsComponent }
    ])],
    exports: [RouterModule]
})
export class ParametrageNotificationsRoutingModule { }
