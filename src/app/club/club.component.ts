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
import { Session } from "inspector";
import { Page } from "@nativescript/core/ui/page";
import {Router} from "@angular/router";

import { RespeqttDb } from "../db/dbRespeqtt";
import { EltListeClub, Club } from "../db/RespeqttDAO";
import { SessionAppli } from "../session/session";


@Component({
    templateUrl: "./club.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"]
})
export class ClubComponent{
    listeClubs:Array<EltListeClub>;

    constructor(private router: Router) {
        Club.getListe().then(liste => {
            this.listeClubs = liste  as Array<EltListeClub>;
        }, error =>{
            console.log("Impossible de lire la liste des clubs :" + error.toString());
        });
    }

    ngOnInit(): void {
    }


    onListViewLoaded(args: EventData) {
        const maListe = <ListView>args.object;
    }

    onItemTap(args: ItemEventData) {
        const index = args.index;

        // mémoriser le club sélectionné pour usage ultérieur
        SessionAppli.clubChoisi = this.listeClubs[index].numero;

        console.log("Club choisi : " + SessionAppli.clubChoisi);

        // aller sur la page de chargement des joueurs
        const button: Button = <Button>args.object;
        const page: Page = button.page;
        this.router.navigate(["joueurs"]);
    }

}
