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
import { Button, EventData } from "@nativescript/core";
import { SessionAppli } from "../session/session";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";
import { toURL } from "../outils/outils";

var dialogs = require("@nativescript/core/ui/dialogs");

@Component({
    templateUrl: "./valider.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"]
})
export class ValiderComponent{
    router: RouterExtensions;            // pour navigation
    version:string;
    nomJA:string="";
    prenomJA:string="";
    adresseJA:string="";
    licenceJA:number;
    nomClubA:string;
    nomClubX:string;
    sousTitre:string;
    btnRecA:string;
    btnRecX:string;
    scoreA:string;
    scoreX:string;


    constructor(private _route: ActivatedRoute, private routerExtensions: RouterExtensions) {
        this.router = routerExtensions;
        // version logicielle
        this.version = SessionAppli.version;


        this.nomClubA = SessionAppli.clubA.nom;
        this.nomClubX = SessionAppli.clubX.nom;
        
        this.sousTitre = SessionAppli.titreRencontre;

        this.scoreA = SessionAppli.scoreA.toString();
        this.scoreX = SessionAppli.scoreX.toString();

        if(SessionAppli.reclamationClubA == "") {
            this.btnRecA = "0 réclamation club A";
        } else {
            this.btnRecA = "1 réclamation club A";
        }
        if(SessionAppli.reclamationClubX == "") {
            this.btnRecX = "0 réclamation club X";
        } else {
            this.btnRecX = "1 réclamation club X";
        }
    }

    onReclamA(args: EventData) {
        let button = args.object as Button;
        // Ouvrir la page de saisie des réclamations
        this.router.navigate(["saisiecommentaire/RECLAMATION/A/valider" + toURL("/" + SessionAppli.scoreA + "/" + SessionAppli.scoreX)],
        {
            animated:true,
            transition: {
                name : SessionAppli.animationAller, 
                duration : 380,
                curve : "easeIn"
            }
        });
    }


    onReclamX(args: EventData) {
        let button = args.object as Button;
        // Ouvrir la page de saisie des réclamations
        this.router.navigate(["saisiecommentaire/RECLAMATION/X/valider" + toURL("/" + SessionAppli.scoreA + "/" + SessionAppli.scoreX)],
        {
            animated:true,
            transition: {
                name : SessionAppli.animationAller, 
                duration : 380,
                curve : "easeIn"
            }
        });
    }

    onJA(args: EventData) {
        let button = args.object as Button;
        // Ouvrir la page de saisie du rapport du JA
        this.router.navigate(["jugearbitre"],
        {
            animated:true,
            transition: {
                name : SessionAppli.animationAller, 
                duration : 380,
                curve : "easeIn"
            }
        });
    }

    onValider(args: EventData) {
        let button = args.object as Button;

        // Demander confirmation
        dialogs.prompt({title:"Confirmation",
        message:"Etes vous sûr de valider la rencontre ?",
        okButtonText:"VALIDER",
        cancelButtonText:"ANNULER"
        }).then(r => {
            // Demander la signature du capitaine adverse
            this.router.navigate(["signer"],
            {
                animated:true,
                transition: {
                    name : SessionAppli.animationAller, 
                    duration : 380,
                    curve : "easeIn"
                }
            });
        });
    }

    onFermer(args: EventData) {
        // retour sur la page précédente
        this.router.navigate(["actions"],
        {
            animated:true,
            transition: {
                name : SessionAppli.animationRetour, 
                duration : 380,
                curve : "easeIn"
            }
        });
    }
}
