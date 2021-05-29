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
import { Button, EventData, ListView, ItemEventData, Observable, ObservableArray } from "@nativescript/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";
import { EltListeLicencie, Club, Licencie, ListeFormules, FormuledeRencontre } from "../db/RespeqttDAO";
import { SessionAppli } from "../session/session";
import { _getStyleProperties } from "@nativescript/core/ui/core/view";


@Component({
    templateUrl: "./placer.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"]
})
export class PlacerComponent{
    listeJoueurs:Observable;        // liste des joueurs montrée sur l'IHM
    cote:boolean;                   // côté A ou X
    clubChoisi:Club;                // club
    routerExt: RouterExtensions;    // pour navigation
    equipe:Array<EltListeLicencie>; // equipe présentée dans la liste de joueurs
    joueurSel:number=-1;             // rang du joueur sélectionné dans l'équipe
    alphabet:string="?ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    listePlaces:Array<string> = [];
    capitaine:string="";
    licenceCapitaine:number=null;

    constructor(private _route: ActivatedRoute, private _routerExtensions: RouterExtensions) {
        // récupération du coté en paramètre
        console.log("COTE=" + this._route.snapshot.paramMap.get("cote"));
        if(this._route.snapshot.paramMap.get("cote") =="A") {
            this.cote = false;
        } else {
            this.cote = true;
        }
        // récupération du routeur pour naviguer
        this.routerExt = _routerExtensions;

        // recherche du club correspondant
        // liste des places
        const f:FormuledeRencontre = ListeFormules.getFormule(SessionAppli.formule);
        if (this.cote) {
            this.clubChoisi = SessionAppli.clubX;
            this.equipe = SessionAppli.equipeX;
            // init de la liste des places
            for(var i= 0; i < SessionAppli.nbJoueurs; i++ ) {
                this.listePlaces.push(f.joueursX);
                this.equipe[i].place = f.joueursX.charAt(i*2);
            }
        } else {
            this.clubChoisi = SessionAppli.clubA;
            this.equipe = SessionAppli.equipeA;
            // init de la liste des places
            for(var i= 0; i < SessionAppli.nbJoueurs; i++ ) {
                this.listePlaces.push(f.joueursA);
            this.equipe[i].place = f.joueursA.charAt(i*2);
            }
        }

        if(SessionAppli.equipeA) {
            console.log("Equipe A session = " + SessionAppli.equipeA.toString());
        } else {
            console.log("!!! Pas d'équipe A !!!");
        }
        if(SessionAppli.equipeX) {
            console.log("Equipe X session = " + SessionAppli.equipeX.toString());
        } else {
            console.log("!!! Pas d'équipe X !!!");
        }
        // construction de la liste des joueurs
        this.listeJoueurs = new Observable();
        this.listeJoueurs.set("listeJoueurs", new ObservableArray(this.equipe));
        for(var i = 0; i < SessionAppli.nbJoueurs; i++) {
            console.log("Joueur[" + (i+1) + "]= " + this.equipe[i].place + "/" + this.equipe[i].id);
            this.equipe[i].sel = false;
        }
    }

    ngOnInit(args: EventData): void {
    }

    onUp(args:EventData) {
        let button = args.object as Button;

        // si le joueur sélectionné n'est pas en haut, on le monte, on met à jour sa place et on met à jour son rang dans joueurSel
        if(this.joueurSel > 0) {
            var swap = this.equipe[this.joueurSel - 1];
            this.equipe[this.joueurSel - 1] = this.equipe[this.joueurSel];
            this.equipe[this.joueurSel - 1].place = this.listePlaces[this.joueurSel - 1];
            this.equipe[this.joueurSel] = swap;
            this.equipe[this.joueurSel].place = this.listePlaces[this.joueurSel];
            this.joueurSel--;
        }
    }

    onDown(args:EventData) {
        let button = args.object as Button;

        // si le joueur sélectionné n'est pas en bas, on le descend, on met à jour sa place et on met à jour son rang dans joueurSel
        if(this.joueurSel < SessionAppli.nbJoueurs - 1) {
            var swap = this.equipe[this.joueurSel + 1];
            this.equipe[this.joueurSel + 1] = this.equipe[this.joueurSel];
            this.equipe[this.joueurSel + 1].place = this.listePlaces[this.joueurSel + 1];
            this.equipe[this.joueurSel] = swap;
            this.equipe[this.joueurSel].place = this.listePlaces[this.joueurSel];
            this.joueurSel++;
        }
    }

    onAnnulerTap(args: EventData) {
        let button = args.object as Button;
        this.routerExt.navigate(["preparation"]);
    }

    onValiderTap(args: EventData) {
        let button = args.object as Button;

        // vérifier que le capitaine a été saisi
        if((this.cote && !SessionAppli.capitaineX) || (!this.cote && !SessionAppli.capitaineA)) {
            alert("Merci de saisir le numéro de licence du capitaine");
            return;
        }

        // trier les joueurs dans l'ordre des places
        var equipeFinale:Array<EltListeLicencie> = [];
        for(var i = 0; i < SessionAppli.nbJoueurs; i++) {
            equipeFinale.push(this.equipe[i]);
        }
        // tracer le json
        console.log("Equipe= " + SessionAppli.EquipetoJSon(this.equipe, this.clubChoisi.id, this.licenceCapitaine, SessionAppli.formule));

        if(this.cote) {
            SessionAppli.equipeX = equipeFinale;
        } else {
            SessionAppli.equipeA = equipeFinale;
        }
        this.routerExt.navigate(["preparation"]);
    }

    onQRCodeTap(args: EventData) {
        const quoi:string= SessionAppli.EquipetoJSon(this.equipe, this.clubChoisi.id, this.licenceCapitaine, SessionAppli.formule);
        const titre:string=SessionAppli.titreRencontre + " équipe " + this.clubChoisi.nom;
        const dim:number = SessionAppli.dimEcran - 40;

         this.routerExt.navigate(["attente/" + quoi + "/" + dim + "/" + titre + "/placer/" + (this.cote ? "X" : "A")]);
    }

    onEquipeLoaded(args: EventData) {
        this.listeJoueurs = <ListView>args.object;
    }

    onJoueurTap(args: ItemEventData) {
        const index = args.index;

        // déselectionner les autres joueurs
        for(var i = 0; i < SessionAppli.nbJoueurs; i++) {
            if(i == index) {
                // inverser la sélection du joueur
                this.equipe[index].sel = !this.equipe[index].sel;
                if(this.equipe[index].sel) {
                    this.joueurSel = index;
                } else {
                    this.joueurSel = -1;
                }
            } else {
                this.equipe[i].sel = false;
            }
        }
    }

    onCapitaine(args: EventData) {

        // si joueur sélectionné alors on le prend comme capitaine
        if(this.joueurSel >=0 && this.equipe[this.joueurSel].id > 9) {
            this.licenceCapitaine = this.equipe[this.joueurSel].id;
        }
        if(this.licenceCapitaine != null) {
            console.log("licence du capitaine choisi = " + this.licenceCapitaine);
            Licencie.get(this.licenceCapitaine, this.clubChoisi.id).then(j =>{
                if(j) {
                    if(this.cote) {
                        SessionAppli.capitaineX = j as EltListeLicencie;
                        this.capitaine = SessionAppli.capitaineX.nom + " " + SessionAppli.capitaineX.prenom;
                    } else {
                        SessionAppli.capitaineA = j as EltListeLicencie;
                        this.capitaine = SessionAppli.capitaineA.nom + " " + SessionAppli.capitaineA.prenom;
                        }
                    } else {
                        alert("Licence " + this.licenceCapitaine + " inconnue");
                        this.licenceCapitaine = null;
                        this.capitaine = "";
                        if(this.cote) {
                            SessionAppli.capitaineX = null;
                        } else {
                            SessionAppli.capitaineA = null;
                        }
                            }
            }, error => {alert("Erreur :" + error.toString())
            });
        } else {
            alert("Merci de choisir un joueur présent ou de saisir le numéro de licence du capitaine");
        }
    }

}

