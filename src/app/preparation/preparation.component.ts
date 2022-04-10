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
//*     along with this program.  If not, see <https://www.gnu.org/licenses/>.  */
/*                                                                             */
/*******************************************************************************/

import { Component, ChangeDetectionStrategy, ElementRef, ViewChild } from "@angular/core";
import { Button, EventData, Switch, ItemEventData, TextField } from "@nativescript/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";

var dialogs = require("@nativescript/core/ui/dialogs");

import { EltListeLicencie, Club } from "../db/RespeqttDAO";
import { SessionAppli } from "../session/session";

import { Maintenant } from "../outils/outils";

enum couleur {jaune, rouge};

@Component({
    templateUrl: "./preparation.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreparationComponent{
    recoitCoteX:boolean
    titreRencontre:string;
    modif:boolean=false;
    actValider:boolean=false;
    actReserve:boolean=false;
    switchActif:boolean=false;
    router:RouterExtensions;
    txtBtnResA:string;
    txtBtnResX:string;
    clubA:string;
    clubX:string;
    listeEquipeA:Array<EltListeLicencie>=[];
    listeEquipeX:Array<EltListeLicencie>=[];
    lieu:string="";
    carton:couleur=null;
    cartonsActifs:boolean=true;
    version:string;
    valEqA:boolean=false;
    valEqX:boolean=false;
    btnResA:string;
    btnResX:string;

    tf:TextField=null;



    private MajLibBoutonsReserves() {
        if(SessionAppli.reserveClubA == "") {
            this.btnResA = "0 réserve club A";
        } else {
            this.btnResA = "Réserve(s) club A";
        }
        if(SessionAppli.reserveClubX == "") {
            this.btnResX = "0 réserve club X";
        } else {
            this.btnResX = "Réserve(s) club X";
        }
    }

    constructor(private _route: ActivatedRoute, private routerExtensions: RouterExtensions) {

        // version logicielle
        this.version = SessionAppli.version;

        this.router = routerExtensions;
        this.recoitCoteX=SessionAppli.recoitCoteX;
        this.titreRencontre = SessionAppli.titreRencontre;
        console.log("Rencontre : " + this.titreRencontre);


        // si rencontre de travail alors club A = club choisi
        if(SessionAppli.rencontreChoisie) {
            this.clubA = "A/" + SessionAppli.clubA.nom;
            this.clubX = "X/" + SessionAppli.clubX.nom;
            // proposer le club A par défaut si pas de lieu choisi
            if(SessionAppli.lieu == "") {
                this.lieu = SessionAppli.clubA.nom;
            } else {
                this.lieu = SessionAppli.lieu;
            }
        } else {
            // récupérer le club choisi
            Club.getClub(SessionAppli.clubChoisi).then(c => {;
                SessionAppli.clubA = c as Club;
                this.clubA = SessionAppli.clubA.nom;
                this.lieu = SessionAppli.clubA.nom;
                this.clubX = "X";
            }, error => {
                console.log("Impossible de trouver le club choisi : " + SessionAppli.clubChoisi, error);
            });
        }

        // on commence avec une liste vide si pas d'équipe déjà composée
        for(var i = 0; i < SessionAppli.equipeA.length; i++) {
            this.listeEquipeA.push(SessionAppli.equipeA[i]);
        }
        for(var i = 0; i < SessionAppli.equipeX.length; i++) {
            this.listeEquipeX.push(SessionAppli.equipeX[i]);
        }
        // Renseigne les boutons des réserves
        this.MajLibBoutonsReserves();

        // Trace de la date et de l'heure de la rencontre
        console.log("Date heure de la rencontre :" + SessionAppli.date);

        // on fixe le mode rencontre en fonction de l'onglet sur lequel on est
        SessionAppli.modeRencontre = SessionAppli.tab == 0;

        // on inverse si besoin
        if(SessionAppli.recoitCoteX) {
            this.EchangerCotes();
        }

        // on valide les boutons QRCode si équipe chargée
        if(SessionAppli.equipeA.length > 0) {
            this.valEqA = true;
        }
        if(SessionAppli.equipeX.length > 0) {
            this.valEqX = true;
        }

        this.modif = !SessionAppli.compoFigee && !SessionAppli.scoreValide;
        this.switchActif = !SessionAppli.compoFigee && !SessionAppli.scoreValide;
        this.actValider = (SessionAppli.domicile == 1 && !SessionAppli.compoFigee && !SessionAppli.scoreValide);
//                        || (SessionAppli.domicile == 0 && SessionAppli.equipeA.length > 0 && SessionAppli.equipeX.length > 0);
        this.actReserve = (SessionAppli.domicile == 1) && !(SessionAppli.listeParties.length > 0);
        this.cartonsActifs = !SessionAppli.scoreValide;

        console.log("actValider=" + this.actValider.toString());
    }

    ngAfterViewInit(): void {
    }

    private EchangerCotes() {
        let s:string=SessionAppli.reserveClubA;
        let c = SessionAppli.clubA;
        let cap = SessionAppli.capitaineA;
        let e = SessionAppli.equipeA;

        // échanger les clubs et les équipes et mémoriser dans la session
        SessionAppli.clubA = SessionAppli.clubX;
        SessionAppli.clubX = c;
        SessionAppli.equipeA = SessionAppli.equipeX;
        SessionAppli.equipeX = e;
        SessionAppli.capitaineA = SessionAppli.capitaineX;
        SessionAppli.capitaineX = cap;
        SessionAppli.recoitCoteX = this.recoitCoteX;
        SessionAppli.reserveClubA = SessionAppli.reserveClubX;
        SessionAppli.reserveClubX = s;
        // recalculer le libellé des boutons des réserves
        this.MajLibBoutonsReserves();

        this.clubA = "A/" + SessionAppli.clubA.nom;
        this.clubX = "X/" + SessionAppli.clubX.nom;

        // on inverse les équipes dans la liste
        this.listeEquipeA = [];
        for(var i = 0; i < SessionAppli.equipeA.length; i++) {
            this.listeEquipeA.push(SessionAppli.equipeA[i]);
        }
        this.listeEquipeX = [];
        for(var i = 0; i < SessionAppli.equipeX.length; i++) {
            this.listeEquipeX.push(SessionAppli.equipeX[i]);
        }
        // validité des équipes
        let v:boolean;
        v = this.valEqA;
        this.valEqA = this.valEqX;
        this.valEqX = v;

        console.log("Recoit cote X = " + this.recoitCoteX.toString());

    }

    onCheckedChange(args: EventData) {
        let sw = args.object as Switch;
        this.recoitCoteX = sw.checked; // boolean
        SessionAppli.recoitCoteX = sw.checked; // boolean

        this.EchangerCotes();
    }

    onBlurLieu(args: EventData) {
        let t = args.object as TextField;

        this.lieu = t.text;
        console.log("Lieu:" + this.lieu);
    } 

    onFocusLieu(args: EventData) {
        this.tf = args.object as TextField;
        console.log("Dans lieu");
    }         

    onReserveA(args: EventData) {
        let button = args.object as Button;

        // mémoriser le lieu s'il a été saisi
        SessionAppli.lieu = this.lieu;
        // Ouvrir la page de saisie des réserves
        if(this.actReserve) {
            // ouverture en saisie
            this.router.navigate(["saisiecommentaire/RESERVE/A/preparation"],
            {
                animated:true,
                transition: {
                    name : SessionAppli.animationAller, 
                    duration : 380,
                    curve : "easeIn"
                }
            });
        } else {
            // ouverture en consultation
            this.router.navigate(["saisiecommentaire/RESERVE-C/A/preparation"],
            {
                animated:true,
                transition: {
                    name : SessionAppli.animationAller, 
                    duration : 380,
                    curve : "easeIn"
                }
            });
        }
    }

    onReserveX(args: EventData) {
        let button = args.object as Button;
        // mémoriser le lieu s'il a été saisi
        SessionAppli.lieu = this.lieu;
        if(this.actReserve) {
            // ouverture en saisie
            this.router.navigate(["saisiecommentaire/RESERVE/X/preparation"],
            {
                animated:true,
                transition: {
                    name : SessionAppli.animationAller, 
                    duration : 380,
                    curve : "easeIn"
                }
            });
        } else {
            // ouverture en consultation
            this.router.navigate(["saisiecommentaire/RESERVE-C/X/preparation"],
            {
                animated:true,
                transition: {
                    name : SessionAppli.animationAller, 
                    duration : 380,
                    curve : "easeIn"
                }
            });
        }
    }

    // valider la feuille de match et interdire les modifs
    onValiderFeuille(args: EventData) {
        let button = args.object as Button;

        // Demander confirmation
        dialogs.prompt({title:"Confirmation",
        message:"Etes vous sûr de valider la composition des équipes ?",
        okButtonText:"VALIDER",
        cancelButtonText:"ANNULER"
        }).then(r => {
            // vérifier que les deux équipes ont été saisies ou forfait
            if((SessionAppli.equipeA.length == 0 && !SessionAppli.forfaitA)
            || (SessionAppli.equipeX.length == 0 && !SessionAppli.forfaitX)) {
                alert("Les deux équipes n'ont pas été renseignées.");
                return;
            } else {
                // passer en mode rencontre
                SessionAppli.modeRencontre = true;
                // figer la composition des deux équipes
                SessionAppli.compoFigee = true;
                // mémoriser la date de la rencontre
                SessionAppli.date = Maintenant();
                console.log("Date heure de la rencontre :" + SessionAppli.date);
                // mémoriser le lieu de la rencontre
                if(this.tf != null){
                    this.lieu = this.tf.text;
                }
                SessionAppli.lieu = this.lieu;
                // désactiver les boutons
                this.modif = false;
                this.switchActif = false;
                this.actValider = false;
    }

            // sauvegarder la session en BDD
            SessionAppli.Persiste().then(cr => {
                console.log("Session enregistrée");
                // retourner à la page des actions
                this.router.navigate(["actions"],
                {
                    animated:true,
                    transition: {
                        name : SessionAppli.animationRetour, 
                        duration : 380,
                        curve : "easeIn"
                    }
                });
            }, error => {
                console.log("Impossible de persister la session");
            });
        });
    }

    // Compo équipe A
    onCompoA (args: EventData) {
        // mémoriser le lieu s'il a été saisi
        SessionAppli.lieu = this.lieu;
        // compo de l'équipe A
        this.router.navigate(["compo/A"],
        {
            animated:true,
            transition: {
                name : SessionAppli.animationAller, 
                duration : 380,
                curve : "easeIn"
            }
        });
    }

    // Compo équipe X
    onCompoX (args: EventData) {
        // mémoriser le lieu s'il a été saisi
        SessionAppli.lieu = this.lieu;
        // compo de l'équipe X
        this.router.navigate(["compo/X"],
        {
            animated:true,
            transition: {
                name : SessionAppli.animationAller, 
                duration : 380,
                curve : "easeIn"
            }
        });
    }

    private cartons(couleurCarton:couleur) {
        alert("Cliquer sur un joueur pour lui donner un carton");
        this.carton = couleurCarton;
    }

    // choisir un carton jaune
    onJaune (args: EventData) {
        this.cartons(couleur.jaune);
    }

    // choisir un carton rouge
    onRouge (args: EventData) {
        this.cartons(couleur.rouge);
    }

    // donner un carton au joueur désigné
    private donneCarton(index:number, equipe:EltListeLicencie[]) {
        const joueur = equipe[index].nom + " " + equipe[index].prenom;

        // Demander confirmation
        dialogs.prompt({title:"Confirmation",
        message:"Confimez-vous le carton donné à " + joueur,
        okButtonText:"CONFIRMER",
        cancelButtonText:"ANNULER"
        }).then(r => {
            if(r.result) {
                equipe[index].cartons +=  (this.carton == couleur.jaune ? 1 : 10);
                console.log("Carton " + (this.carton == couleur.jaune ? "jaune" : "rouge") + " donné à " + joueur);
            }
            // dans tous les cas on annule le carton donné ou pas
            this.carton = null;
        });
    }

    // donner un carton au joueur désigné
    onJoueurATap(args: ItemEventData) {
        const index = args.index;
        if(this.carton != null) {
            this.donneCarton(index, SessionAppli.equipeA);
        }
}

    // donner un carton au joueur désigné
    onJoueurXTap(args: ItemEventData) {
        const index = args.index;
        if(this.carton != null) {
            this.donneCarton(index, SessionAppli.equipeX);
        }
}

    // calcule le nb de cartons jaunes reçus
    private nbJaunes(cartons:number):number {
        return cartons % 10;
    }

    // calcule le nb de cartons rouges reçus
    private nbRouges(cartons:number):number {
        return Math.floor(cartons / 10);
    }

    // compose le texte indiquant le nb de cartons d'un joueur
    private alerteCartons(couleurCarton:couleur, joueur:EltListeLicencie):string {
        var alerte:string="";
        var nbC:number;

        if(couleurCarton == couleur.jaune) {
            nbC = this.nbJaunes(joueur.cartons);
        } else {
            nbC = this.nbRouges(joueur.cartons);
        }
        switch (nbC) {
            case 0 :
            break;
            case 1 :
                alerte = joueur.nom + " " + joueur.prenom + " a reçu un carton " + (couleurCarton == couleur.jaune ? "jaune" : "rouge") + ";\n";

            break;
            default:
                alerte = joueur.nom + " " + joueur.prenom + " a reçu " + joueur.cartons + " cartons "+ (couleurCarton == couleur.jaune ? "jaune" : "rouge") + "s;\n";
        }
        return alerte;
    }

    // voir les cartons déjà distribués
    onVoirCartons(args: EventData) {
        var texteA:string="";
        var texteX:string="";
        var nA:boolean=false;
        var nX:boolean=false;

        for(var i = 0; i < SessionAppli.nbJoueurs; i++) {
            texteA = texteA + this.alerteCartons(couleur.jaune, SessionAppli.equipeA[i]);
            texteA = texteA + this.alerteCartons(couleur.rouge, SessionAppli.equipeA[i]);
            if(texteA != "") nA = true;
        }
        if(!nA) {
            texteA = "Aucun carton n'a été distribué";
        }


        for(var i = 0; i < SessionAppli.nbJoueurs; i++) {
            texteX = texteX + this.alerteCartons(couleur.jaune, SessionAppli.equipeX[i]);
            texteX = texteX + this.alerteCartons(couleur.rouge, SessionAppli.equipeX[i]);
            if(texteX != "") nX = true;
        }
        if(!nX) {
            texteX = "Aucun carton n'a été distribué";
        }

        // affichage
        alert("Equipe A:\n" + texteA + "\nEquipe X:\n" + texteX);
    }

    onQRCodeA(args: EventData) {
        // montrer le QRCode de l'équipe A
        const quoi:string= SessionAppli.EquipetoJSon(SessionAppli.equipeA, SessionAppli.clubA.id, SessionAppli.capitaineA.id, SessionAppli.formule);
        const titre:string=SessionAppli.titreRencontre + " équipe " + SessionAppli.clubA.nom;
        const dim:number = SessionAppli.dimEcran - 40;

         this.router.navigate(["attente/" + quoi + "/" + dim + "/" + titre + "/preparation/aucun"],
         {
             animated:true,
             transition: {
                 name : SessionAppli.animationAller, 
                 duration : 380,
                 curve : "easeIn"
             }
         });
    }

    onQRCodeX(args: EventData) {
        // montrer le QRCode de l'équipe X
        const quoi:string= SessionAppli.EquipetoJSon(SessionAppli.equipeX, SessionAppli.clubX.id, SessionAppli.capitaineX.id, SessionAppli.formule);
        const titre:string=SessionAppli.titreRencontre + " équipe " + SessionAppli.clubX.nom;
        const dim:number = SessionAppli.dimEcran - 40;

         this.router.navigate(["attente/" + quoi + "/" + dim + "/" + titre + "/preparation/aucun"],
         {
             animated:true,
             transition: {
                 name : SessionAppli.animationAller, 
                 duration : 380,
                 curve : "easeIn"
             }
         });
    }

    // Fermer
    onFermer(args: EventData) {
        // on efface tout si rien n'a été saisi
        if(SessionAppli.equipeA.length == 0 && SessionAppli.equipeX.length == 0) {
            SessionAppli.titreRencontre = "";
            SessionAppli.rencontreChoisie = -1;
            SessionAppli.domicile = -1;
        } else {
            // mémoriser le lieu saisi (ou pas)
            console.log("Lieu =" + this.lieu);
            SessionAppli.lieu = this.lieu;
        }
        // retourner à la page des actions
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



