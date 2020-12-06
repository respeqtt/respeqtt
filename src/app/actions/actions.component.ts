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
import { Mobile } from "../outils/outils";
import { SessionAppli } from "../session/session";
import { RouterExtensions } from "@nativescript/angular";

var Sqlite = require ("nativescript-sqlite");

@Component({
    templateUrl: "./actions.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"]
})
export class ActionsComponent{
    routerExt: RouterExtensions;            // pour navigation
    lancer: boolean;                        // activation du bouton : lancer les parties


    constructor(private _routerExtensions: RouterExtensions) {
        this.routerExt = _routerExtensions;

        // Init de la BDD
        RespeqttDb.Init();

        // on ne lance les parties que si la compo est figée
        this.lancer = SessionAppli.compoFigee;

    }

    ngOnInit(): void {

        // calcul de la largeur de l'écran
        var mobile:Mobile= new Mobile;
        SessionAppli.dimEcran = mobile.largeurEcran < mobile.hauteurEcran ? mobile.largeurEcran : mobile.hauteurEcran;
    }

    onValiderScore(args: EventData) {
        let button = args.object as Button;
        // charger les rencontres en mémoire
        alert("Validation du score");
    }

    onLancement(args: EventData) {
        let button = args.object as Button;
        // vérifier si on peut passer sur la page de lancement des parties
        // inutile : le bouton est inactif si pas this.lancer
        if(this.lancer) {
            this.routerExt.navigate(["lancement"]);
        }
    }

    onDropDB(args: EventData) {
        RespeqttDb.Drop();
        alert("BDD supprimée");
    }
}
