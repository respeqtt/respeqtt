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
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";
import { Button, EventData } from "@nativescript/core";
import { SessionAppli } from "../session/session";
import { URLtoStringSansQuote, HeureMinCourante } from "../outils/outils";
import { ElementRef, ViewChild } from "@angular/core";
import { TextView } from "@nativescript/core";

var dialogs = require("@nativescript/core/ui/dialogs");

@Component({
    templateUrl: "./saisiecommentaire.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"]
 })
export class SaisieCommentaireComponent {
    router:RouterExtensions;
    titre:string="";
    sousTitre:string;
    saisie:string="";
    auteur:string="";
    retour:string="";
    consult:boolean=true;
    version:string;

    tv:TextView=null;              // pour récupérer le textView de la saisie

    @ViewChild('tvSaisie') tvSaisie: ElementRef;  // pour récupérer le textView dont l'id est #tvSaisie

    constructor(private _route: ActivatedRoute, private _routerExtensions: RouterExtensions) {
        // version logicielle
        this.version = SessionAppli.version;


        this.router = _routerExtensions;
        this.titre =  this._route.snapshot.paramMap.get("quoi");
        this.auteur =  this._route.snapshot.paramMap.get("auteur");
        this.retour = URLtoStringSansQuote(this._route.snapshot.paramMap.get("retour"));
        this.saisie = SessionAppli.rapportJA;

        console.log("Objet= " + this.titre);
        console.log("Auteur >" + this.auteur + "<");
        console.log("Retour= " + this.retour);

        // on met l'heure de rédaction de la réserve
        let maintenant = new Date();
        switch(this.auteur) {
            case "A" :
                this.sousTitre = "posée par " + SessionAppli.clubA.nom + " sur la rencontre " + SessionAppli.titreRencontre;
                switch(this.titre) {
                    case "RESERVE" :
                        if(SessionAppli.reserveClubA != "") {
                            this.saisie = SessionAppli.reserveClubA;
                        }
                        this.saisie = this.saisie + "POSEE A " + HeureMinCourante(maintenant) + "PAR " + this.auteur + " ; score = " + SessionAppli.score + "\n";
                    break;
                    case "RESERVE-C" :
                        console.log("Reserve :" + SessionAppli.reserveClubA);
                        this.saisie = SessionAppli.reserveClubA;
                        this.consult = false;
                    break;
                    case "RECLAMATION" :
                        if(SessionAppli.reclamationClubA != "") {
                            this.saisie = SessionAppli.reclamationClubA;
                            this.saisie = this.saisie + "\n";
                        }
                        if(this.retour.substring(0, 7) == "valider") {
                            this.saisie = this.saisie + "POSEE EN FIN DE RENCONTRE A ";
                        } else {
                            const partie:number = Number(this.retour.substring(9))+1;
                            this.saisie = this.saisie + "POSEE SUR LA PARTIE " + partie.toString() + " A ";
                        }
                        this.saisie = this.saisie + HeureMinCourante(maintenant) + "PAR " + this.auteur + " ; score = " + SessionAppli.score + "\n";
                    break;
                }
            break;

            case "X" :
                this.sousTitre = "posée par " + SessionAppli.clubX.nom + " sur la rencontre " + SessionAppli.titreRencontre;
                switch(this.titre) {
                    case "RESERVE" :
                        if(SessionAppli.reserveClubX != "") {
                            this.saisie = SessionAppli.reserveClubX;
                        }
                        this.saisie = this.saisie + "POSEE A " + HeureMinCourante(maintenant) + "PAR " + this.auteur + " ; score = " + SessionAppli.score + "\n";
                    break;
                    case "RESERVE-C" :
                        console.log("Reserve :" + SessionAppli.reserveClubX);
                        this.saisie = SessionAppli.reserveClubX;
                        this.consult = false;
                    break;
                    case "RECLAMATION" :
                        if(SessionAppli.reclamationClubX != "") {
                            this.saisie = SessionAppli.reclamationClubX;
                            this.saisie = this.saisie + "\n";
                        }
                        if(this.retour.substring(0, 7) == "valider") {
                                this.saisie = this.saisie + "POSEE EN FIN DE RENCONTRE A ";
                        } else {
                            const partie:number = Number(this.retour.substring(9))+1;
                            this.saisie = this.saisie + "POSEE SUR LA PARTIE " + partie.toString() + " A ";
                        }
                        this.saisie = this.saisie + HeureMinCourante(maintenant) + "PAR " + this.auteur + " ; score = " + SessionAppli.score + "\n";
                    break;
                }
            break;

            default:
                this.sousTitre = this.auteur;
                console.log("Auteur=" + this.auteur);
        }
        console.log("Fin constructeur");
    }

    
    ngAfterViewInit() {
        this.tv = this.tvSaisie.nativeElement;     // mémoriser le textView dans le composant (cf onTapValidate)
        console.log("afterViewInit=" + this.saisie);
        this.tv.text = this.saisie;
    } 

     onTapValidate(args: EventData) {
        let auteur:string;

        // mémoriser la saisie
        this.saisie = this.tv.text;
        console.log("Obs:" + this.saisie);
        
        if(this.titre == "RESERVE") {
            dialogs.prompt({title:"Confirmation",
                message:"Texte de la réserve posée par le club " + auteur + ": " + this.saisie,
                okButtonText:"VALIDER",
                cancelButtonText:"ANNULER"
                }).then(r => {
                    if(r.result) {
                        // mémoriser la réserve de l'équipe indiquée
                        if(this.auteur == "A") {
                            SessionAppli.reserveClubA = this.saisie;
                            auteur = SessionAppli.clubA.nom;
                        } else {
                            SessionAppli.reserveClubX = this.saisie;
                            auteur = SessionAppli.clubX.nom;
                        }
                } else {
                    console.log("RESERVE ANNULEE");
                    return;
                }
            });
        }
        if(this.titre == "RECLAMATION") {
            dialogs.prompt({title:"Confirmation",
                message:"Texte de la réclamation posée par le club " + auteur + ": " + this.saisie,
                okButtonText:"VALIDER",
                cancelButtonText:"ANNULER"
                }).then(r => {
                    if(r.result) {
                        // mémoriser la réclamation de l'équipe indiquée
                        if(this.auteur == "A") {
                            SessionAppli.reclamationClubA = this.saisie;
                            auteur = SessionAppli.clubA.nom;
                        } else {
                            SessionAppli.reclamationClubX = this.saisie;
                            auteur = SessionAppli.clubX.nom;
                        }
                } else {
                    console.log("RECLAMATION ANNULEE");
                    return;
                }
            });
        }
        if(this.titre == "RAPPORT") {
            if(this.saisie) {
                dialogs.prompt({title:"Confirmation",
                    message:"Texte du rapport du JA " + this.auteur + ": " + this.saisie,
                    okButtonText:"VALIDER",
                    cancelButtonText:"ANNULER"
                    }).then(r => {
                        if(r.result) {
                            // mémoriser le rapport du JA (RAS par défaut)
                            console.log("Saisie :" + this.saisie);
                            SessionAppli.rapportJA = this.saisie;
                    } else {
                        console.log("RAPPORT JA ANNULE");
                        return;
                    }
                });
            }
        }
        // sauvegarder la session en BDD
        SessionAppli.Persiste().then(cr => {
            console.log("Session enregistrée");
            // retour à la page appelante
            this.router.navigate([this.retour],
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
    }

    onTapClose(args: EventData) {
        let button = args.object as Button;
        // retour à la page appelante
        this.router.navigate([this.retour],
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
