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
import { Tabs, Button, EventData } from "@nativescript/core";
import { RespeqttDb } from "../db/dbRespeqtt";
import { EltListeRencontre, Rencontre, Partie } from "../db/RespeqttDAO";
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
    preparer:boolean=false;                       // activation du bouton : préparer la feuille de match
    lancer: boolean=false;                        // activation du bouton : lancer les parties
    valider:boolean=false;                        // activation du bouton : valider le score
    spid:boolean=false;                           // activation du bouton : envoyer à SPID
    abandonner:boolean=false;                     // activation du bouton : abandonner la rencontre en cours
    tab:number=SessionAppli.tab;                        // tab présenté
    modeRencontre:boolean=SessionAppli.modeRencontre;   // mode rencontre ou mode saisie équipe/saisie de score hors rencontre


    constructor(private _routerExtensions: RouterExtensions) {
        this.routerExt = _routerExtensions;

        // Init de la BDD
        RespeqttDb.Init().then(ok => {
            // on ne prépare la feuille de match que si on a téléchargé les rencontres
            if(SessionAppli.listeRencontres.length == 0) {
                Rencontre.getListe().then(liste => {
                    if(liste) {
                        SessionAppli.listeRencontres = liste as Array<EltListeRencontre>;
                        console.log("Liste rencontres chargées = " + SessionAppli.listeRencontres.length + " éléments");
                        this.preparer = SessionAppli.listeRencontres.length > 0;
                    } else {
                        this.preparer = false;
                    }
                }, error => {
                    console.log(error);
                    this.preparer = false;
                });
            } else {
                this.preparer = true;
            }
            // on ne lance les parties que si la compo est figée
            this.lancer = SessionAppli.compoFigee && SessionAppli.modeRencontre;

            // on ne valide le score que si les parties ont été lancées
            this.valider = (SessionAppli.listeParties.length > 0)  && SessionAppli.modeRencontre;

            // on n'envoie à SPID que si le scoré a été validé
            this.spid = SessionAppli.scoreValide && SessionAppli.modeRencontre;

            // on ne peut abandonner que si on a commencé et pas validé le score
            this.abandonner = this.preparer && !SessionAppli.scoreValide;

            console.log("Mode rencontre : " + (this.modeRencontre ? "OUI" : "NON"));

        }, error => {
            console.log(error);
            this.preparer = false;
        });


    }

    ngOnInit(): void {

        // calcul de la largeur de l'écran
        var mobile:Mobile= new Mobile;
        SessionAppli.dimEcran = mobile.largeurEcran < mobile.hauteurEcran ? mobile.largeurEcran : mobile.hauteurEcran;
    }

    onFeuille(args: EventData) {
        let button = args.object as Button;

        // consulter ou envoyer la feuille de match
        this.routerExt.navigate(["feuille"]);
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
        // si tout n'a pas été joué, on demande confirmation (la 1e fois)
        if(!scoreComplet && SessionAppli.licenceJA == 0) {
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
            // to do : envoi à SPID
            // on RAZ (temporaire)
            SessionAppli.Efface(SessionAppli.rencontreChoisie);
            SessionAppli.Raz();
            alert("La rencontre a bien été envoyée, vous pouvez la consulter sur http://www.fftt.com");

            this.preparer = SessionAppli.listeRencontres.length > 0;
            this.lancer = false;
            this.valider = false;
            this.spid = false;
            this.abandonner = false;

//            this.routerExt.navigate(["envoi"]);
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
                    // effacement en BDD
                    SessionAppli.Efface(SessionAppli.rencontreChoisie);
                    SessionAppli.Raz();

                    this.preparer = SessionAppli.listeRencontres.length > 0;
                    this.lancer = false;
                    this.valider = false;
                    this.spid = false;
                    this.abandonner = false;

                    // Fin du mode rencontre
                    SessionAppli.modeRencontre = false;
                    this.modeRencontre = SessionAppli.modeRencontre;

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
        if(SessionAppli.rencontreChoisie >= 0) {
            this.routerExt.navigate(["preparation"]);
        } else {
            this.routerExt.navigate(["choixrencontre"]);
        }
    }


    onTabChanged(args: EventData) {
        // vers quel onglet va-t-on
        const tab = args.object as Tabs;
        // onglet 2 = scan de la partie
        if(tab.selectedIndex == 2) {
            SessionAppli.tab = 2;
            // préparation de la session
            if(SessionAppli.rencontreChoisie < 0) {
                var p:Partie;
                SessionAppli.rencontreChoisie = 0;
                p = new Partie("", null, null, false, false);
                p.desc = "PARTIE IMPORTEE";
                SessionAppli.listeParties.push(p);
                console.log("Partie  à scanner :" + SessionAppli.listeParties[0].desc);
            }
            // appeler la page de scan des parties
            this.routerExt.navigate(["/qrscan/PARTIE/0"]);
        }

    }


    onClub(args: EventData) {
        SessionAppli.tab = 1;
        // appeler la page de compo des équipes
        this.routerExt.navigate(["clubs/actions"]);
    }

    onJoueurs(args: EventData) {
        SessionAppli.tab = 1;
        // appeler la page de compo des équipes
        this.routerExt.navigate(["joueurs"]);
    }

    onRencontre(args: EventData) {
        SessionAppli.tab = 1;
        // appeler la page de choix de rencontre
        this.routerExt.navigate(["choixrencontre"]);
    }

    onCompo(args: EventData) {
        // préparation de la session
        if(SessionAppli.rencontreChoisie < 0) {
            SessionAppli.tab = 1;
            SessionAppli.rencontreChoisie = 0;
        }
        // appeler la page de compo des équipes
        this.routerExt.navigate(["preparation"]);
    }

    onPartie(args: EventData) {
        // préparation de la session
        if(SessionAppli.rencontreChoisie < 0) {
            SessionAppli.tab = 1;
            SessionAppli.rencontreChoisie = 0;
        }
        // appeler la page de scan des parties
        this.routerExt.navigate(["qrscan/PARTIE/0"]);
    }


}
