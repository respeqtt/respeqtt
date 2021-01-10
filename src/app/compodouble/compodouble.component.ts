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
import { EltListeLicencie, Licencie, Club } from "../db/RespeqttDAO";
import { SessionAppli } from "../session/session";
import { _getStyleProperties } from "@nativescript/core/ui/core/view";
import { numberProperty } from "@nativescript-community/ui-canvas/shapes/shape";


@Component({
    templateUrl: "./compodouble.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"]
})
export class CompoDoubleComponent{
    listeJoueurs:Array<EltListeLicencie>;
    maListe:Observable;
    numDouble:number;
    routerExt: RouterExtensions;
    cote:string;
    titreRencontre:string;
    nbDoubles:number;

    constructor(private _route: ActivatedRoute, private _routerExtensions: RouterExtensions) {
        // récupération du coté et du numéro de double en paramètre
        this.cote = this._route.snapshot.paramMap.get("cote");
        this.numDouble = Number(this._route.snapshot.paramMap.get("numDouble"));
        this.nbDoubles = Number(this._route.snapshot.paramMap.get("nbDoubles"));

        console.log("Compo double " + this.numDouble + " côté " + this.cote + " sur " + this.nbDoubles);

        // récupération du routeur pour naviguer
        this.routerExt = _routerExtensions;

        // récupérer l'équipe
        if(this.cote == "X") {
            // récup de la liste des joueurs de l'équipe
            this.listeJoueurs = SessionAppli.equipeX;
        } else {
            this.listeJoueurs = SessionAppli.equipeA;
        }

        // désélectionner tout le monde et compter les joueurs pas déjà dans un double
        var iPasDouble:Array<number> = [];
        for(var i=0; i < this.listeJoueurs.length; i++) {
            this.listeJoueurs[i].sel = false;
            if(this.listeJoueurs[i].double == 0) {
                iPasDouble.push(i);
            }
        }

        // s'il n'y a que deux joueurs possibles on compose le double et on sort directement
        if(iPasDouble.length == 2) {
            this.listeJoueurs[iPasDouble[0]].double = this.numDouble;
            this.listeJoueurs[iPasDouble[1]].double = this.numDouble;
            var double:string = this.listeJoueurs[iPasDouble[0]].nom + " " + this.listeJoueurs[iPasDouble[0]].prenom;
            double = double + ", " + this.listeJoueurs[iPasDouble[1]].nom + " " + this.listeJoueurs[iPasDouble[1]].prenom;
            this.MemoriseDouble(double);

        }
    }

    private MajScoreDoubleForfait(iPartie:number){
        let finA:number = -1;
        let forfaitA:boolean=false;
        let forfaitX:boolean=false;
        let doubleA:string;
        let doubleX:string;

        finA = SessionAppli.listeParties[iPartie].desc.indexOf("vs");

        // est-ce que doubleA est forfait ?
        doubleA = SessionAppli.listeParties[iPartie].desc.substr(0, finA);
        console.log(">>doubleA=" + doubleA + "/" + doubleA.indexOf("(absent)"));
        if(SessionAppli.forfaitA || doubleA.indexOf("(absent)")>0) forfaitA = true;

        // est-ce que doubleX est forfait ?
        doubleX = SessionAppli.listeParties[iPartie].desc.substr(finA);
        console.log(">>doubleX=" + doubleX + "/" + doubleX.indexOf("(absent)"));
        if(SessionAppli.forfaitX || doubleX.indexOf("(absent)")>0) forfaitX = true;

        if(forfaitA) {
            if(forfaitX) {
                SessionAppli.listeParties[iPartie].score = -1;
                SessionAppli.listeParties[iPartie].scoreAX = "0-0";
            } else {
                SessionAppli.listeParties[iPartie].score = 0;
                SessionAppli.listeParties[iPartie].scoreAX = "0-2";
            }
        } else {
            if(forfaitX) {
                SessionAppli.listeParties[iPartie].score = 3;
                SessionAppli.listeParties[iPartie].scoreAX = "2-0";
            }
        }
    }

    MemoriseDouble(double: string) {

        // trace du double à mémoriser
        console.log("Double : " + double);

        // mettre à jour la partie avec le double renseigné
        var i = 0;
        var iDouble = 0;
        var trouve=false;

        console.log("On cherche le double " + this.numDouble);
        while (!trouve && i < SessionAppli.listeParties.length) {
                // chercher les doubles
                console.log(">>" + SessionAppli.listeParties[i].desc);
                if(SessionAppli.listeParties[i].desc.charAt(0) =="*"
                || SessionAppli.listeParties[i].desc.charAt(0) =="#") {
                    iDouble ++;
                    console.log("Double "+ iDouble + "=" + SessionAppli.listeParties[i].desc);
                    if(iDouble == this.numDouble) {
                        console.log("Trouvé double " + iDouble);
                        trouve = true;
                        // si l'adversaire n'a pas déjà été renseigné la description commence par ***
                        if(SessionAppli.listeParties[i].desc.charAt(1) =="*") {
                            SessionAppli.listeParties[i].desc = "*" + double;
                        } else {
                            // si on est coté X et que l'adversaire a déjà été renseigné
                            if(this.cote == "X") {
                                SessionAppli.listeParties[i].desc = "#" + SessionAppli.listeParties[i].desc.substring(1) + double + "=";
                            } else {
                                SessionAppli.listeParties[i].desc = "#" + double.substring(1) + SessionAppli.listeParties[i].desc + "=";
                            }
                        }
                        // mettre à jour le score si un des doubles est forfait
                        this.MajScoreDoubleForfait(i);
                        console.log("Partie = " + SessionAppli.listeParties[i].desc + ", score = " + SessionAppli.listeParties[i].scoreAX);
                    }
                }
            i++;
        }

        console.log("Double " + this.numDouble + " sur " + this.nbDoubles);
        // si numDouble < nbDoubles : demander la compo du double suivant
        if(this.numDouble < this.nbDoubles) {
            console.log("Saisie compo double suivant");
            this.numDouble++;
        } else {
            // si numDouble = nbDoubles et club qui reçoit : demander compo autre club
            if(this.numDouble == this.nbDoubles
                && ((this.cote == "X" && SessionAppli.recoitCoteX) || (this.cote == "A" && !SessionAppli.recoitCoteX)) ) {
                    this.numDouble = 1;
                    console.log("Saisie compo double " + this.numDouble + ", club " + (this.cote == "X" ? "A" : "X"));
                    if(this.cote =="X") {
                        this.cote = "A"
                        this.listeJoueurs = SessionAppli.equipeA;
                    } else {
                        this.cote = "X"
                        this.listeJoueurs = SessionAppli.equipeX;
                    }
            } else {
                // numDouble = nbDoubles et club qui se déplace : retour au lancement
                this.routerExt.navigate(["lancement"]);
            }
        }
    }

    ngOnInit(): void {
    }

    onAnnulerTap(args: EventData) {
        let button = args.object as Button;
        this.routerExt.navigate(["lancement"]);
    }

    onScanTap(args: EventData) {
        // appeler la page de scan
        this.routerExt.navigate(["/qrscan/DOUBLE/" + this.cote]);
    }

    onQRCodeTap(args: EventData) {
        var json:string="";

        // traduire la compo en JSON
        // montrer la compo
        var club:string;
        if(this.cote == "A") club = SessionAppli.clubA.nom;
        else                 club = SessionAppli.clubX.nom;

        this.routerExt.navigate(["/qrmontrer/" + json + "/" + SessionAppli.dimEcran + "/" + "Compo doubles " + club]);
    }

    onValiderTap(args: EventData) {
        let button = args.object as Button;

        // compter les joueurs sélectionnés
        var n:number = 0;
        var double:string;
        if(this.cote == "X") double =  " vs ";
        else double = "";
        for(var i = 0 ; i < this.listeJoueurs.length; i++) {
            if(this.listeJoueurs[i].sel) {
                if(double.length > 4){
                    double = double + ", ";
                }
                double = double + this.listeJoueurs[i].nom + " " + this.listeJoueurs[i].prenom
                n++;
            }
        }
        if(n < 2) {
            alert("Il manque " + (2 - n) + " joueurs dans le double 1");
            return;
        }

        if(n > 2) {
            alert("Il y a " + (n - 2) + " joueurs de trop dans le double 1");
            return;
        }
        // retirer de la liste les joueurs sélectionnés
        for(var i = this.listeJoueurs.length-1 ; i >= 0 ; i--) {
            if(this.listeJoueurs[i].sel) {
                this.listeJoueurs.splice(i, 1);
            }
        }
        // mémoriser le double dans la liste des parties
        this.MemoriseDouble(double);

    }



    onListViewLoaded(args: EventData) {
        this.maListe = <ListView>args.object;
    }

    onItemTap(args: ItemEventData) {
        const index = args.index;
        const liste = <ListView> args.object;


        // si le joueur est déjà sélectionné, le retirer du double
        if(this.listeJoueurs[index].sel) {
            this.listeJoueurs[index].double = 0;
        } else {
            // si le joueur n'est pas déjà dans un double, l'ajouter
            if(this.listeJoueurs[index].double == 0) {
                this.listeJoueurs[index].double = this.numDouble;
            }
        }
        this.listeJoueurs[index].sel = !this.listeJoueurs[index].sel;
    }


}
