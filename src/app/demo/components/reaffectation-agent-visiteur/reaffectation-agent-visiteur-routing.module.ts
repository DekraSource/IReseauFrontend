import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReaffectationAgentVisiteurComponent } from './reaffectation-agent-visiteur.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '' , component: ReaffectationAgentVisiteurComponent }
    ])],
    exports: [RouterModule]
})
export class ReaffectationAgentVisiteurRoutingModule { }
