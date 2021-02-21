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
    score:string;                           // score en cours
    routerExt: RouterExtensions;            // pour navigation

    constructor(private _route: ActivatedRoute, private _routerExtensions: RouterExtensions) {

        var ligne:StringListElt;

        // construire le titre
        this.titre = SessionAppli.titreRencontre;

        // construire les parties
        console.log("Nb de parties dans la session : " + SessionAppli.listeParties.length);
        if(SessionAppli.listeParties.length==0) {
            this.listeLignes = Partie.InitListeParties(SessionAppli.equipeA, SessionAppli.equipeX, SessionAppli.forfaitA, SessionAppli.forfaitX);
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

        // construire le score
        SessionAppli.MajScore();
        console.log("Score=" + SessionAppli.score);
        this.score = SessionAppli.score;
    }

    onItemTap(args: ItemEventData) {
        const index = args.index;

        // on ne modifie pas les scores après validation
        if(SessionAppli.scoreValide) {
            return;
        }

        // sélectionner la partie et déselectionner les autres
        for(var i = 0; i < this.nbParties; i++) {
            this.listeLignes[i].sel = false;
        }
        this.listeLignes[index].sel = true;
        this.partieSel = index;

        // si on a un score de forfait, pas de saisie possible
        if(this.listeLignes[index].scoreAX == "0-0" || this.listeLignes[index].scoreAX == "2-0" || this.listeLignes[index].scoreAX == "0-2") {
            alert("Ce score correspond à un forfait, il n'est pas modifiable");
            return;
        };

        // si c'est un double on demande d'abord les compos
        console.log("Partie : " + this.listeLignes[index].desc);
        if(this.listeLignes[index].desc.charAt(0) == "*") {
            var nbDoubles:number = 0;
            var numDouble:number = 0;
            console.log("!!! C'est un double");
            // compter les doubles
            for(var i = 0; i < this.listeLignes.length; i++) {
                // si c'est un double, on le compte
                if(this.listeLignes[i].desc.charAt(0) == "*") nbDoubles++;
                // si c'est le double qu'on cherche, on mémorise son rang dans la liste des doubles
                if(this.listeLignes[i].desc == SessionAppli.listeParties[index].desc) numDouble = nbDoubles;
            }
            // est-ce qu'on a déjà renseigné un coté ?
            if(SessionAppli.listeParties[index].desc.charAt(1) =="*") {
                this.routerExt.navigate(["compoDouble/" + (SessionAppli.recoitCoteX ? "X" : "A") + "/" + numDouble + "/" + nbDoubles]);
            } else {
                this.routerExt.navigate(["compoDouble/" + (SessionAppli.recoitCoteX ? "A" : "X") + "/" + numDouble + "/" + nbDoubles]);
            }
        } else {
            console.log("!!! C'est un simple ou un double déjà composé");
            // ouvrir la page de saisie des résultats
            console.log("vers page " + "resultat/" + index);
            this.routerExt.navigate(["resultat/" + index]);
            }
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




