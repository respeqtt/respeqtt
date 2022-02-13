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
import { Button, EventData } from "@nativescript/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";

import { QrCode, Ecc } from "../qrmontrer/qrcodegen"

import { registerElement } from '@nativescript/angular';
import { Paint, CanvasView, Canvas, createRect } from '@nativescript-community/ui-canvas';
import { Color } from '@nativescript/core/color';
import { URLtoString } from "../outils/outils";
import { SessionAppli } from '../session/session';

@Component({
    templateUrl: "./download.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"]
 })
export class DownloadComponent implements OnInit{
    titre:string;
    contenu:string;
    qr2:QrCode;
    dimEcran: number;
    aDessiner:boolean;
    router:RouterExtensions;
    url:string;
    version:string;


    constructor(private _route: ActivatedRoute, private _routerExtensions: RouterExtensions) {
        this.dimEcran = 300;
        this.aDessiner= true;

        // version logicielle
        this.version = SessionAppli.version;

        registerElement('CanvasView', () => CanvasView);

        this.router = _routerExtensions;

        // URL à encoder
        this.url = "https://www.valencinpierre.fr/wp-content/uploads/2021/07/respeqtt.apk"
    }

    ngOnInit(): void {
        const estPasNum: boolean= isNaN(Number(this._route.snapshot.paramMap.get("dim")));

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
                this.qr2 = QrCode.encodeText(this.url, Ecc.HIGH);

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

    onInstructions(args: EventData) {
        alert(`1) Enregistrer le Fichier .apk sur le téléphone.\n
              2) Aller dans le menu Paramètres du téléphone,\n
              3) Aller dans Sécurité\n
                 Autoriser l'installation d'application de source inconnue\n
              3bis) Aller dans Applications et notifications\n
                    Cliquer sur Avancé\n
                    Cliquer sur Accès spécial\n
                    Installer des applications inconnues\n
              4) Trouver respeqtt.apk avec le gestionnaire de fichiers (stockage interne)\n
              5) Cliquer dessus et confirmer l'installation`
        );
    }  
    
    // Fermer
    onFermer(args:Event){
        this.router.navigate(["/actions"],
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




