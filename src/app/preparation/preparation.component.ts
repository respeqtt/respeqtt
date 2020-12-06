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
import { Page, GridLayout, Label, Button, EventData, ListView, ItemEventData, Switch, Observable } from "@nativescript/core";


import { EltListeRencontre, Rencontre, Formule } from "../db/RespeqttDAO";
import { SessionAppli } from "../session/session";

import { Mobile } from "../outils/outils";



@Component({
    templateUrl: "./preparation.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreparationComponent{
    recoitCoteX:boolean
    titreRencontre:string;
    trace:string;
    modif:boolean;

    constructor() {
        this.recoitCoteX=false
        this.titreRencontre = SessionAppli.titreRencontre;
        console.log("Rencontre : " + this.titreRencontre);
        this.trace = "";

        this.modif = !SessionAppli.compoFigee;
        console.log("Compo figée :" + SessionAppli.compoFigee);
    }

    // Charge la liste des rencontres pour affichage
    ngOnInit(): void {
    }

    onCheckedChange(args: EventData) {
        let sw = args.object as Switch;
        this.recoitCoteX = sw.checked; // boolean
        let c = SessionAppli.clubA;
        let e = SessionAppli.equipeA;
        // échanger les clubs et les équipes
        SessionAppli.clubA = SessionAppli.clubX;
        SessionAppli.clubX = c;
        SessionAppli.equipeA = SessionAppli.equipeX;
        SessionAppli.equipeX = e;
        console.log("Recoit cote X = " + this.recoitCoteX.toString());
    }

    onTap(args: EventData) {
        let button = args.object as Button;
        // execute your custom logic here...
        // >> (hide)
        alert("Tapped ");
        // << (hide)
    }

    onValiderFeuille(args: EventData) {
        let button = args.object as Button;

        // vérifier que les deux équipes ont été saisies
        if(!SessionAppli.equipeA || !SessionAppli.equipeX) {
            alert("Les deux équipes n'ont pas été renseignées.");
            return;
        } else {
            // on fige la composition des deux équipes
            SessionAppli.compoFigee = true;
            this.modif = !SessionAppli.compoFigee;
        }
    }

    // ouvrir la page de consultation de la feuille de match
    onVoirFeuille(args: EventData) {

    }
}


