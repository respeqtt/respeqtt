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
import { SessionAppli } from "../session/session";


var dialogs = require("@nativescript/core/ui/dialogs");

@Component({
    templateUrl: "./aide.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"]
 })
export class AideComponent {
    router: RouterExtensions;            // pour navigation
    version:string;
    contexte:string;

    constructor(private _route: ActivatedRoute, private _routerExtensions: RouterExtensions) {

        this.router = _routerExtensions;
        this.contexte = this._route.snapshot.paramMap.get("contexte");
        
        // version logicielle
        this.version = SessionAppli.version;

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
