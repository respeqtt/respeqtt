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
import { Button, EventData, ListView, ItemEventData, Observable, ObservableArray } from "@nativescript/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";
import { EltListeLicencie, Licencie, Club } from "../db/RespeqttDAO";
import { SessionAppli } from "../session/session";
import { _getStyleProperties } from "@nativescript/core/ui/core/view";

var dialogs = require("@nativescript/core/ui/dialogs");

import { erreur } from "../outils/outils";
import { ViewContainerRef } from "@angular/core";
import { ModalDialogService } from "@nativescript/angular";


@Component({
    templateUrl: "./compo.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"]
})
export class CompoComponent{
    listeJoueurs:Array<EltListeLicencie>;
    maListe:Observable;
    cote:boolean;
    clubChoisi:Club;
    router: RouterExtensions;
    equipe:Array<EltListeLicencie> = [];
    modeRencontre:boolean = SessionAppli.modeRencontre;
    actScanner:boolean=true;
    version:string;

    constructor(private _route: ActivatedRoute, private _routerExtensions: RouterExtensions, private modal: ModalDialogService, private vcRef: ViewContainerRef) {

        // version logicielle
        this.version = SessionAppli.version;
        
        // récupération du coté en paramètre
        console.log("compo COTE=" + this._route.snapshot.paramMap.get("cote"));
        if(this._route.snapshot.paramMap.get("cote") =="A") {
            this.cote = false;
        } else {
            this.cote = true;
        }
        console.log("Choix joueurs coté " + this._route.snapshot.paramMap.get("cote"));

        // récupération du routeur pour naviguer
        this.router = _routerExtensions;

        // recherche du club correspondant
        if(this.cote) {
            this.clubChoisi = SessionAppli.clubX;
        }
        else {
            this.clubChoisi = SessionAppli.clubA;
        }
        // recherche de la liste des joueurs du club
        Licencie.getListe(this.clubChoisi.id).then(liste => {
            // Ajouter un joueur "Absent" pour les forfaits
            let abs = new EltListeLicencie;
            abs.nom = "(absent)";
            abs.prenom = "";
            abs.id = 0;
            abs.points = 0;
            abs.cartons = 0;
            abs.sel = false;
            abs.double = 0;

            this.listeJoueurs = liste as Array<EltListeLicencie>;
            if(this.listeJoueurs != null) {
                console.log(this.listeJoueurs.length.toString() + " joueurs");
            }

            this.listeJoueurs.push(abs);

            // permettre deux forfaits ?
            let abs2 = new EltListeLicencie;
            abs2.nom = "(absent)";
            abs2.prenom = "";
            abs2.id = 1;
            abs2.points = 0;
            abs2.cartons = 0;
            abs2.sel = false;
            abs2.double = 0;
            this.listeJoueurs.push(abs2);


            this.maListe = new Observable();
            this.maListe.set("listeJoueurs", new ObservableArray(this.listeJoueurs));
        }, error => {

        });
    }

    ngOnInit(): void {

    }

    onAnnulerTap(args: EventData) {
        let button = args.object as Button;
        this.router.navigate(["preparation"],
        {
            animated:true,
            transition: {
                name : SessionAppli.animationRetour, 
                duration : 380,
                curve : "easeIn"
            }
        });
    }

    onScanTap(args: EventData) {
        // appeler la page de scan
        this.router.navigate(["/qrscan/COMPO/" + this._route.snapshot.paramMap.get("cote")],
        {
            animated:true,
            transition: {
                name : SessionAppli.animationAller, 
                duration : 380,
                curve : "easeIn"
            }
        });
    }

    onForfaitTap($event){
        dialogs.prompt({title:"Confirmation",
            message:"Etes vous sûr que l'équipe de " + this.clubChoisi.nom + " est bien forfait ?",
            okButtonText:"VALIDER",
            cancelButtonText:"ANNULER"
            }).then(r => {
                if(r.result) {
                    if(this.cote) {
                        SessionAppli.forfaitX = true;
                        console.log("FORFAIT EQUIPE " + SessionAppli.clubX.nom);
                    } else {
                        SessionAppli.forfaitA = true;
                        console.log("FORFAIT EQUIPE " + SessionAppli.clubA.nom);
                    }
                    // Revenir à la page de préparation de la feuille
                    this.router.navigate(["preparation"],
                    {
                        animated:true,
                        transition: {
                            name : SessionAppli.animationRetour, 
                            duration : 380,
                            curve : "easeIn"
                        }
                    });
                } else {
                    console.log("FORFAIT ANNULE");
                }
            });

    }

    onValiderTap(args: EventData) {
        let button = args.object as Button;

        console.log(this.equipe.length + " Joueurs sélectionnés");
        console.log(SessionAppli.nbJoueurs + " Joueurs par équipe");

        // compter les joueurs
        if(this.equipe.length < SessionAppli.nbJoueurs) {
            erreur(this, "Il manque " + (SessionAppli.nbJoueurs - this.equipe.length) + " joueurs dans l'équipe");
        } else {
            // mémoriser l'équipe sélectionnée
            if(this.cote) {
                SessionAppli.equipeX = this.equipe;
                console.log("Joueurs équipe X choisis");
            }
            else {
                SessionAppli.equipeA = this.equipe;
                console.log("Joueurs équipe A choisis");
            }
            // passer à la page de placement des joueurs sur la feuille de match
            this.router.navigate(["placer/" + this._route.snapshot.paramMap.get("cote")],
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


    onListViewLoaded(args: EventData) {
        this.maListe = <ListView>args.object;
    }

    onItemTap(args: ItemEventData) {
        const index = args.index;
        const liste = <ListView> args.object;
        const joueur = this.listeJoueurs[index];

        // chercher si le joueur est déjà sélectionné
        var trouve:boolean = false;
        var j = 0;
        while (j < this.equipe.length && !trouve) {
            if(joueur.id == this.equipe[j].id) {
                // on a trouvé
                trouve = true;
                //déselectionner
                this.listeJoueurs[index].sel = false;
                // si c'est le dernier on le retire de l'équipe
                if(j == this.equipe.length - 1) {
                    this.equipe.pop();
                }
                else {
                    // on recopie le dernier et on le supprime
                    this.equipe[j] = this.equipe[this.equipe.length - 1];
                    this.equipe.pop();
                }
                console.log("Joueur désélectionné : " + joueur.id + "(index=" + index + ")");
            }
            j++;
        }
        if(!trouve) {
            // vérifier qu'il n'y a pas trop de joueurs
            if(this.equipe.length >= SessionAppli.nbJoueurs)  {
                alert("L'équipe est complète");
            } else {
                // sélectionner
                this.listeJoueurs[index].sel = true;
                // on l'ajoute à l'équipe et on raz son appartenance à un double
                joueur.double = 0;
                this.equipe.push(joueur);
                console.log("Joueur sélectionné : " + joueur.id +"(index=" + index + ")");
            }
        }
    }


}
