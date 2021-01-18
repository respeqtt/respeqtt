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
import { Label, Button, EventData } from "@nativescript/core";
import { SessionAppli } from "../session/session";

@Component({
    templateUrl: "./saisiecommentaire.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"]
 })
export class SaisieCommentaireComponent {
    router:RouterExtensions;
    titre:string;
    sousTitre:string;
    saisie:string;
    auteur:string;

    constructor(private _route: ActivatedRoute, private _routerExtensions: RouterExtensions) {

        this.router = _routerExtensions;
        this.titre =  this._route.snapshot.paramMap.get("quoi");
        this.auteur =  this._route.snapshot.paramMap.get("auteur");

        console.log("Objet= " + this.titre);
        console.log("Auteur >" + this.auteur + "<");

        console.log("Saisie de commentaire pour le club coté " + this.auteur);
        if(this.auteur == "A") {
            this.sousTitre = "posée par " + SessionAppli.clubA.nom + " sur la rencontre " + SessionAppli.titreRencontre;
            if(this.titre == "RESERVE" && SessionAppli.reserveClubA != "") {
                this.saisie = SessionAppli.reserveClubA;
            }
            if(this.titre == "RECLAMATION" && SessionAppli.reclamationClubA != "") {
                this.saisie = SessionAppli.reclamationClubA;
            }
        }
        if(this.auteur == "X") {
            console.log("Auteur coté X");
            this.sousTitre = "posée par " + SessionAppli.clubX.nom + " sur la rencontre " + SessionAppli.titreRencontre;
            if(this.titre == "RESERVE" && SessionAppli.reserveClubX != "") {
                this.saisie = SessionAppli.reserveClubX;
            }
            if(this.titre == "RECLAMATION" && SessionAppli.reclamationClubX != "") {
                this.saisie = SessionAppli.reclamationClubX;
            }
        } else {
            this.sousTitre = this.auteur;
        }
    }


     onTapValidate(args: EventData) {
        let button = args.object as Button;
        let auteur:string;

        // mémoriser la saisie
        if(this.titre == "RESERVE") {
            // mémoriser la réserve de l'équipe indiquée
            if(this.auteur == "A") {
                SessionAppli.reserveClubA = this.saisie;
                auteur = SessionAppli.clubA.nom;
            } else {
                SessionAppli.reserveClubX = this.saisie;
                auteur = SessionAppli.clubX.nom;
            }
            alert("Texte de la réserve posée par le club " + auteur + ": " + this.saisie);

            // retour à la page de préparation de la feuille
            this.router.navigate(["preparation"]);
        }
        if(this.titre == "RECLAMATION") {
            // mémoriser la réclamation de l'équipe indiquée
            if(this.auteur == "A") {
                SessionAppli.reclamationClubA = this.saisie;
                auteur = SessionAppli.clubA.nom;
            } else {
                SessionAppli.reclamationClubX = this.saisie;
                auteur = SessionAppli.clubX.nom;
            }
            alert("Texte de la réclamation posée par le club " + auteur + ": " + this.saisie);

            // retour à la page de préparation de validation du score
            this.router.navigate(["valider/?/?"]);
        }
        if(this.titre == "RAPPORT") {
            // mémoriser le rapport du JA (RAS par défaut)
            if(this.saisie != "") {
                SessionAppli.rapportJA = this.saisie;
            } else {
                SessionAppli.rapportJA = "RAS";
            }
            alert("Texte du rapport du JA " + this.auteur + ": " + this.saisie);
            // retour à la page de préparation de validation du score
            this.router.backToPreviousPage();
        }

    }

    onTapClose(args: EventData) {
        let button = args.object as Button;
        // fermer et revenir à la page précédente
        this.router.backToPreviousPage();
    }

}
