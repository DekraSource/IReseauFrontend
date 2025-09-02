import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AgentVisiteursErroneComponent } from './agent-visiteurs-errone.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '' , component: AgentVisiteursErroneComponent }
    ])],
    exports: [RouterModule]
})
export class AgentVisiteursErroneRoutingModule { }
