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
import { Button, EventData, ListView, ItemEventData } from "@nativescript/core";

import { EltListeLicencie, Licencie, Club } from "../db/RespeqttDAO";
import { SessionAppli } from "../session/session";
import { RouterExtensions } from "@nativescript/angular";
import { ActivatedRoute } from "@angular/router";
import { RespeqttDb } from "../db/dbRespeqtt";

@Component({
    templateUrl: "./joueurs.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"]
})
export class JoueursComponent{
    listeJoueurs:Array<EltListeLicencie>;
    maListe:ListView;
    descClub:string = "";
    router: RouterExtensions;
    clubChoisi:boolean=false;
    joueurSel:boolean=false;
    version: string;


    constructor(private _route: ActivatedRoute, private _routerExtensions: RouterExtensions) {
        // version logicielle
        this.version = SessionAppli.version;


        // récupération du routeur pour naviguer
        this.router = _routerExtensions;

        // est-ce qu'un club a été choisi
        if(SessionAppli.clubChoisi > 0) {
            this.clubChoisi = true;
        }

        console.log("Rechargement de la liste des joueurs : clubChoisi=" + this.clubChoisi.toString());
        Licencie.getListe(SessionAppli.clubChoisi).then(liste => {
            let listePasTriee = liste  as Array<EltListeLicencie>;

            // on trie par ordre alpbabétique
            this.listeJoueurs = listePasTriee.sort((e1, e2)=> (e1.nom + " " + e1.prenom).localeCompare(e2.nom + " " + e2.prenom));
            
            if(this.listeJoueurs != null) {
                console.log(this.listeJoueurs.length.toString() + " joueurs");
            }
        }, error => {

        });
        Club.getDescriptionClub(SessionAppli.clubChoisi).then(desc => {
            this.descClub = desc as string;
            console.log("Club=" + this.descClub);
        }, error => {
            console.log("Impossible de lire le nom du Club : " + error.toString())
        });
    }

    ngOnInit(): void {
    }

     onDelTap(args: EventData) {
        let button = args.object as Button;
        let sql = "delete from Licencie where lic_kn in (";
        let del = "";

        // construit la requête SQL des éléments à supprimer
        for(let i=0; i < this.listeJoueurs.length; i++) {
            if(this.listeJoueurs[i].sel) {
                if(del != "") {
                    del = del + ", "
                }
                else {
                    del = sql;
                }
                del = del + this.listeJoueurs[i].id.toString();
            }
        }
        // finaliser la requête
        if(del != "")  {
            del = del + ")";
            // trace la requête avant exécution
            console.log(del);

            RespeqttDb.db.execSQL(del).then(id=>{
                console.log("Joueurs supprimés");
                // relire la liste des joueurs
                Licencie.getListe(SessionAppli.clubChoisi).then(liste => {
                    this.listeJoueurs = liste  as Array<EltListeLicencie>;
                    if(this.listeJoueurs != null) {
                        console.log(this.listeJoueurs.length.toString() + " joueurs");
                    }
                }, error => {
                });
            }, error => {
                console.log("Impossible de supprimer les joueurs : " + error.toString());
            });
        }
        else {
            alert("Aucun élément n'est sélectionné.")
        }
    }

    onLoadTap(args: EventData) {
        let button = args.object as Button;
        console.log("Appel à SPID... ");
        Licencie.SIM_LoadListe();
        Licencie.getListe(SessionAppli.clubChoisi).then(liste =>{
            this.listeJoueurs = liste as Array<EltListeLicencie>;
            if(this.listeJoueurs != null) {
                console.log(this.listeJoueurs.length.toString() + " joueurs");
            }
            this.maListe.refresh();
        }, error => {
        });
    }

    onAjouter(args: EventData) {
        // appeler la page de saisie des joueurs
        this.router.navigate(["/ajouterJoueurs/" + this.descClub],
        {
            animated:true,
            transition: {
                name : SessionAppli.animationAller, 
                duration : 380,
                curve : "easeIn"
            }
        });
    }


    onListViewLoaded(args: EventData) {
        this.maListe = <ListView>args.object;
        Club.getDescriptionClub(SessionAppli.clubChoisi).then(desc => {
            this.descClub = desc as string;
            console.log("Club=" + this.descClub);
        }, error => {
            console.log("Impossible de lire le nom du Club : " + error.toString())
        });
        console.log("Club=" + this.descClub);

    }

    onItemTap(args: ItemEventData) {
        const index = args.index;

        // sélectionner le joueur
        this.listeJoueurs[index].sel = !this.listeJoueurs[index].sel;

        this.joueurSel = false;
        for(let i=0; i < this.listeJoueurs.length; i++) {
            if(this.listeJoueurs[i].sel){
                this.joueurSel = true;
            }
        }

        console.log("Joueur choisi : " + this.listeJoueurs[index].id);
    }

    // Club
    onClub(args: EventData) {
        this.router.navigate(["/clubs/joueurs"],
        {
            animated:true,
            transition: {
                name : SessionAppli.animationAller, 
                duration : 380,
                curve : "easeIn"
            }
        });
    }    

    // Fermer
    onFermer(args: EventData) {
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
