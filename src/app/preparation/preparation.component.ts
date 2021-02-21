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
import { Button, EventData, Switch } from "@nativescript/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";


import { EltListeLicencie, Club } from "../db/RespeqttDAO";
import { SessionAppli } from "../session/session";

import { Maintenant } from "../outils/outils";



@Component({
    templateUrl: "./preparation.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreparationComponent{
    recoitCoteX:boolean
    titreRencontre:string;
    modif:boolean=false;
    resValid:boolean=false;
    switchActif:boolean=false;
    routeur:RouterExtensions;
    btnResA:string;
    btnResX:string;
    clubA:string;
    clubX:string;
    listeEquipeA:Array<EltListeLicencie>=[];
    listeEquipeX:Array<EltListeLicencie>=[];
    lieu:string="";

    constructor(private _route: ActivatedRoute, private routerExtensions: RouterExtensions) {
        this.routeur = routerExtensions;
        this.recoitCoteX=false;
        this.titreRencontre = SessionAppli.titreRencontre;
        console.log("Rencontre : " + this.titreRencontre);
        if(SessionAppli.reserveClubA == "") {
            this.btnResA = "0 réserve club A";
        } else {
            this.btnResA = "1 réserve club A";
        }
        if(SessionAppli.reserveClubX == "") {
            this.btnResX = "0 réserve club X";
        } else {
            this.btnResX = "1 réserve club X";
        }

        // si rencontre de travail alors club A = club choisi
        if(SessionAppli.rencontreChoisie) {
            this.clubA = "A/" + SessionAppli.clubA.nom;
            this.clubX = "X/" + SessionAppli.clubX.nom;
            // proposer le club A par défaut si pas de lieu choisi
            if(SessionAppli.lieu == "") {
                this.lieu = SessionAppli.clubA.nom;
            } else {
                this.lieu = SessionAppli.lieu;
            }
        } else {
            // récupérer le club choisi
            Club.getClub(SessionAppli.clubChoisi).then(c => {;
                SessionAppli.clubA = c as Club;
                this.clubA = SessionAppli.clubA.nom;
                this.lieu = SessionAppli.clubA.nom;
                this.clubX = "X";
            }, error => {
                console.log("Impossible de trouver le club choisi : " + SessionAppli.clubChoisi, error);
            });
        }

        // on commence avec une liste vide si pas d'équipe déjà composée
        for(var i = 0; i < SessionAppli.equipeA.length; i++) {
            this.listeEquipeA.push(SessionAppli.equipeA[i]);
        }
        for(var i = 0; i < SessionAppli.equipeX.length; i++) {
            this.listeEquipeX.push(SessionAppli.equipeX[i]);
        }

        // on fixe le mode rencontre en fonction de l'onglet sur lequel on est
        SessionAppli.modeRencontre = SessionAppli.tab == 0;

        this.modif = !SessionAppli.compoFigee;
        this.switchActif = !SessionAppli.compoFigee;
        this.resValid = SessionAppli.modeRencontre && !SessionAppli.compoFigee;
    }

    ngOnInit(): void {
    }

    onCheckedChange(args: EventData) {
        var s:string;
        let sw = args.object as Switch;
        this.recoitCoteX = sw.checked; // boolean
        let c = SessionAppli.clubA;
        let e = SessionAppli.equipeA;
        // échanger les clubs et les équipes et mémoriser dans la session
        SessionAppli.clubA = SessionAppli.clubX;
        SessionAppli.clubX = c;
        SessionAppli.equipeA = SessionAppli.equipeX;
        SessionAppli.equipeX = e;
        SessionAppli.recoitCoteX = this.recoitCoteX;
        s = SessionAppli.reserveClubA;
        SessionAppli.reserveClubA = SessionAppli.reserveClubX;
        SessionAppli.reserveClubX = s;

        this.clubA = "A/" + SessionAppli.clubA.nom;
        this.clubX = "X/" + SessionAppli.clubX.nom;

        // on inverse les équipes dans la liste
        this.listeEquipeA = [];
        for(var i = 0; i < SessionAppli.equipeA.length; i++) {
            this.listeEquipeA.push(SessionAppli.equipeA[i]);
        }
        this.listeEquipeX = [];
        for(var i = 0; i < SessionAppli.equipeX.length; i++) {
            this.listeEquipeX.push(SessionAppli.equipeX[i]);
        }

        console.log("Recoit cote X = " + this.recoitCoteX.toString());
    }

    onReserveA(args: EventData) {
        let button = args.object as Button;
        // Ouvrir la page de saisie des réserves
        this.routeur.navigate(["saisiecommentaire/RESERVE/A"]);
    }

    onReserveX(args: EventData) {
        let button = args.object as Button;
        // Ouvrir la page de saisie des réserves
        this.routeur.navigate(["saisiecommentaire/RESERVE/X"]);
    }

    onValiderFeuille(args: EventData) {
        let button = args.object as Button;

        // vérifier que les deux équipes ont été saisies ou forfait
        if((SessionAppli.equipeA.length == 0 && !SessionAppli.forfaitA)
        || (SessionAppli.equipeX.length == 0 && !SessionAppli.forfaitX)) {
            alert("Les deux équipes n'ont pas été renseignées.");
            return;
        } else {
            // passer en mode rencontre
            SessionAppli.modeRencontre = true;
            // figer la composition des deux équipes
            SessionAppli.compoFigee = true;
            // mémoriser la date de la rencontre
            SessionAppli.date = Maintenant();
            // mémoriser le lieu de la rencontre
            SessionAppli.lieu = this.lieu;
            // désactiver les boutons
            this.modif = !SessionAppli.compoFigee;
            this.switchActif = !SessionAppli.compoFigee;
            this.resValid = !SessionAppli.compoFigee;

        }

        // sauvegarder la session en BDD
        SessionAppli.Persiste();
    }

    // ouvrir la page de consultation de la feuille de match
    onVoirFeuille(args: EventData) {

    }

    // Fermer
    onFermer(args: EventData) {
        // mémoriser le lieu saisi (ou pas)
        console.log("Lieu =" + this.lieu);
        SessionAppli.lieu = this.lieu;
        // retourner à la page des actions
        this.routeur.navigate(["actions"]);
    }

}



