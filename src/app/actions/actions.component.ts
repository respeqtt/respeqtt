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

var dialogs = require("tns-core-modules/ui/dialogs");

var Sqlite = require ("nativescript-sqlite");

@Component({
    templateUrl: "./actions.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"]
})
export class ActionsComponent{
    routerExt: RouterExtensions;            // pour navigation
    preparer:boolean;                       // activation du bouton : préparer la feuille de match
    lancer: boolean;                        // activation du bouton : lancer les parties
    valider:boolean;                        // activation du bouton : valider le score
    spid:boolean;                           // activation du bouton : envoyer à SPID


    constructor(private _routerExtensions: RouterExtensions) {
        this.routerExt = _routerExtensions;

        // Init de la BDD
        RespeqttDb.Init();

        // on ne prépare la feuille de match que si on a chargé les rencontres
        this.preparer = SessionAppli.listeRencontres.length > 0;

        // on ne lance les parties que si la compo est figée
        this.lancer = SessionAppli.compoFigee;

        // on ne valide le score que si les parties ont été lancées
        this.valider = SessionAppli.listeParties.length > 0;

        // on n'envoie à SPID que si le scoré a été validé
        this.spid = SessionAppli.scoreValide;

    }

    ngOnInit(): void {

        // calcul de la largeur de l'écran
        var mobile:Mobile= new Mobile;
        SessionAppli.dimEcran = mobile.largeurEcran < mobile.hauteurEcran ? mobile.largeurEcran : mobile.hauteurEcran;
    }

    onValiderScore(args: EventData) {
        let button = args.object as Button;
        // Vérifier que toutes les rencontres ont été disputées
        let scoreA:number = 0;
        let scoreX:number = 0;
        let scoreComplet:boolean=true;

        if(SessionAppli.listeParties.length == 0) {
            alert("Les parties n'ont pas encore été lancées, vous ne pouvez pas valider le score");
            return;
        }

        // calcul du score final
        scoreComplet = SessionAppli.MajScore();

        console.log("*** Score final =" + SessionAppli.score + " ***");
        console.log("*** ScoreComplet :" + scoreComplet.toString() + " ***");

        let cr:boolean;
        // si tout n'a pas été joué, on demande confirmation
        if(!scoreComplet) {
            dialogs.prompt({title:"Confirmation",
                message:"Toutes les rencontres n'ont pas été disputées, êtes vous sûr de vouloir valider en l'état ?",
                okButtonText:"VALIDER",
                cancelButtonText:"ANNULER"
                }).then(r => {
                    if(r.result) {
                        this.routerExt.navigate(["valider/"+ SessionAppli.scoreA + "/" + SessionAppli.scoreX]);
                } else {
                    console.log("VALIDATION ANNULEE");
                    return;
                }
            });
        } else {
            this.routerExt.navigate(["valider/"+scoreA+"/"+scoreX]);
        }
    }

    onEnvoyerASPID(args: EventData) {
        let button = args.object as Button;
        if(this.spid) {
            this.routerExt.navigate(["envoi"]);
        }

    }

    onAbandonner(args: EventData) {
        let button = args.object as Button;

        dialogs.prompt({title:"Confirmation",
            message:"Etes vous sûr de vouloir abandonner la rencontre " + SessionAppli.titreRencontre
                    + " ? Les compositions et les résultats seront effacés.",
            okButtonText:"ABANDONNER LA RENCONTRE",
            cancelButtonText:"ANNULER"
            }).then(r => {
                if(r.result) {
                    // tout effacer dans la session sauf la liste des rencontres
                    SessionAppli.rencontre = null;
                    SessionAppli.rencontreChoisie = -1;
                    SessionAppli.compoFigee = false;
                    SessionAppli.scoreValide = false;
                    SessionAppli.titreRencontre = "";
                    SessionAppli.clubA = null;
                    SessionAppli.clubX = null;
                    SessionAppli.clubChoisi = -1;
                    SessionAppli.equipeA = [];
                    SessionAppli.equipeX = [];
                    SessionAppli.forfaitA = false;
                    SessionAppli.forfaitX = false;
                    SessionAppli.listeParties = [];
                    SessionAppli.recoitCoteX = false;
                    SessionAppli.titreRencontre = "";
                    SessionAppli.listeParties=[];
                    SessionAppli.reserveClubA="";
                    SessionAppli.reserveClubX="";
                    SessionAppli.reclamationClubA="";
                    SessionAppli.reclamationClubX="";
                    SessionAppli.rapportJA="";
                    SessionAppli.nomJA="";
                    SessionAppli.prenomJA="";
                    SessionAppli.adresseJA="";
                    SessionAppli.licenceJA=0;
                    SessionAppli.score="";

                    this.preparer = SessionAppli.listeRencontres.length > 0;
                    // on ne lance les parties que si la compo est figée
                    this.lancer = SessionAppli.compoFigee;
                    // on ne valide le score que si les parties ont été lancées
                    this.valider = SessionAppli.listeParties.length > 0;
                    // on n'envoie à SPID que si le scoré a été validé
                    this.spid = SessionAppli.scoreValide;

                    alert("Rencontre abandonnée");
                } else {
                    console.log("Abandon ANNULE");
                }
            });
    }

    onLancement(args: EventData) {
        let button = args.object as Button;
        // vérifier si on peut passer sur la page de lancement des parties
        // inutile : le bouton est inactif si pas this.lancer
        if(this.lancer) {
            this.routerExt.navigate(["lancement"]);
        }
    }

    onPreparer(args: EventData) {
        if(SessionAppli.rencontre) {
            this.routerExt.navigate(["preparation"]);
        } else {
            this.routerExt.navigate(["choixrencontre"]);
        }
    }

    onDropDB(args: EventData) {
        RespeqttDb.Drop();
        alert("BDD supprimée");
    }
}
