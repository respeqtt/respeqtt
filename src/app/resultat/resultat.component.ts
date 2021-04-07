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
import { Button, EventData, TextField } from "@nativescript/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";
import { SessionAppli } from "../session/session";
import { Set } from "../db/RespeqttDAO";
import { toURLQuote, toURL } from "../outils/outils";



@Component({
    templateUrl: "./resultat.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"]
})
export class ResultatComponent{
    set1: string;
    set2: string;
    set3: string;
    set4: string;
    set5: string;
    titre:string;
    quoi:string;
    dim: number;
    routeur:RouterExtensions;
    numPartie:number;
    reclam:boolean;
    nbJaunesA:number=0;
    nbJaunesX:number=0;
    nbRougesA:number=0;
    nbRougesX:number=0;

    txfSet1:TextField;

    constructor(private _route: ActivatedRoute, private routerExtensions: RouterExtensions) {
        this.dim = SessionAppli.dimEcran;
        this.routeur = routerExtensions;
        this.numPartie = Number(_route.snapshot.paramMap.get("partie"));
        console.log("Saisie résultats partie " + _route.snapshot.paramMap.get("partie"));

        // on ne peut saisir les réclamations qu'en mode rencontre
        this.reclam = SessionAppli.modeRencontre;

        // supprimer le 1er caractère des doubles et le dernier pour tous
        if(SessionAppli.listeParties[this.numPartie].desc.charAt(0) == "#") {
            this.titre = SessionAppli.listeParties[this.numPartie].desc.substring(1,SessionAppli.listeParties[this.numPartie].desc.length-1);
        } else {
            this.titre = SessionAppli.listeParties[this.numPartie].desc.substring(0,SessionAppli.listeParties[this.numPartie].desc.indexOf("="));
        }
        console.log("Titre = " + this.titre);

        // init des sets si déjà saisis
        if(SessionAppli.listeParties[this.numPartie].sets) {
            if(SessionAppli.listeParties[this.numPartie].sets.length > 0)
                this.set1 = SessionAppli.listeParties[this.numPartie].sets[0].score;
            if(SessionAppli.listeParties[this.numPartie].sets.length > 1)
                this.set2 = SessionAppli.listeParties[this.numPartie].sets[1].score;
            if(SessionAppli.listeParties[this.numPartie].sets.length > 2)
                this.set3 = SessionAppli.listeParties[this.numPartie].sets[2].score;
            if(SessionAppli.listeParties[this.numPartie].sets.length > 3)
                this.set4 = SessionAppli.listeParties[this.numPartie].sets[3].score;
            if(SessionAppli.listeParties[this.numPartie].sets.length > 4)
                this.set5 = SessionAppli.listeParties[this.numPartie].sets[4].score;
        }
    }

    ngOnInit() {

    }

    onBlur1(args: EventData) {
        let tf = args.object as TextField;
        if(!Set.ScoreOK(this.set1)) {
            // score incorrect
            alert("Score incorrect : veuillez le saisir sous la forme du nombre de points marqués par le vaincu précédé d'un signe moins (-) si le joueur de l'équipe X est le vainqueur.")
            // remet le focus dessus
            // tf.focus();
        }
    };
    onBlur2(args: EventData) {
        let tf = args.object as TextField;
        if(!Set.ScoreOK(this.set2)) {
            // score incorrect
            alert("Score incorrect : veuillez le saisir sous la forme du nombre de points marqués par le vaincu précédé d'un signe moins (-) si le joueur de l'équipe X est le vainqueur.")
            // remet le focus dessus
            // tf.focus();
        }
    };
    onBlur3(args: EventData) {
        let tf = args.object as TextField;
        if(!Set.ScoreOK(this.set3)) {
            // score incorrect
            alert("Score incorrect : veuillez le saisir sous la forme du nombre de points marqués par le vaincu précédé d'un signe moins (-) si le joueur de l'équipe X est le vainqueur.")
            // remet le focus dessus
            // tf.focus();
        }
    };
    onBlur4(args: EventData) {
        let tf = args.object as TextField;
        if(!Set.ScoreOK(this.set4)) {
            // score incorrect
            alert("Score incorrect : veuillez le saisir sous la forme du nombre de points marqués par le vaincu précédé d'un signe moins (-) si le joueur de l'équipe X est le vainqueur.")
            // remet le focus dessus
            // tf.focus();
        }
    };
    onBlur5(args: EventData) {
        let tf = args.object as TextField;
        if(!Set.ScoreOK(this.set5)) {
            // score incorrect
            alert("Score incorrect : veuillez le saisir sous la forme du nombre de points marqués par le vaincu précédé d'un signe moins (-) si le joueur de l'équipe X est le vainqueur.")
            // remet le focus dessus
            // tf.focus();
        }
    };

    // ajoute le résultat d'un set dans la liste des sets de la partie si le score n'est pas vide ou incorrect
    AjouteRes(listeRes:Array<Set>, res:string) {

        if(res && res !="") {
            var score:Set;

            score = new Set(res);
            listeRes.push(score);
        }
    }

    onReclamA(args: EventData) {
        let button = args.object as Button;

        if(this.ConstruitScore()) {
            // Afficher le résultat
            console.log("Resultat = " + this.quoi);
            // Ouvrir la page de saisie des réclamations
            this.routeur.navigate(["saisiecommentaire/RECLAMATION/A/resultat" + toURL("/" + this.numPartie.toString())]);
        } else {
            alert("Score incorrect ou incomplet, merci de corriger avant de saisir la réclamation");
        }
    }

    onReclamX(args: EventData) {
        let button = args.object as Button;

        if(this.ConstruitScore()) {
            // Afficher le résultat
            console.log("Resultat = " + this.quoi);
            // Ouvrir la page de saisie des réclamations
            this.routeur.navigate(["saisiecommentaire/RECLAMATION/X/resultat" + toURL("/" + this.numPartie.toString())]);
        } else {
            alert("Score incorrect ou incomplet, merci de corriger avant de saisir la réclamation");
        }
    }

    ConstruitScore():boolean {

        // construire le score
        var resPartie:Array<Set>=[];

        if(Set.ScoreOK(this.set1)) {
            this.AjouteRes(resPartie, this.set1);
            if(Set.ScoreOK(this.set2)) {
                this.AjouteRes(resPartie, this.set2);
                if(Set.ScoreOK(this.set3)) {
                    this.AjouteRes(resPartie, this.set3);
                    if(Set.ScoreOK(this.set4)) {
                        this.AjouteRes(resPartie, this.set4);
                        if(Set.ScoreOK(this.set5)) {
                            this.AjouteRes(resPartie, this.set5);

                            console.log(resPartie.length + " sets dans le résultat");

                            if(SessionAppli.listeParties[this.numPartie].setScore(resPartie, SessionAppli.nbSetsGagnants)) {
                                this.quoi = SessionAppli.listeParties[this.numPartie].ScoreToJSon(this.numPartie, SessionAppli.rencontreChoisie);
                                console.log(this.quoi);
                                // sauvegarder la session en BDD
                                SessionAppli.Persiste();
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    }

    onTapValidate(args: EventData) {
        let button = args.object as Button;

        if(this.ConstruitScore()) {
            // Afficher le résultat
            console.log("Résultat = " + this.quoi);
            // Comptabiliser les cartons
            for(var i = 0; i < SessionAppli.nbJoueurs; i++) {
                if(SessionAppli.listeParties[this.numPartie].joueurX == SessionAppli.equipeX[i].id) {
                    SessionAppli.equipeX[i].cartons = SessionAppli.equipeX[i].cartons + this.nbJaunesX + 10*this.nbRougesX;
                }
                if(SessionAppli.listeParties[this.numPartie].joueurA == SessionAppli.equipeA[i].id) {
                    SessionAppli.equipeA[i].cartons = SessionAppli.equipeA[i].cartons + this.nbJaunesA + 10*this.nbRougesA;
                }
            }
            // Navigation
            this.routeur.navigate(["lancement"]);
        } else {
            alert("Score incorrect ou incomplet, merci de corriger");
        }
}

    onTapClose(args: EventData) {
            // Navigation
            this.routeur.navigate(["lancement"]);
    }

    onTapScan(args: EventData) {
        // appeler la page de scan
        this.routeur.navigate(["/qrscan/RESULTAT/" + this.numPartie]);
    }

    onTapQRCode(args: EventData) {
        // si pas de set saisi ou score OK
        if(this.ConstruitScore()
        || (this.set1 == null && this.set2 == null && this.set3 == null && this.set4 == null && this.set5 == null)) {
            // produire le json
            this.quoi = SessionAppli.listeParties[this.numPartie].ScoreToJSon(this.numPartie, SessionAppli.rencontreChoisie);
            let paramTitre:string;

            // encoder les / du titre
            paramTitre = toURLQuote(this.titre);

            console.log("Montrer QRCode : quoi=" + this.quoi + "; dim=" + this.dim + "; titre=" + paramTitre);
            this.routeur.navigate(["attente/" + this.quoi + "/" + this.dim + "/" + paramTitre
                                + "/" + "resultat" + "/" + this.numPartie.toString()]);
        } else {
            alert("Score incorrect ou incomplet, merci de corriger");
        }
    }

}




