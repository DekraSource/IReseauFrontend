import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChefCentreComponent } from './chef-centre.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '' , component: ChefCentreComponent }
    ])],
    exports: [RouterModule]
})
export class ChefCentreRoutingModule { }
