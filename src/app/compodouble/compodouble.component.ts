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
import { Button, EventData, ListView, ItemEventData, Observable } from "@nativescript/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";
import { EltListeLicencie } from "../db/RespeqttDAO";
import { SessionAppli } from "../session/session";
import { _getStyleProperties } from "@nativescript/core/ui/core/view";

var dialogs = require("tns-core-modules/ui/dialogs");


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
    sousTitre:string;
    nbDoubles:number;
    doublesA:string[];
    doublesX:string[];
    iDouble:number[]=[];


    constructor(private _route: ActivatedRoute, private _routerExtensions: RouterExtensions) {
        // récupération du coté et du numéro de double en paramètre
        this.cote = this._route.snapshot.paramMap.get("cote");
        this.numDouble = Number(this._route.snapshot.paramMap.get("numDouble"));
        this.nbDoubles = Number(this._route.snapshot.paramMap.get("nbDoubles"));

        console.log("Compo double " + this.numDouble + " sur " + this.nbDoubles + " côté " + this.cote);

        // récupération du routeur pour naviguer
        this.routerExt = _routerExtensions;

        // mémorisation des parties correspondant aux doubles
        for(var i = 0; i < SessionAppli.listeParties.length; i++) {
            // chercher les doubles
            if(SessionAppli.listeParties[i].desc.charAt(0) =="*") {
                this.iDouble.push(i);
                console.log("Trouvé double dans partie " + i.toString());
            }
        }

        // Saisie du premier double
        this.SaisieDouble(this.cote, this.numDouble);
    }

    // Saisit la compo d'un double d'une des deux équipes (coté A ou X)
    private SaisieDouble(cote:string, num:number) {
        console.log("Saisie du double " + num + " côté " + cote);
        if(num == 1) {
            // récupérer l'équipe
            this.listeJoueurs = [];
            if(this.cote == "X") {
                this.doublesX = [];
                // recopie de la liste des joueurs de l'équipe
                for(var i = 0; i < SessionAppli.equipeX.length; i++){
                    this.listeJoueurs.push(SessionAppli.equipeX[i]);
                    this.listeJoueurs[i].double = 0;
                }
                this.sousTitre = "Double " + this.numDouble.toString() + "/" + SessionAppli.clubX.nom;
            } else {
                this.doublesA = [];
                for(var i = 0; i < SessionAppli.equipeX.length; i++){
                    this.listeJoueurs.push(SessionAppli.equipeA[i]);
                    this.listeJoueurs[i].double = 0;
                }
                this.sousTitre = "Double " + this.numDouble.toString() + "/" + SessionAppli.clubA.nom;
            }
        }

        // désélectionner tout le monde et compter les joueurs pas déjà dans un double
        var iPasDouble:Array<number> = [];
        for(var i=0; i < this.listeJoueurs.length; i++) {
            this.listeJoueurs[i].sel = false;
            if(this.listeJoueurs[i].double == 0) {
                iPasDouble.push(i);
            } else {
                console.log(this.listeJoueurs[i].nom + " " + this.listeJoueurs[i].prenom + " déjà dans un double (" + this.listeJoueurs[i].double + ")");
            }
        }

        // s'il n'y a que deux joueurs possibles on compose le double et on sort directement
        console.log("nb joueurs pas en double=" + iPasDouble.length);
        if(iPasDouble.length == 2) {
            this.listeJoueurs[iPasDouble[0]].double = this.numDouble;
            this.listeJoueurs[iPasDouble[1]].double = this.numDouble;
            var double:string = this.listeJoueurs[iPasDouble[0]].nom + " " + this.listeJoueurs[iPasDouble[0]].prenom;
            double = double + ", " + this.listeJoueurs[iPasDouble[1]].nom + " " + this.listeJoueurs[iPasDouble[1]].prenom;
            this.MemoDouble(double);
            // on passe au suivant
            this.DoubleSuivant();
        }
    }

    private MemoDouble(double:string) {
        // trace du double à mémoriser
        console.log("Mémo local du double : " + double);

        // mémoriser localement le double pour le produire en confirmation
        if(this.cote == "X") {
            this.doublesX.push(double);
            console.log("iDoubleX.len=" + this.doublesX.length.toString());
        } else {
            this.doublesA.push(double);
            console.log("iDoubleA.len=" + this.doublesA.length.toString());
        }

        console.log("!!! Double mémorisé : " + this.numDouble + " sur " + this.nbDoubles + " !!!");
    }

    private MajDoubleDansSession() {

        for(var i = 0 ; i < this.nbDoubles; i++) {
            SessionAppli.listeParties[this.iDouble[i]].desc = "#" + this.doublesA[i] + " vs " + this.doublesX[i];
            // mettre à jour le score si un des doubles est forfait
            this.MajScoreDoubleForfait(this.iDouble[i]);
        }


        console.log("!!! Doubles mis à jour dans la session !!!");
    }

    private DoubleSuivant() {
        // si numDouble < nbDoubles : demander la compo du double suivant
        if(this.numDouble < this.nbDoubles) {
            console.log("Il reste des doubles à composer");
            this.numDouble++;
            this.SaisieDouble(this.cote, this.numDouble);
        } else {
            // si numDouble = nbDoubles et club qui reçoit : demander compo autre club
            if(this.numDouble == this.nbDoubles
              && ((this.cote == "X" && SessionAppli.recoitCoteX) || (this.cote == "A" && !SessionAppli.recoitCoteX)) ) {
                // demander confirmation avant de changer de coté
                var texteDoubles="";
                for(var i = 0; i < this.nbDoubles; i++) {
                    if(this.cote == "X") {
                        texteDoubles = texteDoubles + "\n" + "Double " + (i+1).toString() + ": " + this.doublesX[i];
                    } else {
                        texteDoubles = texteDoubles + "\n" + "Double " + (i+1).toString() + ": " + this.doublesA[i];
                    }
                }
                dialogs.prompt({title:"Confirmation",
                message:"Merci de valider la composition suivante pour les doubles : " + texteDoubles,
                okButtonText:"VALIDER",
                cancelButtonText:"ANNULER"
                }).then(r => {
                    if(r.result) {
                        console.log("!!! Compo des doubles validée !!!");
                        console.log("Changer de coté");
                        this.numDouble = 1;
                        console.log("Saisie compo double " + this.numDouble + ", club " + (this.cote == "X" ? "A" : "X"));
                        if(this.cote =="X") {
                            this.cote = "A"
                        } else {
                            this.cote = "X"
                        }
                        this.SaisieDouble(this.cote, this.numDouble);
                    } else {
                        console.log("!!! Compo des doubles annulée !!!");
                        this.numDouble = 1;
                        this.SaisieDouble(this.cote, this.numDouble);
                    }
                });
            } else {
                // demander confirmation avant de fermer
                var texteDoubles="";
                for(var i = 0; i < this.nbDoubles; i++) {
                    if(this.cote == "X") {
                        texteDoubles = texteDoubles + "\n" + "Double " + (i+1).toString() + ": " + this.doublesX[i];
                    } else {
                        texteDoubles = texteDoubles + "\n" + "Double " + (i+1).toString() + ": " + this.doublesA[i];
                    }
                }
                dialogs.prompt({title:"Confirmation",
                message:"Merci de valider la composition suivante pour les doubles : " + texteDoubles,
                okButtonText:"VALIDER",
                cancelButtonText:"ANNULER"
                }).then(r => {
                    if(r.result) {
                        console.log("!!! Compo des doubles validée !!!");
                        // mettre à jour la session
                        this.MajDoubleDansSession();

                        // sauvegarder la session en BDD
                        SessionAppli.Persiste();

                        // retour à la page des parties
                        this.routerExt.navigate(["lancement"]);
                    } else {
                        console.log("!!! Compo des doubles annulée !!!");
                        this.numDouble = 1;
                        if(this.cote == "X") {
                            for(var i = 0; i < SessionAppli.equipeX.length; i++) {
                                SessionAppli.equipeX[i].double = 0;
                            }
                        } else {
                            for(var i = 0; i < SessionAppli.equipeA.length; i++) {
                                SessionAppli.equipeA[i].double = 0;
                            }
                        }
                        this.SaisieDouble(this.cote, this.numDouble);
                    }
                });
            }
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
                SessionAppli.listeParties[iPartie].scoreAX = "0-0";
            } else {
                SessionAppli.listeParties[iPartie].scoreAX = "0-2";
            }
        } else {
            if(forfaitX) {
                SessionAppli.listeParties[iPartie].scoreAX = "2-0";
            }
        }
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

        console.log(this.listeJoueurs.length.toString() + "joueurs dans la liste avant validation");

        // compter les joueurs sélectionnés
        var n:number = 0;
        var double:string="";

        for(var i = 0 ; i < this.listeJoueurs.length; i++) {
            if(this.listeJoueurs[i].sel) {
                if(double.length > 0){
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
        console.log(this.listeJoueurs.length.toString() + "joueurs dans la liste");

        for(var i = this.listeJoueurs.length-1 ; i >= 0 ; i--) {
            if(this.listeJoueurs[i].sel) {
                this.listeJoueurs.splice(i, 1);
            }
        }
        // mémoriser le double dans la liste des parties
        this.MemoDouble(double);
        this.DoubleSuivant();
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
