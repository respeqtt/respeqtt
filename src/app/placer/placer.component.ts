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
import { ElementRef, ViewChild } from "@angular/core";
import { RouterExtensions } from "@nativescript/angular";
import { EltListeLicencie, Club, Licencie, ListeFormules, FormuledeRencontre, Respeqtt, Compo } from "../db/RespeqttDAO";
import { SessionAppli } from "../session/session";
import { _getStyleProperties } from "@nativescript/core/ui/core/view";
import { TextField } from "@nativescript/core";


@Component({
    templateUrl: "./placer.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"]
})
export class PlacerComponent{
    listeJoueurs:Observable;        // liste des joueurs montrée sur l'IHM
    cote:boolean;                   // côté A ou X
    clubChoisi:Club;                // club
    router: RouterExtensions;    // pour navigation
    equipe:Array<EltListeLicencie>; // equipe présentée dans la liste de joueurs
    parties:Array<string>;          // ordre des parties
    joueurSel:number=-1;             // rang du joueur sélectionné dans l'équipe
    alphabet:string="?ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    listePlaces:Array<string> = [];
    capitaine:string="";
    licenceCapitaine:number=null;
    version:string;
    actValider:boolean=true;
    actCapitaine:boolean=true;

    tf:TextField=null;              // pour récupérer le textfield de la licence

    @ViewChild('tfLic') tfLic: ElementRef;  // pour récupérer le textfield dont l'id est #tfLic

    constructor(private _route: ActivatedRoute, private _routerExtensions: RouterExtensions) {
        // version logicielle
        this.version = SessionAppli.version;

        this.actValider = (SessionAppli.domicile == 1) || (SessionAppli.domicile == 0);

        // récupération du coté en paramètre
        console.log("placer COTE=" + this._route.snapshot.paramMap.get("cote"));
        if(this._route.snapshot.paramMap.get("cote") =="A") {
            this.cote = false;
        } else {
            this.cote = true;
        }


        // récupération du routeur pour naviguer
        this.router = _routerExtensions;

        // recherche du club correspondant
        // liste des places
        const f:FormuledeRencontre = ListeFormules.getFormule(SessionAppli.formule);
        if (this.cote) {
            this.clubChoisi = SessionAppli.clubX;
            this.equipe = SessionAppli.equipeX;
            // init de la liste des places
            for(let i= 0; i < SessionAppli.nbJoueurs; i++ ) {
                this.listePlaces.push(f.joueursX);
                this.equipe[i].place = f.joueursX.charAt(i*2);
            }
        } else {
            this.clubChoisi = SessionAppli.clubA;
            this.equipe = SessionAppli.equipeA;
            // init de la liste des places
            for(let i= 0; i < SessionAppli.nbJoueurs; i++ ) {
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

        // init de l'ordre des parties
        this.parties = new Array<string>();
        for(let i=0; i< f.desc.length/3; i++) {
            let s = (i+1).toString() + " ";
            if(Number(f.desc.substring(i*3, i*3+2)) > 0) {
                s = s + "(double)";
            } else {
                s = s + " " + f.desc.substring(i*3, i*3+2);
            }
            console.log(s);
            this.parties.push(s);
        }

        // si on est à domicile ou à l'extérieur, renseigner le capitaine avec la licence du téléphone
        if((SessionAppli.tab == 0 && ((this.cote && SessionAppli.recoitCoteX) || (!this.cote && !SessionAppli.recoitCoteX)))
        || (SessionAppli.tab == 1 && ((this.cote && !SessionAppli.recoitCoteX) || (!this.cote && SessionAppli.recoitCoteX)))
          ) {
            this.actCapitaine = false;
            this.licenceCapitaine = Respeqtt.GetLicence();
            // recherche du nom dans l'équipe
            let i:number=0;
            let trouve:boolean = false;
            while (!trouve && i < this.equipe.length) {
                if(this.equipe[i].id == this.licenceCapitaine) {
                    trouve = true;
                    this.capitaine = this.equipe[i].nom + " " + this.equipe[i].prenom;
                    alert("Capitaine de " + this.clubChoisi.nom + " = " + this.capitaine);
                }
                i++;
            }
            if(!trouve) {
                this.capitaine = "(pas dans l'équipe)";
                alert("Licence du capitaine de " + this.clubChoisi.nom + " : " + this.licenceCapitaine.toString());
            }
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
                        alert("Licence " + this.licenceCapitaine + " inconnue pour le club " + this.clubChoisi.nom);
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
        }
    }


    
    ngAfterViewInit() {
        this.tf = this.tfLic.nativeElement;     // mémoriser le textField dans le composant (cf onCapitaine)
        if(this.licenceCapitaine > 0) {
            this.tf.text = this.licenceCapitaine.toString();
        }

    } 

    ngOnInit(args: EventData): void {
    }

    onUp(args:EventData) {
        let button = args.object as Button;

        // si le joueur sélectionné n'est pas en haut, on le monte, on met à jour sa place et on met à jour son rang dans joueurSel
        if(this.joueurSel > 0) {
            let swap = this.equipe[this.joueurSel - 1];
            let p0:string = this.equipe[this.joueurSel - 1].place;
            let p1: string = this.equipe[this.joueurSel].place;

            this.equipe[this.joueurSel - 1] = this.equipe[this.joueurSel];
            this.equipe[this.joueurSel - 1].place = this.listePlaces[this.joueurSel - 1];
            this.equipe[this.joueurSel] = swap;
            this.equipe[this.joueurSel].place = p1;
            this.equipe[this.joueurSel-1].place = p0;
            this.joueurSel--;
        }
    }

    onDown(args:EventData) {
        let button = args.object as Button;

        // si le joueur sélectionné n'est pas en bas, on le descend, on met à jour sa place et on met à jour son rang dans joueurSel
        if(this.joueurSel < SessionAppli.nbJoueurs - 1) {
            let swap = this.equipe[this.joueurSel + 1];
            let p1:string = this.equipe[this.joueurSel + 1].place;
            let p0: string = this.equipe[this.joueurSel].place;

            this.equipe[this.joueurSel + 1] = this.equipe[this.joueurSel];
            this.equipe[this.joueurSel + 1].place = this.listePlaces[this.joueurSel + 1];
            this.equipe[this.joueurSel] = swap;
            this.equipe[this.joueurSel].place = p0;
            this.equipe[this.joueurSel+1].place = p1;
            this.joueurSel++;
        }
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

    onValiderTap(args: EventData) {

        // vérifier que le capitaine a été saisi
        if(this.tf.text == "") {
            alert("Merci de saisir le numéro de licence du capitaine");
            return;
        } else {
            this.licenceCapitaine = Number(this.tf.text);

            // trier les joueurs dans l'ordre des places
            let equipeFinale:Array<EltListeLicencie> = [];
            for(let i = 0; i < SessionAppli.nbJoueurs; i++) {
                equipeFinale.push(this.equipe[i]);
                console.log("Joueur #" + i.toString() + " place " + this.equipe[i].place + " " + this.equipe[i].id);
            }
            // tracer le json
            console.log("Equipe= " + SessionAppli.EquipetoJSon(equipeFinale, this.clubChoisi.id, this.licenceCapitaine, SessionAppli.formule));

            if(this.cote) {
                SessionAppli.equipeX = equipeFinale;
            } else {
                SessionAppli.equipeA = equipeFinale;
            }
            // sauvegarder la compo de l'équipe en BDD
            Compo.PersisteEquipe(SessionAppli.rencontreChoisie, this.cote ? SessionAppli.equipeX : SessionAppli.equipeA, this.cote, 0);

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

    }

    onQRCodeTap(args: EventData) {
        const quoi:string= SessionAppli.EquipetoJSon(this.equipe, this.clubChoisi.id, this.licenceCapitaine, SessionAppli.formule);
        const titre:string=SessionAppli.titreRencontre + " équipe " + this.clubChoisi.nom;
        const dim:number = SessionAppli.dimEcran - 40;

         this.router.navigate(["attente/" + quoi + "/" + dim + "/" + titre + "/placer/" + (this.cote ? "X" : "A")]);
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
            this.tf.text = this.licenceCapitaine.toString();            // ecrire le n° de licence dans le text du textField
            console.log("Licence du capitaine:" + this.licenceCapitaine);
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

