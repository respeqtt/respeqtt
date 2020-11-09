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

import { Component, ElementRef, OnInit, ViewChild, ChangeDetectionStrategy } from "@angular/core";
import { Page, GridLayout, Label, Button, EventData, ListView, ItemEventData } from "@nativescript/core";
import { RespeqttDb } from "../db/dbRespeqtt";
import { EltListeRencontre, Rencontre } from "../db/RespeqttDAO";

import { Mobile } from "../mobile/mobile";



@Component({
    templateUrl: "./rencontre.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RencontreComponent{
    recoitA:boolean
    listeRencontres:Array<EltListeRencontre>;
    trace:string;
    mobile:Mobile;
    demiLargeur:number;


    @ViewChild('CBRecoitA') CBRecoitA:ElementRef;

    constructor() {
        this.recoitA=false
        this.listeRencontres = Rencontre.liste;
        this.trace = "";

        this.mobile = new Mobile;
        // calcul de la demi largeur pour les boutons
        this.demiLargeur = Math.floor(this.mobile.largeurEcran /2) - 5;
        console.log("Demi-largeur = " + this.demiLargeur);
    }

    // Charge la liste des rencontres pour affichage
    ngOnInit(): void {

        this.trace = this.listeRencontres[1].division + " " + this.listeRencontres[1].journee + " " + this.listeRencontres[1].date;
        for(var e in this.listeRencontres) {
            console.log("élt[" + e + "] = "
                    + this.listeRencontres[e].id + " "
                    + this.listeRencontres[e].division + " "
                    + this.listeRencontres[e].journee + " "
                    + this.listeRencontres[e].date);
        }
    }


    onListViewLoaded(args: EventData) {
        const listView = <ListView>args.object;
    }

    onItemTap(args: ItemEventData) {
        const index = args.index;
        console.log("Rencontre choisie : " + index);
    }

    onTap(args: EventData) {
        let button = args.object as Button;
        // execute your custom logic here...
        // >> (hide)
        alert("Tapped ");
        // << (hide)
    }

    onValiderFeuille(args: EventData) {
        let button = args.object as Button;

        if (RespeqttDb.db) {
            // SIMULATION : chargement des données
            RespeqttDb.db.get("select count(*) from Rencontre").then(res => {
                // si la table est vide, on l'initialise
                alert("Nb rencontres =" + res);
                if(res == 0) {
                    Rencontre.SIM_LoadListe();
                }
            }, error => {
                alert("Impossible de compter la table Rencontre:" + error.toString());
            });
            // fin SIMULATION
        }
    }

    public toggleCheck() {
        if (this.recoitA) {
            this.recoitA = false;
        } else {
            this.recoitA = true;
        }
        this.CBRecoitA.nativeElement.toggle();
    }
    public getCheckProp() {
        console.log(
          'checked prop value = ' + this.CBRecoitA.nativeElement.checked
        );
      }

    public onCheckBoxTap() {
        if(this.recoitA) {
            this.recoitA = false
        } else {
            this.recoitA = true
        }
        alert("Checked : " + this.recoitA);

    }



}



