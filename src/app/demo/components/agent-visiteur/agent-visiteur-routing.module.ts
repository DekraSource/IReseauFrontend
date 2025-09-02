import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AgentVisiteurComponent } from './agent-visiteur.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '' , component: AgentVisiteurComponent }
    ])],
    exports: [RouterModule]
})
export class AgentVisiteurRoutingModule { }
