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

import { erreur } from "../outils/outils";
import { ViewContainerRef } from "@angular/core";
import { ModalDialogService } from "@nativescript/angular";

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
    quoi:string;

    message:string="";
    actValider:boolean=false;
    actSigner:boolean=false;


    constructor(private _route: ActivatedRoute, private routerExtensions: RouterExtensions, private modal: ModalDialogService, private vcRef: ViewContainerRef) {
        this.router = routerExtensions;
        // version logicielle
        this.version = SessionAppli.version;
        this.sousTitre = SessionAppli.titreRencontre;

        // récupérer ce qu'il faut faire
        this.quoi = this._route.snapshot.paramMap.get("quoi");

        if(SessionAppli.capitaineA) {
            console.log ("Cap A=" + SessionAppli.capitaineA.nom + " lic=" + SessionAppli.capitaineA.id.toString());
        } else {
            console.log ("Cap A= null");
        }
        if(SessionAppli.capitaineX) {
            console.log ("Cap X=" + SessionAppli.capitaineX.nom + " lic=" + SessionAppli.capitaineX.id.toString());
        } else {
            console.log ("Cap X= null");
        }        

        switch(this.quoi) {
            case "FAIRE_SIGNER" :         // appeler le scan de la signature
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
            case "MONTRER" :            // montrer le QRCode de la signature
                let cap:number;
                // vérifier qu'on est bien le capitaine qui se déplace
                if(SessionAppli.recoitCoteX) {
                    // capitaine A
                    if(SessionAppli.capitaineA) {
                        cap =  SessionAppli.capitaineA.id;
                    } else {
                        erreur(this.vcRef, "Le capitaine de l'équipe A n'a pas été renseigné (Menu 'Composer son équipe')");
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
                } else {
                    // capitaine X
                    if(SessionAppli.capitaineX) {
                        cap =  SessionAppli.capitaineX.id;
                    } else {
                        erreur(this.vcRef, "Le capitaine de l'équipe X n'a pas été renseigné (Menu 'Composer son équipe')");
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
                if(cap != Respeqtt.GetLicence()) {
                    erreur(this.vcRef, "La licence du téléphone (" + Respeqtt.GetLicence().toString() + ") ne correspond pas à celle du capitaine : " + cap);
                    this.router.navigate(["actions"],
                    {
                        animated:true,
                        transition: {
                            name : SessionAppli.animationRetour, 
                            duration : 380,
                            curve : "easeIn"
                        }
                    });
                } else {
                    let json:string;
                    let dim:string=SessionAppli.dimEcran.toString();
                    let titre:string=toURL("Signature de " 
                                    + (SessionAppli.recoitCoteX ? 
                                    SessionAppli.capitaineA.nom + " " + SessionAppli.capitaineA.prenom
                                    :  SessionAppli.capitaineX.nom + " " + SessionAppli.capitaineX.prenom));
    
                    json = '{"licence":"' + Respeqtt.GetLicence().toString() + '", "signature":"' + Respeqtt.GetSignature() + '"}';
    
    
                    this.router.navigate(["attente/" + json + "/" + dim + "/" + titre + "/actions/aucun"],
                    {
                        animated:true,
                        transition: {
                            name : SessionAppli.animationAller, 
                            duration : 380,
                            curve : "easeIn"
                        }
                    });
                }
            break;
            default :           // vérifier la signature passée en paramètre
                // vérifier le numéro de licence
                let lic:number = Number(this.quoi);
                console.log("Licence signature=" + this.quoi);
                if((lic == SessionAppli.capitaineA.id && SessionAppli.recoitCoteX)
                || (lic == SessionAppli.capitaineX.id && !SessionAppli.recoitCoteX)
                ) {
                    SessionAppli.scoreValide = true;
                    console.log("*** SCORE VALIDE ***");
                    // mémoriser les signatures
                    SessionAppli.Persiste().then(cr => {
                        // retour à la page des actions
                        this.router.navigate(["actions"],
                        {
                            animated:true,
                            transition: {
                                name : SessionAppli.animationRetour, 
                                duration : 380,
                                curve : "easeIn"
                            }
                        });
                    }, error => {
                        console.log("Impossible de persister la session : " + error);
                    });

                } else {
                    console.log("--- SIGNATURE INVALIDE ---");
                    // Rejeter la signature
                    if(SessionAppli.recoitCoteX) {
                        SessionAppli.signatureA = "PAS SIGNE";
                    } else {
                        SessionAppli.signatureX = "PAS SIGNE";
                    }
                    this.message="La signature ne correspond pas au capitaine déclaré en début de rencontre (licence " 
                    + (SessionAppli.recoitCoteX ? SessionAppli.capitaineA.id.toString() : SessionAppli.capitaineX.id.toString())
                    + "). Voulez-vous essayer une autre signature ?";
                    this.actSigner = true;
                    this.actValider = true;
                }

            break;
            case "ANNULE" : 
                // on retourne sur la page de validation
                this.router.navigate(["valider"],
                {
                    animated:true,
                    transition: {
                        name : SessionAppli.animationRetour, 
                        duration : 380,
                        curve : "easeIn"
                    }
                });
            break;
        }
    }

    onValider(args: EventData) {
        console.log("Session enregistrée - Feuille de match uniquement signée par capitaine qui reçoit");
        SessionAppli.scoreValide = true;
        // mémoriser les signatures
        SessionAppli.Persiste().then(cr => {
            // retour à la page des actions
            this.router.navigate(["actions"],
            {
                animated:true,
                transition: {
                    name : SessionAppli.animationRetour, 
                    duration : 380,
                    curve : "easeIn"
                }
            });
        }, error => {
            console.log("Impossible de persister la session : " + error);
        });

    }

    onSigner(args: EventData) {
        let capitaine:string;
        // on retire la signature du capitaine qui recoit
        if(SessionAppli.recoitCoteX) {
            SessionAppli.signatureX = "PAS SIGNE";
        } else {
            SessionAppli.signatureA = "PAS SIGNE";
        }
        // on recommence : nouveau scan
        capitaine = SessionAppli.recoitCoteX ? 
        SessionAppli.capitaineA.nom + " " + SessionAppli.capitaineA.prenom  : 
        SessionAppli.capitaineX.nom + " " + SessionAppli.capitaineX.prenom;
        console.log("capitaine=" + toURL(capitaine));
        // mémoriser les signatures
        SessionAppli.Persiste().then(cr => {
            // retour à la page des actions
            this.router.navigate(["qrscan/SIGNATURE/" + toURL(capitaine)],
            {
            animated:true,
            transition: {
                name : SessionAppli.animationAller, 
                duration : 380,
                curve : "easeIn"
                }
            });
        }, error => {
            console.log("Impossible de persister la session : " + error);
        });
    }
    onFermer(args: EventData) {
        // retour sur la page précédente
        this.router.navigate(["valider"],
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
