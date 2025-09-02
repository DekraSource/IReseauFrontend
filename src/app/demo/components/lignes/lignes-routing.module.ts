import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LignesComponent } from './lignes.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '' , component: LignesComponent }
    ])],
    exports: [RouterModule]
})
export class LignesRoutingModule { }
