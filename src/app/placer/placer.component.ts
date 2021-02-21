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
import { GridLayout, Label, Button, EventData, ListView, ItemEventData, Observable, ObservableArray } from "@nativescript/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";
import { EltListeLicencie, Club, Formule } from "../db/RespeqttDAO";
import { SessionAppli } from "../session/session";
import { _getStyleProperties } from "@nativescript/core/ui/core/view";


@Component({
    templateUrl: "./placer.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"]
})
export class PlacerComponent{
    listeJoueurs:Observable;        // liste des joueurs montrée sur l'IHM
    cote:boolean;                   // côté A ou X
    clubChoisi:Club;                // club
    routerExt: RouterExtensions;    // pour navigation
    equipe:Array<EltListeLicencie>; // equipe présentée dans la liste de joueurs
    joueurSel:number=0;             // rang du joueur sélectionné dans l'équipe
    alphabet:string="?ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    listePlaces:Array<string> = [];

    constructor(private _route: ActivatedRoute, private _routerExtensions: RouterExtensions) {
        // récupération du coté en paramètre
        console.log("COTE=" + this._route.snapshot.paramMap.get("cote"));
        if(this._route.snapshot.paramMap.get("cote") =="A") {
            this.cote = false;
        } else {
            this.cote = true;
        }
        // récupération du routeur pour naviguer
        this.routerExt = _routerExtensions;

        // liste des places
        var debut:number;
        if (this.cote) {
            debut = 23; // W
        } else {
            debut = 1; // A
        }
        // init de la liste des places
        for(var i= 0; i < SessionAppli.nbJoueurs; i++ ) {
            this.listePlaces.push(this.alphabet.charAt(i+debut));
        }

        // recherche du club correspondant
        if(this.cote) {
            this.clubChoisi = SessionAppli.clubX;
            this.equipe = SessionAppli.equipeX;
        }
        else {
            this.clubChoisi = SessionAppli.clubA;
            this.equipe = SessionAppli.equipeA;
        }

        // init du tableau des places : dans l'ordre de l'équipe
        for(var i= 0; i < SessionAppli.nbJoueurs; i++ ) {
            this.equipe[i].place = this.alphabet.charAt(i+debut);
        }

        if(SessionAppli.equipeA) {
            console.log("Equipe A session = " + SessionAppli.equipeA.toString());
        } else {
            console.log("!!! Pas d'équipe A !!!");
        }
        if(SessionAppli.equipeX) {
            console.log("Equipe X session = " + SessionAppli.equipeX.toString());
        } else {
            console.log("!!! Pas d'équipe X !!!");
        }
        // construction de la liste des joueurs
        this.listeJoueurs = new Observable();
        this.listeJoueurs.set("listeJoueurs", new ObservableArray(this.equipe));
        for(var i = 0; i < SessionAppli.nbJoueurs; i++) {
            console.log("Joueur[" + (i+1) + "]= " + this.equipe[i].id);
            this.equipe[i].sel = false;
        }
    }

    ngOnInit(args: EventData): void {
    }

    onUp(args:EventData) {
        let button = args.object as Button;

        // si le joueur sélectionné n'est pas en haut, on le monte, on met à jour sa place et on met à jour son rang dans joueurSel
        if(this.joueurSel > 0) {
            var swap = this.equipe[this.joueurSel - 1];
            this.equipe[this.joueurSel - 1] = this.equipe[this.joueurSel];
            this.equipe[this.joueurSel - 1].place = this.listePlaces[this.joueurSel - 1];
            this.equipe[this.joueurSel] = swap;
            this.equipe[this.joueurSel].place = this.listePlaces[this.joueurSel];
            this.joueurSel--;
        }
    }

    onDown(args:EventData) {
        let button = args.object as Button;

        // si le joueur sélectionné n'est pas en bas, on le descend, on met à jour sa place et on met à jour son rang dans joueurSel
        if(this.joueurSel < SessionAppli.nbJoueurs - 1) {
            var swap = this.equipe[this.joueurSel + 1];
            this.equipe[this.joueurSel + 1] = this.equipe[this.joueurSel];
            this.equipe[this.joueurSel + 1].place = this.listePlaces[this.joueurSel + 1];
            this.equipe[this.joueurSel] = swap;
            this.equipe[this.joueurSel].place = this.listePlaces[this.joueurSel];
            this.joueurSel++;
        }
    }

    onAnnulerTap(args: EventData) {
        let button = args.object as Button;
        this.routerExt.navigate(["preparation"]);
    }

    onValiderTap(args: EventData) {
        let button = args.object as Button;

        // trier les joueurs dans l'ordre des places
        var equipeFinale:Array<EltListeLicencie> = [];
        for(var i = 0; i < SessionAppli.nbJoueurs; i++) {
            equipeFinale.push(this.equipe[i]);
        }
        // tracer le json
        console.log("Equipe= " + SessionAppli.EquipetoJSon(this.equipe, this.clubChoisi.id));

        if(this.cote) {
            SessionAppli.equipeX = equipeFinale;
        } else {
            SessionAppli.equipeA = equipeFinale;
        }
        this.routerExt.navigate(["preparation"]);
    }

    onQRCodeTap(args: EventData) {
        const quoi:string= SessionAppli.EquipetoJSon(this.equipe, this.clubChoisi.id);
        const titre:string=SessionAppli.titreRencontre + " équipe " + this.clubChoisi.nom;
        const dim:number = SessionAppli.dimEcran - 40;

         this.routerExt.navigate(["attente/" + quoi + "/" + dim + "/" + titre + "/placer/" + (this.cote ? "X" : "A")]);
    }

    onEquipeLoaded(args: EventData) {
        this.listeJoueurs = <ListView>args.object;
    }

    onJoueurTap(args: ItemEventData) {
        const index = args.index;

        // sélectionner le joueur et déselectionner les autres
        for(var i = 0; i < SessionAppli.nbJoueurs; i++) {
            this.equipe[i].sel = false;
        }
        this.equipe[index].sel = true;
        this.joueurSel = index;
    }
}

