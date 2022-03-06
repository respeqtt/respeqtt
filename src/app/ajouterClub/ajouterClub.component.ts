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
import { Button, EventData, TextField } from "@nativescript/core";
import { Club, EltListeClub } from "../db/RespeqttDAO";
import { SessionAppli } from "../session/session";
import { ElementRef, ViewChild } from "@angular/core";


var dialogs = require("@nativescript/core/ui/dialogs");

@Component({
    templateUrl: "./ajouterClub.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"]
 })
export class AjouterClubComponent {
    router: RouterExtensions;            // pour navigation
    nomClub:string="";
    numeroClub:number;
    version:string;
    
    listeClubs:Array<EltListeClub>;
    tfnom:TextField=null;              // pour récupérer le textfield du nom du club
    tfnum:TextField=null;              // pour récupérer le textfield du nom du club

    @ViewChild('tfNom') tfNom: ElementRef;  // pour récupérer le textfield dont l'id est #tfLic
    @ViewChild('tfNumClub') tfNumClub: ElementRef;  // pour récupérer le textfield dont l'id est #tfLic

    constructor(private _route: ActivatedRoute, private _routerExtensions: RouterExtensions) {

        this.router = _routerExtensions;

        // version logicielle
        this.version = SessionAppli.version;

    }

    ngAfterViewInit() {
        this.tfnom = this.tfNom.nativeElement;         // mémoriser le textField dans le composant 
        this.tfnum = this.tfNumClub.nativeElement;     // mémoriser le textField dans le composant
    }     

    onAjouter(args: EventData) {

        this.nomClub = this.tfnom.text;
        this.numeroClub = Number(this.tfnum.text);

        // rechercher le club dans la BDD
        Club.getListe().then(liste => {
                this.listeClubs = liste  as Array<EltListeClub>;

                if(this.numeroClub > 0 && this.nomClub != "") {
                    // recherche du numéro de club en BDD
                    let trouve = false;
                    console.log(this.listeClubs.length + " clubs dans la liste");
                    for(let i= 0; (i < this.listeClubs.length) && !trouve; i++) {
                        if(this.listeClubs[i].numero == this.numeroClub) {
                            trouve = true;
                            console.log("Trouvé club " + this.numeroClub);
                        }
                    }
                    // si pas trouvé on l'ajoute
                    if(!trouve) {
                        Club.ajouteClub(this.numeroClub, this.nomClub);
                        alert("Club " + this.numeroClub.toString() + "(" + this.nomClub + ") ajouté.");
                        this.router.navigate(["actions"],
                        {
                            animated:true,
                            transition: {
                                name : SessionAppli.animationRetour, 
                                duration : 380,
                                curve : "easeIn"
                            }
                        });
                    } else {
                        // sinon on le refuse
                        dialogs.alert("Le club " + this.numeroClub + " existe déjà dans la liste");
                        this.router.navigate(["actions"],
                        {
                            animated:true,
                            transition: {
                                name : SessionAppli.animationRetour, 
                                duration : 380,
                                curve : "easeIn"
                            }
                        });
                        SessionAppli.tab = 0;
                                    }
                } else {
                    dialogs.alert("Renseigner le nom et le numéro du club");
                    return;
                }
            }, error =>{
            console.log("Impossible de lire la liste des clubs :" + error.toString());
        });

    }

    onSupprimer(args: EventData) {
        this.nomClub = this.tfnom.text;
        this.numeroClub = Number(this.tfnum.text);

        // rechercher le club dans la BDD
        Club.getListe().then(liste => {
                this.listeClubs = liste  as Array<EltListeClub>;

                if(this.numeroClub > 0) {
                    // recherche du numéro de club en BDD
                    let trouve = false;
                    console.log(this.listeClubs.length + " clubs dans la liste");
                    for(let i= 0; (i < this.listeClubs.length) && !trouve; i++) {
                        if(this.listeClubs[i].numero == this.numeroClub) {
                            trouve = true;
                            // demande de confirmation
                            dialogs.prompt({title:"Confirmation",
                            message:"Etes vous sûr de vouloir supprimer le club numéro " + this.numeroClub + " ?",
                            okButtonText:"SUPPRIMER",
                            cancelButtonText:"ANNULER"
                            }).then(r => {
                                if(r.result) {
                                    Club.supprimeClub(this.numeroClub);
                                    // retour à la page actions
                                    this.router.navigate(["actions"],
                                    {
                                        animated:true,
                                        transition: {
                                            name : SessionAppli.animationRetour, 
                                            duration : 380,
                                            curve : "easeIn"
                                        }
                                    });
                                    SessionAppli.tab = 0;            
                                } else {
                                return;
                                }
                            });

                        }
                    }
                    if(!trouve) {
                        dialogs.alert("Le club " + this.numeroClub + " n'a pas été trouvé dans la liste");
                        return;
                    }
                } else {
                    dialogs.alert("Renseigner le numéro du club");
                    return;
                }
        }, error =>{
            console.log("Impossible de lire la liste des clubs :" + error.toString());
        });

    }

    onFermer(args: EventData) {
        let button = args.object as Button;

        this.router.navigate(["actions"],
        {
            animated:true,
            transition: {
                name : SessionAppli.animationRetour, 
                duration : 380,
                curve : "easeIn"
            }
        });
        SessionAppli.tab = 0;
    }

}
