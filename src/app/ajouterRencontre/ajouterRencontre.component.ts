/*******************************************************************************/
/* This program is free software: you can redistribute it and/or modify        */
/*     it under the terms of the Lesser GNU General Public License as          */
/*     published by the Free Software Foundation, either version 3 of the      */
/*     License, or (at your option) any later version.                         */
/*                                                                             */
/*     This program is distributed in the hope that it will be useful,         */
/*     but WITHOUT ANY WARRANTY; without even the implied warranty of          */
/*     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the           */
/*     GNU General Public License for more details.                            */
/*                                                                             */
/*     You should have received a copy of the GNU General Public License       */
/*     along with this program.  If not, see <https://www.gnu.org/licenses/>.  */
/*                                                                             */
/*******************************************************************************/

import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";
import { EventData, ListView, ItemEventData } from "@nativescript/core";
import { Club, EltListeClub } from "../db/RespeqttDAO";
import {SessionAppli} from "../session/session";


@Component({
    templateUrl: "./ajouterRencontre.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"]
 })
export class AjouterRencontreComponent {
    routeur: RouterExtensions;            // pour navigation
    titreRencontre:string="- vs - ";
    listeClubs:Array<EltListeClub>;
    club:number=-1;
    version:string;

    clubADomicile:EltListeClub=null;
    clubVisiteur:EltListeClub=null;

    constructor(private _route: ActivatedRoute, private _routerExtensions: RouterExtensions) {

        this.routeur = _routerExtensions;
        // version logicielle
        this.version = SessionAppli.version;


        // récupérer la liste des clubs
        Club.getListe().then(liste => {
            this.listeClubs = liste  as Array<EltListeClub>;
        }, error =>{
            console.log("Impossible de lire la liste des clubs :" + error.toString());
        });


    }
    onListViewLoaded(args: EventData) {
        const maListe = <ListView>args.object;      
    }

    onItemTap(args: ItemEventData) {
        const index = args.index;

        // mémoriser le club sélectionné pour usage ultérieur, désélectionner si déjà sélectionné
        if(this.club == this.listeClubs[index].numero) {
            this.club = -1;
            this.listeClubs[index].sel = false;
        } else {
            this.club = index;
            this.listeClubs[index].sel = true;
        }

        console.log("Club sélectionné : " + this.club);
    }

    onRecoit(args: EventData) {
        // rechercher et mémoriser le club sélectionné
        if(this.club == -1) {
            this.clubADomicile = null;
            this.titreRencontre = " vs ";
            if(this.clubVisiteur) {
                this.titreRencontre = this.titreRencontre + this.clubVisiteur.nom;
            }
        } else {
            this.clubADomicile = this.listeClubs[this.club];
            this.listeClubs[this.club].sel = false;
            this.titreRencontre = this.clubADomicile.nom + " vs ";
            if(this.clubVisiteur) {
                this.titreRencontre = this.titreRencontre + this.clubVisiteur.nom;
            }
        }
    }

    onVisiteur(args: EventData) {
        // rechercher et mémoriser le club sélectionné
        if(this.clubADomicile) {
            this.titreRencontre = this.clubADomicile.nom + " vs ";
        } else {
            this.titreRencontre = " vs ";
        }
        if(this.club == -1) {
                this.clubVisiteur = null;
        } else {
            this.clubVisiteur = this.listeClubs[this.club];
            this.listeClubs[this.club].sel = false;
            this.titreRencontre = this.titreRencontre + this.clubVisiteur.nom;
        }
    }

    onSuite(args: EventData) {
        // Afficher la page de saisie du détail de la rencontre
        this._routerExtensions.navigate(["detailsRencontre/" + this.clubADomicile.numero.toString() + "/" + this.clubVisiteur.numero.toString()]);
    }

    onFermer(args: EventData) {
        // Afficher la page de choix des rencontres
        this._routerExtensions.navigate(["rencontre"]);
    }


}