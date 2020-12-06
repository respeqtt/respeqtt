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
import { Label, Button, EventData, TextField, Image, StackLayout } from "@nativescript/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";
// import { NativeScriptFormsModule } from "@nativescript/angular/forms";

import { QrCode, QrSegment, Ecc } from "./qrcodegen"

import { registerElement } from '@nativescript/angular';
import { Paint, CanvasView, Canvas, createRect } from '@nativescript-community/ui-canvas';
import { Color } from '@nativescript/core/color';


@Component({
    templateUrl: "./qrmontrer.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"]
 })
export class QRMontrerComponent implements OnInit{
    intro:string;
    contenu:string;
    qr2:QrCode;
    dimEcran: number;
    aDessiner:boolean;
    trace:string;
    router:RouterExtensions;



    constructor(private _route: ActivatedRoute, private _routerExtensions: RouterExtensions) {
        this.dimEcran = 300;
        this.aDessiner= true;
        this.trace = "";

        registerElement('CanvasView', () => CanvasView);

        this.router = _routerExtensions;
    }

    ngOnInit(): void {


        this.contenu = this._route.snapshot.paramMap.get("quoi");
        this.intro = this._route.snapshot.paramMap.get("titre");
        const estPasNum: boolean= isNaN(Number(this._route.snapshot.paramMap.get("dim")));
//        alert("contenu=" + this.contenu + ", intro=" + this.intro + ", dim=" + this._route.snapshot.paramMap.get("dim"));
        if(estPasNum)
            this.dimEcran = 150;
        else
            this.dimEcran = Number(this._route.snapshot.paramMap.get("dim"));
    }


        draw(event: { canvas: Canvas }) {
            const border: number = 40;
            const canvas = event.canvas;
            const paint = new Paint();
            const noir = new Color("#000000");
            const blanc = new Color("#FFFFFF");
            var dim  = canvas.getWidth() < canvas.getHeight() ? canvas.getWidth() : canvas.getHeight();


            if(this.aDessiner) {
//              alert("Encodage de " + this.contenu);
                this.qr2 = QrCode.encodeText(this.contenu, Ecc.HIGH);
                // afficher le contenu sous le code
                this.trace = this.contenu;

                // largeur du pinceau
                paint.strokeWidth = border;
                // calcul de l'échelle pour remplir la zone (80% de la largeur de l'écran)
                var scale: number = (dim - 2 * border) / this.qr2.size ;
//                alert("Dessin du canvas :" + canvas.getWidth() + "x" + canvas.getHeight() + " ; échelle = " + scale );

                for (let y = -border; y < this.qr2.size + border; y++) {
                    for (let x = -border; x < this.qr2.size + border; x++) {
                        const pix:boolean = this.qr2.getModule(x, y);
                        // choisir la couleur à partir de la valeur du pixel (1 = noir)
                        paint.setColor(pix ? noir : blanc);
                        // dessiner le pixel
                        canvas.drawRect(createRect(border + x * scale, border + y * scale, scale, scale), paint);
                    }
                }
                this.aDessiner= false;
            }
            else
                this.aDessiner= true;

        }

        // retourne à la page d'appel
        goBack() {
            this.router.back();
        }

        onTap(args: EventData) {
            let button = args.object as Button;
            // execute your custom logic here...
            // >> (hide)
            alert("Contenu = " + this.contenu);
            // << (hide)
        }

}




