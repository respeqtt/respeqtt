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
import { EventData } from "@nativescript/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";

import { Page } from "@nativescript/core/ui/page";
import { View } from "@nativescript/core/ui/core/view";

import { SessionAppli } from "../session/session";

let view: View;

@Component({
    templateUrl: "./attente.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"]
 })
export class AttenteComponent {
    destination:string;
    router:RouterExtensions;    // pour navigation

    constructor(private _route: ActivatedRoute, private _routerExtensions: RouterExtensions) {
        // récupération du routeur pour naviguer
        this.router = _routerExtensions;
        console.log("Attente/quoi=" + this._route.snapshot.paramMap.get("quoi"));
        // page suivante
        this.destination = this._route.snapshot.paramMap.get("quoi") + "/"
                         + this._route.snapshot.paramMap.get("dim") + "/"
                         + this._route.snapshot.paramMap.get("titre") + "/"
                         + this._route.snapshot.paramMap.get("retour") + "/"
                         + this._route.snapshot.paramMap.get("param");
    }

    onPageLoaded(args: EventData) {
        console.log("$$$$$$$$$$$ Page Loaded $$$$$$$$$$$$$$");
        const page = args.object as Page;
        console.log("Page reference from loaded event: ", page);
        view = page.getViewById("wait");
/*
        view.animate({
            rotate: 360,
            duration: 10000
        });
*/
        // aller sur la page suivante
        console.log("Destination=" + this.destination);
        this.router.navigate(["qrmontrer/" + this.destination],
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
