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

import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Page, Button, EventData, ListView, ItemEventData } from "@nativescript/core";
import { RouterExtensions } from "@nativescript/angular";
import { ActivatedRoute } from "@angular/router";

import { EltListeRencontre, Rencontre, Club, ListeFormules, Licencie, Respeqtt } from "../db/RespeqttDAO";
import { SessionAppli } from "../session/session";

import { Mobile } from "../outils/outils";



@Component({
    templateUrl: "./choixrencontre.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChoixRencontreComponent {
    listeRencontres:Array<EltListeRencontre> = [];
    mobile:Mobile;
    demiLargeur:number;
    titre:string;
    sousTitre:string;
    version:string;
    router:RouterExtensions;

    constructor(private _route: ActivatedRoute, private _routerExtensions: RouterExtensions) {
        this.mobile = new Mobile;
        // calcul de la demi largeur pour les boutons
        this.demiLargeur = Math.floor(this.mobile.largeurEcran /2) - 5;
        console.log("Demi-largeur = " + this.demiLargeur);
        // version logicielle
        this.version = SessionAppli.version;

        this.router = _routerExtensions;

        this.titre = "CHOIX DE LA RENCONTRE";
        this.sousTitre = "dans la liste ci-dessous";

        let moi:Licencie;
        let dom:boolean = (SessionAppli.tab == 0);
        SessionAppli.domicile = dom ? 1 : 0;

        console.log((dom? "A domicile" : "A l'extérieur"));

        // retrouver le joueur propriétaire du téléphone et son club
        Licencie.getLic(Respeqtt.GetLicence()).then(joueur => {
            if(joueur) {
                moi = joueur as Licencie;
                console.log("moi=" + moi.nom + " " + moi.prenom + ", mon club=" + moi.club.toString());
                // rechercher les rencontres du club à domicile ou à l'extérieur selon la valeur de dom
                Rencontre.getListeDom(moi.club, dom).then(liste => {
                    var r:EltListeRencontre;
                    this.listeRencontres = liste as Array<EltListeRencontre>;
                }, error => {
                    console.log("Impossible de lire la liste des rencontres : " + error.toString());
                });
            } else {
                SessionAppli.tab = 2; 
                alert("Vous n'avez renseigné aucune rencontre à " + (dom ? "domicile." : "l'extérieur."));
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
        }, error => {
            console.log("Impossible de récupérer le joueur demandé : " + error.toString());
        });

        if(SessionAppli.tab == 0) {
            // rencontre à domicile
        } else {
            // rencontre à l'extérieur
        }
/*        Rencontre.getListe().then(liste => {
            var r:EltListeRencontre;
            this.listeRencontres = liste as Array<EltListeRencontre>;
        }, error => {
            console.log("Impossible de lire la liste des rencontres : " + error.toString());
        });
*/
    }

    // Charge la liste des rencontres pour affichage
    ngOnInit(): void {

    }

    onListViewLoaded(args: EventData) {
        const listView = <ListView>args.object;
    }

    onItemTap(args: ItemEventData) {
        const index = args.index;
        SessionAppli.rencontreChoisie = this.listeRencontres[index].id;
        // Rechercher la rencontre en BDD
        if(SessionAppli.RechargeSession(SessionAppli.rencontreChoisie)) {
            this.router.navigate(["preparation"],
            {
                animated:true,
                transition: {
                    name : SessionAppli.animationAller, 
                    duration : 380,
                    curve : "easeIn"
                }
            });
        } else {
            if(SessionAppli.rencontreChoisie == 0)  {
                // aller sur la page de préparation de la feuille de match
                const button: Button = <Button>args.object;
                const page: Page = button.page;
                this.router.navigate(["preparation"],
                {
                    animated:true,
                    transition: {
                        name : SessionAppli.animationAller, 
                        duration : 380,
                        curve : "easeIn"
                    }
                });
            } else {
                // récupérer la description complète de la rencontre
                Rencontre.getRencontre(SessionAppli.rencontreChoisie).then(ren => {
                    const r: Rencontre = ren as Rencontre;
                    // mémoriser la formule
                    SessionAppli.formule = r.formule;
                    // mémoriser le nb de joueurs
                    SessionAppli.nbJoueurs = ListeFormules.getFormule(r.formule).getNbJoueurs();
                    // mémoriser le nb de sets gagnants
                    SessionAppli.nbSetsGagnants = r.nbSets;
                    // calculer le nb de pts par victoire
                    SessionAppli.ptsParVictoire = this.CalculePtsParVictoire(r);
                    console.log(SessionAppli.ptsParVictoire + " pt/victoire");
                    console.log("NbJoueurs = " + SessionAppli.nbJoueurs);
                    // récupérer le club 1 placé en A en attendant de savoir
                    Club.getClub(r.club1).then(club => {
                        if(SessionAppli.recoitCoteX) {
                            SessionAppli.clubX = club as Club;
                        } else {
                            SessionAppli.clubA = club as Club;
                        }
                        // récupérer le club 2 placé en X en attendant de savoir
                        Club.getClub(r.club2).then(club => {
                            if(SessionAppli.recoitCoteX) {
                                SessionAppli.clubA = club as Club;
                            } else {
                                SessionAppli.clubX = club as Club;
                            }
                            console.log("ClubA = " + SessionAppli.clubA.nom);
                            console.log("ClubX = " + SessionAppli.clubX.nom);
                            // récupérer le titre de la rencontre
                            Rencontre.getDescriptionRencontre(SessionAppli.rencontreChoisie).then(desc => {
                                SessionAppli.titreRencontre = desc as string;
                                console.log("Rencontre =" + SessionAppli.titreRencontre);

                                // aller sur la page de préparation de la feuille de match
                                const button: Button = <Button>args.object;
                                const page: Page = button.page;
                                this.router.navigate(["preparation"],
                                {
                                    animated:true,
                                    transition: {
                                        name : SessionAppli.animationAller, 
                                        duration : 380,
                                        curve : "easeIn"
                                    }
                                });
                            }, error => {
                                console.log("Impossible de lire le titre de la rencontre" + error.toString());
                            });
                        }, error => {
                            console.log("Impossible de trouver le club " + r.club2.toString() + ": " + error.toString());
                        });
                    }, error => {
                        console.log("Impossible de trouver le club " + r.club1.toString() + ": " + error.toString());
                    });
                }, error => {
                    console.log("Impossible de lire la rencontre choisie : " + error.toString())
                });

            }
        }
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

    CalculePtsParVictoire(r:Rencontre):number {

        // en départemental = 2pts sauf coupe du Rhone, autre = 1pt
        if(r.echelon == 3 && r.division.charAt(0) != 'C') return 2;
        else return 1;
    }

}



