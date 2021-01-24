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

import { Component, ElementRef, OnInit, ViewChild, ChangeDetectionStrategy } from "@angular/core";
import { Page, GridLayout, Label, Button, EventData, ListView, ItemEventData, Switch } from "@nativescript/core";
import {Router} from "@angular/router";

import { EltListeRencontre, Rencontre, Club } from "../db/RespeqttDAO";
import { SessionAppli } from "../session/session";

import { Mobile } from "../outils/outils";



@Component({
    templateUrl: "./choixrencontre.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChoixRencontreComponent {
    listeRencontres:Array<EltListeRencontre> = [];
    mobile:Mobile;
    demiLargeur:number;
    titre:string;
    sousTitre:string;

    constructor(private router: Router) {
        this.mobile = new Mobile;
        // calcul de la demi largeur pour les boutons
        this.demiLargeur = Math.floor(this.mobile.largeurEcran /2) - 5;
        console.log("Demi-largeur = " + this.demiLargeur);

        this.titre = "CHOIX DE LA RENCONTRE";
        this.sousTitre = "dans la liste ci-dessous";
        Rencontre.getListe().then(liste => {
            this.listeRencontres = liste as Array<EltListeRencontre>;
        }, error => {
            console.log("Impossible de lire la liste des rencontres : " + error.toString());
        });
    }

    // Charge la liste des rencontres pour affichage
    ngOnInit(): void {

    }

    onListViewLoaded(args: EventData) {
        const listView = <ListView>args.object;
    }

    onItemTap(args: ItemEventData) {
        const index = args.index;
        SessionAppli.rencontreChoisie = this.listeRencontres[index].id;
        // récupérer la description complète de la rencontre
        Rencontre.getRencontre(SessionAppli.rencontreChoisie).then(ren => {
            SessionAppli.rencontre = ren as Rencontre;
            // récupérer le club 1 placé en A en attendant de savoir
            Club.getClub(SessionAppli.rencontre.club1).then(club => {
                SessionAppli.clubA = club as Club;
                console.log("ClubA = " + SessionAppli.clubA.nom);
                // récupérer le club 2 placé en X en attendant de savoir
                Club.getClub(SessionAppli.rencontre.club2).then(club => {
                    SessionAppli.clubX = club as Club;
                    console.log("ClubX = " + SessionAppli.clubX.nom);
                    // récupérer le titre de la rencontre
                    Rencontre.getDescriptionRencontre(SessionAppli.rencontreChoisie).then(desc => {
                        SessionAppli.titreRencontre = desc as string;
                        console.log("Rencontre =" + SessionAppli.titreRencontre);

                        // aller sur la page de préparation de la feuille de match
                        const button: Button = <Button>args.object;
                        const page: Page = button.page;
                        this.router.navigate(["preparation"]);
                    }, error => {
                        console.log("Impossible de lire le titre de la rencontre" + error.toString());
                    });
                }, error => {
                    console.log("Impossible de trouver le club " + SessionAppli.rencontre.club2.toString() + ": " + error.toString());
                });
            }, error => {
                console.log("Impossible de trouver le club " + SessionAppli.rencontre.club1.toString() + ": " + error.toString());
            });
        }, error => {
            console.log("Impossible de lire la rencontre choisie : " + error.toString())
        });


    }

}



