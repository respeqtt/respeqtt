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
import { EventData } from "@nativescript/core";
import { SessionAppli } from "../session/session";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";
import { Respeqtt } from "../db/RespeqttDAO";
import { toURL, toURLQuote } from "../outils/outils";

@Component({
    templateUrl: "./signer.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"]
})
export class SignerComponent{
    router: RouterExtensions;            // pour navigation
    version:string;
    titre:string = "Signer la feuille de match";
    sousTitre:string;


    constructor(private _route: ActivatedRoute, private routerExtensions: RouterExtensions) {
        this.router = routerExtensions;
        // version logicielle
        this.version = SessionAppli.version;
        this.sousTitre = SessionAppli.titreRencontre;

        // si à domicile alors appeler le scan de la signature
        console.log("Domicile de la signature=" + SessionAppli.domicile);
        switch(SessionAppli.domicile) {
            case 1:
                let capitaine:string;
                capitaine = SessionAppli.recoitCoteX ? 
                            SessionAppli.capitaineA.nom + " " + SessionAppli.capitaineA.prenom  : 
                            SessionAppli.capitaineX.nom + " " + SessionAppli.capitaineX.prenom;
                console.log("capitaine=" + toURL(capitaine));
                this.router.navigate(["qrscan/SIGNATURE/" + toURL(capitaine)],
                {
                    animated:true,
                    transition: {
                        name : SessionAppli.animationAller, 
                        duration : 380,
                        curve : "easeIn"
                    }
                });
            break;    
            case 0 : 
            // sinon montrer le QRCode de la signature
            let json:string;
            let dim:string=SessionAppli.dimEcran.toString();
            let titre:string=toURL("Signature de " 
                            + (SessionAppli.recoitCoteX ? 
                               SessionAppli.capitaineA.nom + " " + SessionAppli.capitaineA.prenom
                               :  SessionAppli.capitaineX.nom + " " + SessionAppli.capitaineX.prenom));

            json = '{"licence":"' + Respeqtt.GetLicence().toString() + '", "signature":"' + Respeqtt.GetSignature() + '"}';


            this.router.navigate(["attente/" + json + "/" + dim + "/" + titre + "/actions/0"],
            {
                animated:true,
                transition: {
                    name : SessionAppli.animationAller, 
                    duration : 380,
                    curve : "easeIn"
                }
            });
            break;    
        }

    }

    onFermer(args: EventData) {
        // retour sur la page précédente
        this.router.navigate(["actions"],
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
