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
import { ModalDialogParams } from "@nativescript/angular";

@Component({
    selector: "my-message",
    templateUrl: "message.component.html",
    styleUrls: ["../global.css"]
})
export class MessageComponent {
    texte:string="(pas initialisé)";
    titre:string = "(pas de titre)";

    public frameworks: Array<string>;


    public constructor(private params: ModalDialogParams) {

        this.texte = params.context.texte;
        this.titre = params.context.titre;
    }

    public close(res: string) {
        this.params.closeCallback(res);
    }

}