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
import { Button, EventData } from "@nativescript/core";
import { SessionAppli } from "../session/session";
import { ElementRef, ViewChild } from "@angular/core";
import { TextField } from "@nativescript/core";
import { TextView } from "@nativescript/core";

var dialogs = require("@nativescript/core/ui/dialogs");

@Component({
    templateUrl: "./jugearbitre.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"]
 })
export class JugeArbitreComponent {
    router: RouterExtensions;            // pour navigation
    nomJA:string="";
    prenomJA:string="";
    adresseJA:string="";
    licenceJA:number;
    valider:boolean=false;
    version:string;

    tfnom:TextField=null;
    tfprenom:TextField=null;
    tvadresse:TextView=null;
    tflic:TextField=null;

    @ViewChild('tfnom') ERnom: ElementRef;  // pour récupérer le textfield dont l'id est #s1
    @ViewChild('tfprenom') ERprenom: ElementRef;  // pour récupérer le textfield dont l'id est #s2
    @ViewChild('tvadresse') ERadresse: ElementRef;  // pour récupérer le textfield dont l'id est #s3
    @ViewChild('tflic') ERlic: ElementRef;  // pour récupérer le textfield dont l'id est #s4


    constructor(private _route: ActivatedRoute, private _routerExtensions: RouterExtensions) {

        // version logicielle
        this.version = SessionAppli.version;

        this.router = _routerExtensions;

        this.nomJA = SessionAppli.nomJA;
        this.prenomJA = SessionAppli.prenomJA;
        this.adresseJA = SessionAppli.adresseJA;
        this.licenceJA = SessionAppli.licenceJA;

        if(this.licenceJA> 0) {
            this.valider=true;
        }
    }

    ngAfterViewInit() {
        this.tfnom = this.ERnom.nativeElement;     // mémoriser le textView dans le composant
        this.tfprenom = this.ERprenom.nativeElement;     // mémoriser le textView dans le composant
        this.tvadresse = this.ERadresse.nativeElement;     // mémoriser le textView dans le composant
        this.tflic = this.ERlic.nativeElement;     // mémoriser le textView dans le composant

        this.tfnom.text = SessionAppli.nomJA;
        this.tfprenom.text = SessionAppli.prenomJA;
        this.tvadresse.text = SessionAppli.adresseJA;
        this.tflic.text = SessionAppli.licenceJA.toString();
        console.log("JA " + SessionAppli.nomJA + " " + SessionAppli.prenomJA + " " + SessionAppli.licenceJA.toString() + " " + SessionAppli.adresseJA)

    } 

    onFocus(args: EventData) {
        console.log("Licence JA = " + this.licenceJA);
        this.valider = true;
      };

    onTapRapport(args: EventData) {
        let button = args.object as Button;

        this.nomJA = this.tfnom.text;
        this.prenomJA = this.tfprenom.text;
        this.adresseJA = this.tvadresse.text;
        this.licenceJA = Number(this.tflic.text);

        // mémoriser les coordonnées du JA pour les retrouver en sortant du rapport
        SessionAppli.nomJA = this.nomJA;
        SessionAppli.prenomJA = this.prenomJA;
        SessionAppli.adresseJA = this.adresseJA;
        SessionAppli.licenceJA = this.licenceJA;

        // Ouvrir la page de saisie de saisie du rapport du JA
        this.router.navigate(["saisiecommentaire/RAPPORT/" + this.nomJA + " " + this.prenomJA + "/jugearbitre"],
        {
            animated:true,
            transition: {
                name : SessionAppli.animationAller, 
                duration : 380,
                curve : "easeIn"
            }
        });
    }

    onTapValider(args: EventData) {
        let button = args.object as Button;0

        this.nomJA = this.tfnom.text;
        this.prenomJA = this.tfprenom.text;
        this.adresseJA = this.tvadresse.text;
        this.licenceJA = Number(this.tflic.text);


        // mémoriser les coordonnées du JA
        SessionAppli.nomJA = this.nomJA;
        SessionAppli.prenomJA = this.prenomJA;
        SessionAppli.adresseJA = this.adresseJA;
        SessionAppli.licenceJA = this.licenceJA;

        console.log("JA " + SessionAppli.nomJA + " " + SessionAppli.prenomJA + " " + SessionAppli.licenceJA.toString() + " " + SessionAppli.adresseJA)

        this.router.navigate(["valider"],
        {
            animated:true,
            transition: {
                name : SessionAppli.animationAller, 
                duration : 380,
                curve : "easeIn"
            }
        });
    }

    onTapFermer(args: EventData) {
        let button = args.object as Button;

        // si pas de JA, pas de rapport
        if(SessionAppli.licenceJA == 0) {
            // demande de confirmation
            dialogs.prompt({title:"Confirmation",
            message:"Etes vous sûr de ne pas valider le JA et son rapport ?",
            okButtonText:"PAS DE JA",
            cancelButtonText:"ANNULER"
            }).then(r => {
                if(r.result) {
                    SessionAppli.nomJA = "";
                    SessionAppli.prenomJA = "";
                    SessionAppli.adresseJA = "";
                    SessionAppli.licenceJA = 0;
                    SessionAppli.rapportJA = "";
                    this.router.navigate(["valider"],
                    {
                        animated:true,
                        transition: {
                            name : SessionAppli.animationAller, 
                            duration : 380,
                            curve : "easeIn"
                        }
                    });
                } else {
                return;
                }
        });
        } else {
            this.router.navigate(["valider"],
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

}
