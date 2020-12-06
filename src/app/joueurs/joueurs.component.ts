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
import { GridLayout, Label, Button, EventData, ListView, ItemEventData } from "@nativescript/core";

import { RespeqttDb } from "../db/dbRespeqtt";
import { EltListeLicencie, Licencie, Club } from "../db/RespeqttDAO";
import { SessionAppli } from "../session/session";


@Component({
    templateUrl: "./joueurs.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"]
})
export class JoueursComponent{
    listeJoueurs:Array<EltListeLicencie>;
    maListe:ListView;
    descClub:string = "";

    constructor() {

        Licencie.getListe(SessionAppli.clubChoisi).then(liste => {
            this.listeJoueurs = liste  as Array<EltListeLicencie>;
            if(this.listeJoueurs != null) {
                console.log(this.listeJoueurs.length.toString() + " joueurs");
            }
        }, error => {

        });
        Club.getDescriptionClub(SessionAppli.clubChoisi).then(desc => {
            this.descClub = desc as string;
            console.log("Club=" + this.descClub);
        }, error => {
            console.log("Impossible de lire le nom du Club : " + error.toString())
        });
    }

    ngOnInit(): void {
    }

     onDelTap(args: EventData) {
        let button = args.object as Button;
        let sql = "delete from Licencie where id in (";
        let del = "";

        // construit la requête SQL des éléments à supprimer
        for(let i=0; i < this.listeJoueurs.length; i++) {
            if(this.listeJoueurs[i].sel) {
                if(del != "") {
                    del = del + ", "
                }
                else {
                    del = sql;
                }
                del = del + this.listeJoueurs[i].id.toString();
            }
        }
        // finaliser la requête
        if(del != "")  {
            del = del + ")";
            // trace la requête avant exécution
            console.log(del);
/*
            RespeqttDb.db.execSQL(del).then(id=>{
                console.log("Joueurs supprimés");
            }, error => {
                console.log("Impossible de supprimer les joueurs : " + error.toString());
            });
*/
            // relire la liste des joueurs
            Licencie.getListe(SessionAppli.clubChoisi).then(liste => {
                this.listeJoueurs = liste  as Array<EltListeLicencie>;
                if(this.listeJoueurs != null) {
                    console.log(this.listeJoueurs.length.toString() + " joueurs");
                }
            }, error => {

            });

        }
        else {
            alert("Aucun élément n'est sélectionné.")
        }
    }

    onLoadTap(args: EventData) {
        let button = args.object as Button;
        alert("Appel à SPID... ");
        Licencie.SIM_LoadListe();
        Licencie.getListe(SessionAppli.clubChoisi).then(liste =>{
            this.listeJoueurs = liste as Array<EltListeLicencie>;
            if(this.listeJoueurs != null) {
                console.log(this.listeJoueurs.length.toString() + " joueurs");
            }
            this.maListe.refresh();
        }, error => {

        });

    }

    onListViewLoaded(args: EventData) {
        this.maListe = <ListView>args.object;
        Club.getDescriptionClub(SessionAppli.clubChoisi).then(desc => {
            this.descClub = desc as string;
            console.log("Club=" + this.descClub);
        }, error => {
            console.log("Impossible de lire le nom du Club : " + error.toString())
        });
        console.log("Club=" + this.descClub);

    }

    onItemTap(args: ItemEventData) {
        const index = args.index;

        // sélectionner le joueur
        this.listeJoueurs[index].sel = !this.listeJoueurs[index].sel;
        console.log("Joueur choisi : " + this.listeJoueurs[index].id);

    }

}
