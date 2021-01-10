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

import { Component, OnInit } from "@angular/core";
import { Label, Button, EventData } from "@nativescript/core";
import { RespeqttDb } from "../db/dbRespeqtt";
import { Rencontre } from "../db/RespeqttDAO";
import { SessionAppli } from "../session/session";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";
import { Session } from "inspector";

var dialogs = require("tns-core-modules/ui/dialogs");

@Component({
    templateUrl: "./valider.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"]
})
export class ValiderComponent{
    routeur: RouterExtensions;            // pour navigation
    nomJA:string="";
    prenomJA:string="";
    adresseJA:string="";
    licenceJA:number;
    scoreA:string;
    scoreX:string;
    nomClubA:string;
    nomClubX:string;
    sousTitre:string;


    constructor(private _route: ActivatedRoute, private routerExtensions: RouterExtensions) {
        this.routeur = routerExtensions;

        this.nomClubA = SessionAppli.clubA.nom;
        this.nomClubX = SessionAppli.clubX.nom;
        this.scoreA = _route.snapshot.paramMap.get("scoreA");
        this.scoreX = _route.snapshot.paramMap.get("scoreX");
        this.sousTitre = SessionAppli.titreRencontre;
    }

    onReclamA(args: EventData) {
        let button = args.object as Button;
        // Ouvrir la page de saisie des réclamations
        this.routeur.navigate(["saisiecommentaire/RECLAMATION/A"]);
    }


    onReclamX(args: EventData) {
        let button = args.object as Button;
        // Ouvrir la page de saisie des réclamations
        this.routeur.navigate(["saisiecommentaire/RECLAMATION/X"]);
    }

    onJA(args: EventData) {
        let button = args.object as Button;
        // Ouvrir la page de saisie du rapport du JA
        this.routeur.navigate(["jugearbitre"]);
    }

    onTapValidate(args: EventData) {
        let button = args.object as Button;

        console.log("SCORE VALIDE");
        SessionAppli.scoreValide = true;


        this.routeur.navigate(["actions"]);
    }

    onTapClose(args: EventData) {
        // retour sur la page précédente
        this.routeur.backToPreviousPage();
    }
}
