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
import { ElementRef, ViewChild } from "@angular/core";



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
    router:RouterExtensions;
    numPartie:number;
    reclam:boolean;
    nbJaunesA:number=0;
    nbJaunesX:number=0;
    nbRougesA:number=0;
    nbRougesX:number=0;
    version:string;

    txfSet1:TextField;
    tf1:TextField=null;              // pour récupérer le textfield du set1
    tf2:TextField=null;              // pour récupérer le textfield du set2
    tf3:TextField=null;              // pour récupérer le textfield du set3
    tf4:TextField=null;              // pour récupérer le textfield du set4
    tf5:TextField=null;              // pour récupérer le textfield du set5

    @ViewChild('s1') tfs1: ElementRef;  // pour récupérer le textfield dont l'id est #s1
    @ViewChild('s2') tfs2: ElementRef;  // pour récupérer le textfield dont l'id est #s2
    @ViewChild('s3') tfs3: ElementRef;  // pour récupérer le textfield dont l'id est #s3
    @ViewChild('s4') tfs4: ElementRef;  // pour récupérer le textfield dont l'id est #s4
    @ViewChild('s5') tfs5: ElementRef;  // pour récupérer le textfield dont l'id est #s5


    constructor(private _route: ActivatedRoute, private routerExtensions: RouterExtensions) {
        // version logicielle
        this.version = SessionAppli.version;

        this.dim = SessionAppli.dimEcran;
        this.router = routerExtensions;
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

    ngAfterViewInit() {
        this.tf1 = this.tfs1.nativeElement;     // mémoriser le textView dans le composant
        this.tf2 = this.tfs2.nativeElement;     // mémoriser le textView dans le composant
        this.tf3 = this.tfs3.nativeElement;     // mémoriser le textView dans le composant
        this.tf4 = this.tfs4.nativeElement;     // mémoriser le textView dans le composant
        this.tf5 = this.tfs5.nativeElement;     // mémoriser le textView dans le composant

        if(this.set1) this.tf1.text = this.set1;
        if(this.set2) this.tf2.text = this.set2;
        if(this.set3) this.tf3.text = this.set3;
        if(this.set4) this.tf4.text = this.set4;
        if(this.set5) this.tf5.text = this.set5;
    } 

    onBlur1(args: EventData) {
        let tf = args.object as TextField;
        this.set1 = tf.text;
        if(!Set.ScoreOK(this.set1)) {
            // score incorrect
            alert("Score incorrect : veuillez le saisir sous la forme du nombre de points marqués par le vaincu précédé d'un signe moins (-) si le joueur de l'équipe X est le vainqueur.")
            // remet le focus dessus
            // tf.focus();
        }
    };
    onBlur2(args: EventData) {
        let tf = args.object as TextField;
        this.set2 = tf.text;
        if(!Set.ScoreOK(this.set2)) {
            // score incorrect
            alert("Score incorrect : veuillez le saisir sous la forme du nombre de points marqués par le vaincu précédé d'un signe moins (-) si le joueur de l'équipe X est le vainqueur.")
            // remet le focus dessus
            // tf.focus();
        }
    };
    onBlur3(args: EventData) {
        let tf = args.object as TextField;
        this.set3 = tf.text;
        if(!Set.ScoreOK(this.set3)) {
            // score incorrect
            alert("Score incorrect : veuillez le saisir sous la forme du nombre de points marqués par le vaincu précédé d'un signe moins (-) si le joueur de l'équipe X est le vainqueur.")
            // remet le focus dessus
            // tf.focus();
        }
    };
    onBlur4(args: EventData) {
        let tf = args.object as TextField;
        this.set4 = tf.text;
        if(!Set.ScoreOK(this.set4)) {
            // score incorrect
            alert("Score incorrect : veuillez le saisir sous la forme du nombre de points marqués par le vaincu précédé d'un signe moins (-) si le joueur de l'équipe X est le vainqueur.")
            // remet le focus dessus
            // tf.focus();
        }
    };
    onBlur5(args: EventData) {
        let tf = args.object as TextField;
        this.set5 = tf.text;
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

        if(this.tf1.text) this.set1 = this.tf1.text;
        if(this.tf2.text) this.set2 = this.tf2.text;
        if(this.tf3.text) this.set3 = this.tf3.text;
        if(this.tf4.text) this.set4 = this.tf4.text;
        if(this.tf5.text) this.set5 = this.tf5.text;

        if(this.ConstruitScore()) {
            // Afficher le résultat
            console.log("Resultat = " + this.quoi);
            // sauvegarder la session en BDD
            SessionAppli.Persiste().then(cr => {
                console.log("Session enregistrée");
            }, error => {
                console.log("Impossible de persister la session");
            });
            // Ouvrir la page de saisie des réclamations
            this.router.navigate(["saisiecommentaire/RECLAMATION/A/resultat" + toURL("/" + this.numPartie.toString())],
            {
                animated:true,
                transition: {
                    name : SessionAppli.animationAller, 
                    duration : 380,
                    curve : "easeIn"
                }
            });
        } else {
            alert("Score incorrect ou incomplet, merci de corriger avant de saisir la réclamation");
        }
    }

    onReclamX(args: EventData) {
        let button = args.object as Button;

        if(this.tf1.text) this.set1 = this.tf1.text;
        if(this.tf2.text) this.set2 = this.tf2.text;
        if(this.tf3.text) this.set3 = this.tf3.text;
        if(this.tf4.text) this.set4 = this.tf4.text;
        if(this.tf5.text) this.set5 = this.tf5.text;

        if(this.ConstruitScore()) {
            // Afficher le résultat
            console.log("Resultat = " + this.quoi);
            // sauvegarder la session en BDD
            SessionAppli.Persiste().then(cr => {
                console.log("Session enregistrée");
            }, error => {
                console.log("Impossible de persister la session");
            });
            // Ouvrir la page de saisie des réclamations
            this.router.navigate(["saisiecommentaire/RECLAMATION/X/resultat" + toURL("/" + this.numPartie.toString())],
            {
                animated:true,
                transition: {
                    name : SessionAppli.animationAller, 
                    duration : 380,
                    curve : "easeIn"
                }
            });
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
                                return true;
                            } else {
                                console.log("Echec de setScore");
                                return false;
                            }
                        } else {
                            console.log("set5 NOK");
                            return false;
                        } 
                    } else {
                        console.log("set4 NOK");
                        return false;
                    }
                } else {
                    console.log("set3 NOK");
                    return false;
                }
            } else {
                console.log("set2 NOK");
                return false;
            }
        } else {
            console.log("set1 NOK");
            return false;
        }
    }

    onTapValider(args: EventData) {
        let button = args.object as Button;

        if(this.tf1.text) this.set1 = this.tf1.text;
        if(this.tf2.text) this.set2 = this.tf2.text;
        if(this.tf3.text) this.set3 = this.tf3.text;
        if(this.tf4.text) this.set4 = this.tf4.text;
        if(this.tf5.text) this.set5 = this.tf5.text;

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
            // sauvegarder la session en BDD
            SessionAppli.Persiste().then(cr => {
                console.log("Session enregistrée");
                // Navigation
                if(SessionAppli.domicile == 1) {
                    this.router.navigate(["lancement"],
                    {
                        animated:true,
                        transition: {
                            name : SessionAppli.animationRetour, 
                            duration : 380,
                            curve : "easeIn"
                        }
                    });
                } else {
                    this.router.navigate(["actions"],
                    {
                        animated:true,
                        transition: {
                            name : SessionAppli.animationRetour, 
                            duration : 380,
                            curve : "easeIn"
                        }
                    });
                }
            }, error => {
                console.log("Impossible de persister la session");
            });           
        } else {
            alert("Score incorrect ou incomplet, merci de corriger");
        }
    }

    onTapFermer(args: EventData) {  
        if(SessionAppli.domicile == 1) {
            this.router.navigate(["lancement"],
            {
                animated:true,
                transition: {
                    name : SessionAppli.animationRetour, 
                    duration : 380,
                    curve : "easeIn"
                }
            });
        } else {
            this.router.navigate(["actions"],
            {
                animated:true,
                transition: {
                    name : SessionAppli.animationRetour, 
                    duration : 380,
                    curve : "easeIn"
                }
            });
        }
    }

    onTapScan(args: EventData) {
        // appeler la page de scan
        this.router.navigate(["/qrscan/RESULTAT/" + this.numPartie],
        {
            animated:true,
            transition: {
                name : SessionAppli.animationAller, 
                duration : 380,
                curve : "easeIn"
            }
        });
    }

    onTapQRCode(args: EventData) {

        if(this.tf1.text) this.set1 = this.tf1.text;
        if(this.tf2.text) this.set2 = this.tf2.text;
        if(this.tf3.text) this.set3 = this.tf3.text;
        if(this.tf4.text) this.set4 = this.tf4.text;
        if(this.tf5.text) this.set5 = this.tf5.text;
        // si pas de set saisi ou score OK
        if(this.ConstruitScore()
        || (this.set1 == null && this.set2 == null && this.set3 == null && this.set4 == null && this.set5 == null)) {
            // produire le json
            this.quoi = SessionAppli.listeParties[this.numPartie].ScoreToJSon(this.numPartie, SessionAppli.rencontreChoisie);
            let paramTitre:string;

            // encoder les / du titre
            paramTitre = toURLQuote(this.titre);

            console.log("Montrer QRCode : quoi=" + this.quoi + "; dim=" + this.dim + "; titre=" + paramTitre);
            this.router.navigate(["attente/" + this.quoi + "/" + this.dim + "/" + paramTitre
                                + "/" + "resultat" + "/" + this.numPartie.toString()],
                                {
                                    animated:true,
                                    transition: {
                                        name : SessionAppli.animationAller, 
                                        duration : 380,
                                        curve : "easeIn"
                                    }
                                });
        } else {
            alert(" incomplet, merci de corriger");
        }
    }

}




