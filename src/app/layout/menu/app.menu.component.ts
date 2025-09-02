import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/demo/service/general/general.service';
import { AuthGuard } from 'src/app/demo/service/guard/auth.guard';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];
    userProfile: string = '';

    constructor(private authGuard: AuthGuard,private generalService: GeneralService) { }

    ngOnInit() {
        this.userProfile = this.getUserProfile();
        this.model = [];

        this.model.push(
            {
                label: 'Accueil',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            },
            {
                // Ajout des components au menu
                label: 'Gestion',
                items: [
                    { label: 'Agent Visiteurs', icon: 'pi pi-fw pi-user', routerLink: ['/agent-visiteurs'],visible: this.generalService.canActivateAll(['R-AV']) },
                    { label: 'Réaffectation Agent Visiteurs', visible: this.generalService.canActivateAll(['R-RAV']), icon: 'pi pi-fw pi-user', routerLink: ['/reaffectation-agent-visiteur'] },
                    { label: 'Agent Visiteurs Erroné', icon: 'pi pi-fw pi-user-minus', routerLink: ['/agent-visiteurs-errone'],visible: this.generalService.canActivateAll(['R-AVE']) },
                    { label: 'Chef Centre', icon: 'pi pi-fw pi-briefcase', routerLink: ['/chef-centre'],visible: this.generalService.canActivateAll(['R-CC']) },
                    { label: 'Formations', icon: 'pi pi-fw pi-book', routerLink: ['/formations'],visible: this.generalService.canActivateAll(['R-Frm']) },
                    { label: 'Equipements', icon: 'pi pi-fw pi-cog', routerLink: ['/equipements'],visible: this.generalService.canActivateAll(['R-Eqp']) },
                    { label: 'Validation Équipements', icon: 'pi pi-fw pi-check', routerLink: ['/validation-equipements'],visible: this.generalService.canActivateAll(['R-VEqp'])  },
                    { label: 'Lignes', icon: 'pi pi-fw pi-sitemap', routerLink: ['/lignes'],visible: this.generalService.canActivateAll(['R-Ligne'])  },
                    { label: 'Liste Contrôles',visible: this.generalService.canActivateAll(['R-LC']), icon: 'pi pi-fw pi-list', routerLink: ['/list-controles'] }
                ]
            },
            // Ajout du menu Paramétrage avec ses sous-pages
            {
                label: 'Paramétrage',
                icon: 'pi pi-fw pi-cog',
                visible: this.generalService.canActivateAll(['R-PAR']),

                items: [
                    { label: 'Equipement Types', icon: 'pi pi-fw pi-sliders-h', routerLink: ['/equipement-types'] },
                    { label: 'Carburant Véhicule', icon: 'pi pi-fw pi-car', routerLink: ['/carburant-vehicule'] },
                    { label: 'Genre Véhicule', icon: 'pi pi-fw pi-car', routerLink: ['/genre-vehicule'] },
                    { label: 'Marque Véhicule', icon: 'pi pi-fw pi-tags', routerLink: ['/marque-vehicule'] },
                    { label: 'Utilisation Véhicule', icon: 'pi pi-fw pi-briefcase', routerLink: ['/utilisation-vehicule'] },
                    { label: 'Formation Type', icon: 'pi pi-fw pi-book', routerLink: ['/formation-type'] }
                ]
            }
        );
    }

    getUserProfile(): string {
        const profile = this.authGuard.get_DataSession('profile');
        if (profile) {
            return profile;
        }
        return localStorage.getItem('profile') || '';
    }
}
