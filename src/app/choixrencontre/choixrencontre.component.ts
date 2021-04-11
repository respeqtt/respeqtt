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

import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Page, Button, EventData, ListView, ItemEventData } from "@nativescript/core";
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
            var r:EltListeRencontre;
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
        // Rechercher la rencontre en BDD
        if(SessionAppli.RechargeSession(SessionAppli.rencontreChoisie)) {
            this.router.navigate(["preparation"]);
        } else {
            if(SessionAppli.rencontreChoisie == 0)  {
                // aller sur la page de préparation de la feuille de match
                const button: Button = <Button>args.object;
                const page: Page = button.page;
                this.router.navigate(["preparation"]);
            } else {
                // récupérer la description complète de la rencontre
                Rencontre.getRencontre(SessionAppli.rencontreChoisie).then(ren => {
                    const r: Rencontre = ren as Rencontre;
                    // mémoriser le nb de joueurs
                    SessionAppli.nbJoueurs = r.nbJoueurs;
                    // mémoriser la formule
                    SessionAppli.formule = r.formule;
                    // mémoriser le nb de sets gagnants
                    SessionAppli.nbSetsGagnants = r.nbSets;
                    console.log("NbJoueurs = " + SessionAppli.nbJoueurs);
                    // récupérer le club 1 placé en A en attendant de savoir
                    Club.getClub(r.club1).then(club => {
                        SessionAppli.clubA = club as Club;
                        console.log("ClubA = " + SessionAppli.clubA.nom);
                        // récupérer le club 2 placé en X en attendant de savoir
                        Club.getClub(r.club2).then(club => {
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
                            console.log("Impossible de trouver le club " + r.club2.toString() + ": " + error.toString());
                        });
                    }, error => {
                        console.log("Impossible de trouver le club " + r.club1.toString() + ": " + error.toString());
                    });
                }, error => {
                    console.log("Impossible de lire la rencontre choisie : " + error.toString())
                });

            }
        }
    }

}



