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
import { EventData, Switch, Observable } from "@nativescript/core";
import { Club, EltListeClub, Rencontre, ListeFormules } from "../db/RespeqttDAO";
import { DatePicker } from "@nativescript/core/ui/date-picker";
import { TextField, ListPicker } from "@nativescript/core";
import { SessionAppli } from "../session/session";

var dialogs = require("@nativescript/core/ui/dialogs");

@Component({
    templateUrl: "./detailsRencontre.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"]
 })
export class DetailsRencontreComponent extends Observable {
    routeur: RouterExtensions;            // pour navigation
    titreRencontre:string;
    date:Date;
    listeEchelons:Array<string>=["Dép", "Rég", "Nat."];
    listeFormules:Array<string>=[];
    listeLigues:Array<string>=["Auvergne Rhône Alpes", "Bourgogne Franche Comté", "Bretagne", "Centre Val de Loire", "Corse", "Grand Est", 
        "Guadeloupe L", "Guyane L", "Hauts de France", "Ile de France", "Ligue Martinique", "Mayotte L", "Normandie", "Nouvelle Aquitaine", "Nouvelle Calédonie", "Occitanie"];

    division:string="";
    poule:string="";
    clubADomicile:EltListeClub;
    clubVisiteur:EltListeClub;
    echelon:number=0;
    phase:number=1;
    journee:number=1;
    nbSets:number;
    formule:number=18;
    feminin:boolean=false;
    ligue:string="";
    version:string;


    constructor(private _route: ActivatedRoute, private router: RouterExtensions) {

        super();

        let num:number;

        // version logicielle
        this.version = SessionAppli.version;

        // init des dates
        this.date = new Date();

        this.nbSets = 3;


        // constituer la liste des formules connues
        let f:string;
        for(let i:number = 0; i < ListeFormules.tabFormules.length; i++) {
            f = ListeFormules.tabFormules[i].id.toString();
            console.log("formule " + f);
            this.listeFormules.push(f);
        }


        // récupérer les clubs passés en paramètre
        num = Number(this._route.snapshot.paramMap.get("club1"));

        Club.getClub(num).then(club => {
            this.clubADomicile = club  as EltListeClub;
            this.clubADomicile.numero = num;

            num = Number(this._route.snapshot.paramMap.get("club2"));
            Club.getClub(num).then(club => {
                this.clubVisiteur = club  as EltListeClub;
                this.titreRencontre = this.clubADomicile.nom + " vs " + this.clubVisiteur.nom;
                this.clubVisiteur.numero = num;
            }, error =>{
                console.log("Club2 " + num.toString() + " inconnu : " + error.toString());
                // retour à la page de choix des clubs
                this.router.navigate(["ajouterRencontre"],
                {
                    animated:true,
                    transition: {
                        name : SessionAppli.animationRetour, 
                        duration : 380,
                        curve : "easeIn"
                    }
                });
            });
        }, error =>{
            console.log("Club1 " + num.toString() + " inconnu : " + error.toString());
            // retour à la page de choix des clubs
            this.router.navigate(["ajouterRencontre"],
            {
                animated:true,
                transition: {
                    name : SessionAppli.animationRetour, 
                    duration : 380,
                    curve : "easeIn"
                }
            });
    });
    }

    ngOnInit(): void {

    }

    onDateChange(data: EventData) {
        const datePicker = <DatePicker>data.object;
        this.date = datePicker.date;
        console.log("Date=" + this.date.toString());
    }

    onEchelon(args:EventData) {
        const p = args.object as ListPicker;

        //  1 = dép, 2 = rég, 3 = nat
        this.echelon = p.selectedIndex+1;
        console.log("Echelon=" + this.echelon.toString());
    }

    onFormule(args:EventData) {
        const p = args.object as ListPicker;

        this.formule = Number(this.listeFormules[p.selectedIndex]);
        console.log("Formule=" + this.formule.toString());
    }

    onLigue(args:EventData) {
        const p = args.object as ListPicker;

        this.ligue = this.listeLigues[p.selectedIndex];
        console.log("Ligue=" + this.ligue);
    }

    onCheckedChange(args: EventData) {
        let sw = args.object as Switch;
        this.feminin = sw.checked; // boolean
    }

    onBlurDivision(args: EventData) {
        let t = args.object as TextField;

        this.division = t.text;
    }
    onBlurPoule(args: EventData) {
        let t = args.object as TextField;

        this.poule = t.text;
    }
    onBlurPhase(args: EventData) {
        let t = args.object as TextField;

        this.phase = Number(t.text);
    }
    onBlurJournee(args: EventData) {
        let t = args.object as TextField;

        this.journee = Number(t.text);
    }
     onBlurNbSets(args: EventData) {
        let t = args.object as TextField;

        this.nbSets = Number(t.text);
    }


    onAjouter(args: EventData) {
        let r: Rencontre  = new Rencontre();

        r.division = this.division;
        r.poule = this.poule;
        r.club1 = this.clubADomicile.numero;
        r.club2 = this.clubVisiteur.numero;
        r.date = this.date.getDate().toString() + "/" + (this.date.getMonth()+1).toString() + "/" +  this.date.getFullYear().toString();
        r.date = this.date.getFullYear().toString() + "/"
               + ((this.date.getMonth()+1) > 9 ? (this.date.getMonth()+1).toString() : "0" + (this.date.getMonth()+1)).toString() + "/"
               + ((this.date.getDate() > 9 ? this.date.getDate().toString() : "0" + this.date.getDate().toString()))
        r.echelon = this.echelon;
        r.nbSets = this.nbSets;
        r.formule = this.formule;
        r.feminin = this.feminin;
        r.ligue = this.ligue;
        r.phase = this.phase;
        r.journee = this.journee;

        console.log("Division:" + this.division);
        console.log("Poule:" + this.poule);
        console.log("Phase:" + this.phase);
        console.log("journée:" + this.journee);
        console.log("Club1:" + this.clubADomicile.numero);
        console.log("Club2:" + this.clubVisiteur.numero);
        console.log("date:" + r.date);
        console.log("echelon:" + this.echelon);
        console.log("nb sets:" + this.nbSets);
        console.log("formule:" + this.formule);
        console.log("féminin:" + this.feminin);
        console.log("ligue:" + this.ligue);

        Rencontre.AjouteRencontre(r).then(res=>{
            // Afficher la page de choix des rencontres
            console.log("Rencontre ajoutée");
            this.router.navigate(["rencontre"],
            {
                animated:true,
                transition: {
                    name : SessionAppli.animationRetour, 
                    duration : 380,
                    curve : "easeIn"
                }
            });
        }, error =>{
            console.log("Impossible d'ajouter la rencontre");
        });   
    }

    onFermer(args: EventData) {
        // Afficher la page de choix des rencontres
        this.router.navigate(["rencontre"],
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