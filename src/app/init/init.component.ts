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
import { Button, EventData, TextField } from "@nativescript/core";

import { Signature } from "../db/RespeqttDAO";
import { SessionAppli } from "../session/session";
import { RouterExtensions } from "@nativescript/angular";
import { ActivatedRoute } from "@angular/router";
import { Respeqtt } from "../db/RespeqttDAO";
import { ElementRef, ViewChild } from "@angular/core";
import { RespeqttDb } from "../db/dbRespeqtt";

@Component({
    templateUrl: "./init.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"]
})
export class InitComponent{
    licence:number;
    router: RouterExtensions;
    version:string;
    tfnum:TextField=null;              // pour récupérer le textfield du numéro de licence
    sigOK:boolean=false;

    @ViewChild('tfNumLic') tfNumLic: ElementRef;  // pour récupérer le textfield dont l'id est #tfNumLic


    constructor(private _route: ActivatedRoute, private _routerExtensions: RouterExtensions) {
        // récupération du routeur pour naviguer
        this.router = _routerExtensions;
        this.version = SessionAppli.version;

        // init
        RespeqttDb.Init().then(ok => {
            Respeqtt.ChargeSignature().then(res => {
                if(res) {
                    let sig = res as Signature;
                    let lic = sig.GetLicence();
                    console.log("licence=" + lic.toString());     
                    if(lic > 0) {
                        this.sigOK = true;
                        console.log("signature chargée pour " + sig.GetLicence().toString());
                    } else {
                        // pas trouvé de licence : il faut le saisir sur la page
                        return;
                    }
                }  else {
                    // saisir le numéro de licence : on reste sur la page
                    return;
                }   
            }, error => {
                alert("Impossible de lire la base de données : " + error);
            });
        }, error => {
            console.log("BD ***PAS*** initialisée");
            console.log(error);
        });            
    }

    ngAfterViewInit() {
        this.tfnum = this.tfNumLic.nativeElement;     // mémoriser le textField dans le composant
        console.log("ngAfterViewInit: sigOK=" + this.sigOK.toString());      
        if(this.sigOK) {
            this.router.navigate(["/actions"]);          
        }
    }     

    ngOnInit(): void {



console.log("ngOnInit: sigOK=" + this.sigOK.toString());      
        if(this.sigOK) {
            this.router.navigate(["/actions"]);          
        }

    }


    onValider(args: EventData) {
        let button = args.object as Button;
        this.licence = Number(this.tfnum.text);
        if(this.licence > 10) {
            // sauvegarder la signature en BDD
            Respeqtt.MemoriseSignature(this.licence);
            // passer à la page d'actions
            this.router.navigate(["/actions"]);
        } else {
            alert("Merci de saisir votre numéro de licence");
        }
    }
}