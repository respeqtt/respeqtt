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
import { Label, Button, EventData, TextField } from "@nativescript/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";
import { SessionAppli } from "../session/session";
import { Set } from "../db/RespeqttDAO";

@Component({
    templateUrl: "./resultat.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"]
})
export class ResultatComponent{
    set1: number;
    set2: number;
    set3: number;
    set4: number;
    set5: number;
    titre:string;
    quoi:string;
    dim: number;
    routeur:RouterExtensions;
    numPartie:number;

    constructor(private _route: ActivatedRoute, private routerExtensions: RouterExtensions) {
        this.dim = SessionAppli.dimEcran;
        this.routeur = routerExtensions;
        this.numPartie = Number(_route.snapshot.paramMap.get("partie"));
        console.log("Saisie résultats partie " + _route.snapshot.paramMap.get("partie"));

        this.titre = SessionAppli.listeParties[this.numPartie].desc;
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

    // ajoute le résultat d'un set dans la liste des sets de la partie
    AjouteRes(listeRes:Array<Set>, res:number) : boolean {

        var score:Set;

        score = new Set(res);
        listeRes.push(score);

        return true;
    }

    onTapValidate(args: EventData) {
        let button = args.object as Button;
        // construire le score
        var resPartie:Array<Set>=[];

        if(!isNaN(this.set1)) {
            console.log("Set1=" + this.set1);
            this.AjouteRes(resPartie, this.set1);
            if(!isNaN(this.set2)) {
                console.log("Set2=" + this.set2);
                this.AjouteRes(resPartie, this.set2);
                if(!isNaN(this.set3)) {
                    console.log("Set3=" + this.set3);
                    this.AjouteRes(resPartie, this.set3);
                    if(!isNaN(this.set4)) {
                        console.log("Set4=" + this.set4);
                        this.AjouteRes(resPartie, this.set4);
                        if(!isNaN(this.set5))
                        console.log("Set5=" + this.set5);
                        this.AjouteRes(resPartie, this.set5);
                    }
                }
            }
        }

        if(SessionAppli.listeParties[this.numPartie].setScore(resPartie, SessionAppli.rencontre)) {
            this.quoi = SessionAppli.listeParties[this.numPartie].ScoreToJSon(this.numPartie, SessionAppli.rencontre);
            console.log(this.quoi);
        } else {
            // init scores invalides
            this.set1 = NaN;
            this.set2 = NaN;
            this.set3 = NaN;
            this.set4 = NaN;
            this.set5 = NaN;

            alert("Score incorrect ou incomplet, merci de corriger");
            return;
        }

        // Afficher le résultat
         console.log("Resultat = " + this.quoi);
        // Navigation
        this.routeur.navigate(["lancement"]);
}

    onTapScan(args: EventData) {
        // appeler la page de scan
        this.routeur.navigate(["/qrscan/PARTIE/" + this.numPartie]);
    }

    onTapQRCode(args: EventData) {
        console.log("Montrer QRCode : quoi=" + this.quoi + "; dim=" + this.dim + "; titre=" + this.titre);
        // produire le json
        this.quoi = SessionAppli.listeParties[this.numPartie].ScoreToJSon(this.numPartie, SessionAppli.rencontre);
        this.routeur.navigate(['/qrmontrer', this.quoi,  this.dim, this.titre]);
    }

}




