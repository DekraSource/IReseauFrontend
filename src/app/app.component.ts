import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { LoadingService } from './demo/service/loading.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    constructor(private primengConfig: PrimeNGConfig,private _loadingService: LoadingService,
    ) { 
    }
 
    ngOnInit() {

        this.primengConfig.ripple = true;
        this.primengConfig.setTranslation({
            firstDayOfWeek: 1,
            dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
            dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
            dayNamesMin: ["D", "L", "M", "M", "J", "V", "S"],
            monthNames: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
            monthNamesShort: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"],
            today: 'Aujourd\'hui',
            clear: 'Effacer',
            dateFormat: 'dd/mm/yy',
            weekHeader: 'Sm',
            apply: "Appliquer",
            filter: "Filtrer",
            reset: "Réinitialiser",
            accept: 'Accepter',
            reject: 'Rejeter',
            matchAll: 'Correspond à tous',
            matchAny: 'Correspond à l\'un',
            addRule: 'Ajouter règle',
            removeRule: 'Supprimer règle',
            equals: 'Égale à',
            notEquals: 'Différent de',
            lessThan: 'Moins que',
            lessThanOrEqualTo: 'Inférieur ou égal à',
            greaterThan: 'Plus que',
            greaterThanOrEqualTo: 'Supérieur ou égal à',
            contains: 'Contient',
            notContains: 'Ne contient pas',
            startsWith: 'Commence par',
            endsWith: 'Se termine par'
          }as any);
    }
}
