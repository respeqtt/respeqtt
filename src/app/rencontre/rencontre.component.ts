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
import { Button, EventData, ListView, ItemEventData } from "@nativescript/core";

import { EltListeRencontre, Rencontre } from "../db/RespeqttDAO";
import { SessionAppli } from "../session/session";
import {RespeqttDb} from "../db/dbRespeqtt";
import { RouterExtensions } from "@nativescript/angular";
import { ActivatedRoute } from "@angular/router";

@Component({
    templateUrl: "./rencontre.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"]
})
export class RencontreComponent{
    listeRencontres:Array<EltListeRencontre>;
    maListe:ListView;
    version:string;
    router:RouterExtensions;
    rencontreSel:boolean=false;

    constructor(private _route: ActivatedRoute, private _routerExtensions: RouterExtensions) {
        // version logicielle
        this.version = SessionAppli.version;

        this.router = _routerExtensions;
        Rencontre.getListe().then(liste => {
            this.listeRencontres = liste as Array<EltListeRencontre>;
            SessionAppli.listeRencontres = this.listeRencontres;
            console.log("Nb de rencontres :" + SessionAppli.listeRencontres.length);
        }, error => {
            console.log("Impossible de lire la liste des rencontres : " + error.toString());
        });
    }

    ngOnInit(): void {
    }

    onSupprimer(args: EventData) {
        let button = args.object as Button;
        let sql = "delete from Rencontre where ren_kn in (";
        let del = "";

        // construit la requête SQL des éléments à supprimer
        for(let i=0; i < this.listeRencontres.length; i++) {
            if(this.listeRencontres[i].sel) {
                if(del != "") {
                    del = del + ", "
                }
                else {
                    del = sql;
                }
                del = del + this.listeRencontres[i].id.toString();
            }
        }
        // finaliser la requête
        if(del != "")  {
            del = del + ")";
            // trace la requête avant exécution
            console.log(del);

            RespeqttDb.db.execSQL(del).then(id=>{
                console.log("Rencontres supprimées");
                // relire la table
                Rencontre.getListe().then(liste => {
                    this.listeRencontres = liste as Array<EltListeRencontre>;
                }, error => {
                    console.log("Impossible de lire la liste des rencontres : " + error.toString());
                });
            }, error => {
                console.log("Impossible de supprimer les rencontres : " + error.toString());
            });

        }
        else {
            alert("Aucun élément n'est sélectionné.")
        }
    }

    onCharger(args: EventData) {
        let button = args.object as Button;
        // charger la BDD avec la simulation
        Rencontre.SIM_LoadListe();
        // charger la liste en mémoire avec la BDD
        Rencontre.getListe().then(liste => {
            this.listeRencontres = liste as Array<EltListeRencontre>;
            // si la liste n'est pas vide, on initialise le tableau associé
            if(this.listeRencontres != null) {
                console.log(this.listeRencontres.length.toString() + " rencontres dans la liste");
            }
            else
                console.log("Liste de rencontres vide");
            // il faudrait appeler SPID à la place
            console.log("Appel à SPID... ");
            // rafraichir l'affichage
            this.maListe.refresh();
        }, error =>{
            console.log("Impossible de lire la liste des rencontres : " + error.toString());
        });
    }

    onAjouterTap(args: EventData) {
        let button = args.object as Button;
        this.router.navigate(["ajouterRencontre"],
        {
            animated:true,
            transition: {
                name : SessionAppli.animationAller, 
                duration : 380,
                curve : "easeIn"
            }
        });
    }
    onListViewLoaded(args: EventData) {
        this.maListe = <ListView>args.object;
    }

    onItemTap(args: ItemEventData) {
        const index = args.index;

        // chercher si l'item est sélectionné
        console.log("listeRencontres:" + this.listeRencontres[index].id.toString());
        this.listeRencontres[index].sel = !this.listeRencontres[index].sel;
        console.log("Rencontre sélectionnée : " + index);
        if(this.listeRencontres[index].sel)  {
            this.rencontreSel = true;
        } else {
            this.rencontreSel = false;
        }

    }

    onFermerTap(args: ItemEventData) {
        SessionAppli.listeRencontres = this.listeRencontres;
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
