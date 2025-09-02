import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        // { path: 'aboutus', data: { breadcrumb: 'About' }, loadChildren: () => import('./aboutus/aboutus.module').then(m => m.AboutUsModule) },

        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
