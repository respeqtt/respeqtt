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
import { Label, Button, EventData, ListView, ItemEventData, Observable, ObservableArray, Page } from "@nativescript/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";
import { EltListeLicencie, Rencontre, Licencie, Partie, Formule } from "../db/RespeqttDAO";
import { SessionAppli } from "../session/session";
import { StringListElt } from "../outils/outils";


@Component({
    templateUrl: "./lancement.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"]
})
export class LancementComponent{
    maListe : Observable;                   // liste  à l'écran
    listeLignes:Array<Partie>=[];    // liste des parties
    titre:string;                           // titre de la page
    partieSel:number=-1;                    // partie sélectionnée
    nbParties:number;                       // nb de parties dans la rencontre
    routerExt: RouterExtensions;            // pour navigation

    constructor(private _route: ActivatedRoute, private _routerExtensions: RouterExtensions) {

        var ligne:StringListElt;

        // construire le titre
        this.titre = SessionAppli.titreRencontre;

        // construire les parties
        if(SessionAppli.listeParties.length==0) {
            this.listeLignes = Partie.InitListeParties(SessionAppli.rencontre, SessionAppli.equipeA, SessionAppli.equipeX);
            this.nbParties = this.listeLignes.length;
        } else {
            this.listeLignes = SessionAppli.listeParties;
            this.nbParties = this.listeLignes.length;
        }

        // transformation en Observable
        this.maListe = new Observable();
        this.maListe.set("listeParties", new ObservableArray(this.listeLignes));
        // mémoriser la liste des parties
        SessionAppli.listeParties = this.listeLignes;

        this.routerExt = _routerExtensions;

    }

    onListViewLoaded(args: EventData) {
        this.maListe = <ListView>args.object;
    }

    onItemTap(args: ItemEventData) {
        const index = args.index;

        // sélectionner la partie et déselectionner les autres
        for(var i = 0; i < this.nbParties; i++) {
            this.listeLignes[i].sel = false;
        }
        this.listeLignes[index].sel = true;
        this.partieSel = index;

        // ouvrir la page de saisie des résultats
        console.log("vers page " + "resultat/" + index);
        this.routerExt.navigate(["resultat/" + index]);

    }

    onQRCode(args: EventData) {
        let button = args.object as Button;

 //       this.routerExt.navigate(["qrmontrer/" + quoi + "/" + dim + "/" + titre]);
    }


    onFermer(args: EventData) {
        let button = args.object as Button;

        this.routerExt.navigate(["actions"]);
    }
}




