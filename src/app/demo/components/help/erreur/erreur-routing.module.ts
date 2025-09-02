import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/demo/service/guard/auth.guard';
import { AutorisedGuard } from 'src/app/demo/service/guard/autorised.guard';
import { ErreurComponent } from './erreur.component';


@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: ErreurComponent }
])],
exports: [RouterModule]
})
export class ErreurRoutingModule { }
