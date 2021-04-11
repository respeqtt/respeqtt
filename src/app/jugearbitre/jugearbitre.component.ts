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
import { Button, EventData } from "@nativescript/core";
import { SessionAppli } from "../session/session";

var dialogs = require("tns-core-modules/ui/dialogs");

@Component({
    templateUrl: "./jugearbitre.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"]
 })
export class JugeArbitreComponent {
    routeur: RouterExtensions;            // pour navigation
    nomJA:string="";
    prenomJA:string="";
    adresseJA:string="";
    licenceJA:number;
    valider:boolean=false;

    constructor(private _route: ActivatedRoute, private _routerExtensions: RouterExtensions) {

        this.routeur = _routerExtensions;

        this.nomJA = SessionAppli.nomJA;
        this.prenomJA = SessionAppli.prenomJA;
        this.adresseJA = SessionAppli.adresseJA;
        this.licenceJA = SessionAppli.licenceJA;

        if(this.licenceJA> 0) {
            this.valider=true;
        }
    }

    onFocus(args: EventData) {
        console.log("Licence JA = " + this.licenceJA);
        this.valider = true;
      };

    onTapRapport(args: EventData) {
        let button = args.object as Button;

        // mémoriser les coordonnées du JA pour les retrouver en sortant du rapport
        SessionAppli.nomJA = this.nomJA;
        SessionAppli.prenomJA = this.prenomJA;
        SessionAppli.adresseJA = this.adresseJA;
        SessionAppli.licenceJA = this.licenceJA;

        // Ouvrir la page de saisie de saisie du rapport du JA
        this.routeur.navigate(["saisiecommentaire/RAPPORT/" + this.nomJA + " " + this.prenomJA + "/jugearbitre"]);
    }

    onTapValider(args: EventData) {
        let button = args.object as Button;0

        // mémoriser les coordonnées du JA
        SessionAppli.nomJA = this.nomJA;
        SessionAppli.prenomJA = this.prenomJA;
        SessionAppli.adresseJA = this.adresseJA;
        SessionAppli.licenceJA = this.licenceJA;

        this.routeur.navigate(["valider/" + SessionAppli.scoreA + "/" + SessionAppli.scoreX]);
    }

    onTapFermer(args: EventData) {
        let button = args.object as Button;

        // si pas de JA, pas de rapport
        if(SessionAppli.licenceJA == 0) {
            // demande de confirmation
            dialogs.prompt({title:"Confirmation",
            message:"Etes vous sûr de ne pas valider le JA et son rapport ?",
            okButtonText:"PAS DE JA",
            cancelButtonText:"ANNULER"
            }).then(r => {
                if(r.result) {
                    SessionAppli.nomJA = "";
                    SessionAppli.prenomJA = "";
                    SessionAppli.adresseJA = "";
                    SessionAppli.licenceJA = 0;
                    SessionAppli.rapportJA = "";
                    this.routeur.navigate(["valider/" + SessionAppli.scoreA + "/" + SessionAppli.scoreX]);
                } else {
                return;
                }
        });
        } else {
            this.routeur.navigate(["valider/" + SessionAppli.scoreA + "/" + SessionAppli.scoreX]);
        }

    }

}
