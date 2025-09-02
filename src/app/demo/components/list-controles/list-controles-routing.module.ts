import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListControlesComponent } from './list-controles.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '' , component: ListControlesComponent }
    ])],
    exports: [RouterModule]
})
export class ListControlesRoutingModule { }
