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
import { TextField, EventData, Switch } from "@nativescript/core";

import { Licencie } from "../db/RespeqttDAO";
import { SessionAppli } from "../session/session";
import { RouterExtensions } from "@nativescript/angular";
import { ActivatedRoute } from "@angular/router";


@Component({
    templateUrl: "./ajouterJoueurs.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"]
})
export class AjouterJoueursComponent{
    descClub:string = "";
    listeJoueurs:Array<Licencie>;
    router: RouterExtensions;
    nom:string="";
    prenom:string="";
    licence:number;
    points:number=500;
    mute:boolean = false;
    feminin:boolean = false;
    etranger:boolean = false;
    joueur:Licencie;
    version:string;

    tf:TextField=null;

    constructor(private _route: ActivatedRoute, private _routerExtensions: RouterExtensions) {

        // récupération du routeur pour naviguer
        this.router = _routerExtensions;

        // récupératon du club
        this.descClub = this._route.snapshot.paramMap.get("club");

        // version logicielle
        this.version = SessionAppli.version;

    }

    ngOnInit(): void {
    }

    onBlurNom(args: EventData) {
        let t = args.object as TextField;

        this.nom = t.text;
        console.log("Nom:" + this.nom);
    }    
    onBlurPrenom(args: EventData) {
        let t = args.object as TextField;

        this.prenom = t.text;
        console.log("Prénom:" + this.prenom);
    }    
    onBlurLicence(args: EventData) {
        let t = args.object as TextField;

        this.licence = Number(t.text);
        console.log("Licence:" + this.licence.toString());
    }    
    onBlurPoints(args: EventData) {
        let t = args.object as TextField;

        this.points = Number(t.text);
        console.log("Points:" + this.points.toString());
    } 

    onFocusPoints(args: EventData) {
        this.tf = args.object as TextField;
        console.log("Dans points:");
    }     

    onValider(args: EventData) {


        // vérifier que tout a été saisi : 
        if(this.nom == null || this.nom == "") {
            alert("Merci de renseigner le nom du joueur");
            return;
        }
        if(this.prenom == null || this.prenom == "") {
            alert("Merci de renseigner le prénom du joueur");
            return;
        }
        if(this.licence == null || this.licence <= 0) {
            alert("Merci de renseigner le numéro de licence");
            return;
        }
        // vérifier que le joueur n'existe pas déjà (n° licence)
        Licencie.get(this.licence, SessionAppli.clubChoisi).then(lic => {
            let joueur:Licencie;
            joueur = lic as Licencie;
            if(joueur != null) {
                alert(this.licence.toString() + " est déjà présent dans la liste : " + joueur.nom + " " + joueur.prenom);
            } else {
                this.points = Number(this.tf.text);
                console.log("Points:"+this.points.toString());
                // on crée le joueur
                let j:Licencie = new Licencie();

                j.nom = this.nom;
                j.prenom = this.prenom;
                j.id = this.licence;
                j.points = this.points;
                j.mute = this.mute;
                j.etranger = this.etranger;
                j.feminin = this.feminin;              

                // on l'insère dans la liste des joueurs
                Licencie.ajouteLicencie(j, SessionAppli.clubChoisi);              

                // retour à la liste des joueurs
                this.router.navigate(["/joueurs"],
                {
                    animated:true,
                    transition: {
                        name : SessionAppli.animationRetour, 
                        duration : 380,
                        curve : "easeIn"
                    }
                });
        
            }

        }, error => {

        });


    }

    onMuteChange(args: EventData) {
        let s:string;
        let sw = args.object as Switch;
        this.mute = sw.checked; // boolean
        console.log("Muté = " + this.mute.toString());
    }

    onFemininChange(args: EventData) {
        let s:string;
        let sw = args.object as Switch;
        this.feminin = sw.checked; // boolean
        console.log("Féminin = " + this.feminin.toString());
    }

    onEtrangerChange(args: EventData) {
        let s:string;
        let sw = args.object as Switch;
        this.etranger = sw.checked; // boolean
        console.log("Etranger = " + this.etranger.toString());
    }

    // Fermer
    onFermer(args: EventData) {
        this.router.navigate(["/joueurs"],
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
