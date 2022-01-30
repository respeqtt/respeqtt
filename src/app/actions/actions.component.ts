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
import { TabView, Button, EventData } from "@nativescript/core";
import { RespeqttDb } from "../db/dbRespeqtt";
import { ListeFormules, EltListeRencontre, Rencontre, Partie, FormuledeRencontre } from "../db/RespeqttDAO";
import { Mobile } from "../outils/outils";
import { SessionAppli } from "../session/session";
import { RouterExtensions } from "@nativescript/angular";

var dialogs = require("@nativescript/core/ui/dialogs");

@Component({
    templateUrl: "./actions.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"]
})
export class ActionsComponent{
    router: RouterExtensions;                     // pour navigation
    preparer:boolean=false;                       // activation du bouton : préparer la feuille de match
    lancer: boolean=false;                        // activation du bouton : lancer les parties
    valider:boolean=false;                        // activation du bouton : valider le score
    spid:boolean=false;                           // activation du bouton : envoyer à SPID
    abandonner:boolean=false;                     // activation du bouton : abandonner la rencontre en cours
    tab:number; //=SessionAppli.tab;                        // tab présenté
    modeRencontre:boolean; //=SessionAppli.modeRencontre;   // mode rencontre ou mode saisie équipe/saisie de score hors rencontre
    dim:number;
    version:string;

    constructor(private _routerExtensions: RouterExtensions) {
        this.router = _routerExtensions;

        // version logicielle
        this.version = SessionAppli.version;
        console.log("Version logicielle: " + this.version);
        // Init de la BDD
        RespeqttDb.Init().then(ok => { 
            console.log("BD initialisée");
            // on ne prépare la feuille de match que si on a téléchargé les rencontres
            if(SessionAppli.listeRencontres.length == 0) {
                Rencontre.getListe().then(liste => {
                    if(liste) {
                        SessionAppli.listeRencontres = liste as Array<EltListeRencontre>;
                        console.log("Liste rencontres chargées = " + SessionAppli.listeRencontres.length + " éléments");
                        this.preparer = SessionAppli.listeRencontres.length > 0;
                    } else {
                        this.preparer = false;
                    }                    
                    // positionnement sur l'onglet préparation si pas de rencontre dans la liste
                    if(this.preparer) this.tab = 0
                    else              this.tab = 2;

                    // Chargement des formules
                    ListeFormules.Init();
                    console.log("Liste des formules chargée (" + ListeFormules.tabFormules.length + " formules)");

                    console.log("Mode rencontre : " + (this.modeRencontre ? "OUI" : "NON"));
                }, error => {
                    console.log(error);
                    this.preparer = false;
                });
            } else {
                this.preparer = true;
            }
            // on ne peut abandonner que si on a commencé et pas validé le score
            this.abandonner = this.preparer && !SessionAppli.scoreValide;
            console.log("Préparer=" + this.preparer.toString())
        }, error => {
            console.log("BD ***PAS*** initialisée");
            console.log(error);
            this.preparer = false;
        });
        // on ne lance les parties que si la compo est figée
        this.lancer = SessionAppli.compoFigee && SessionAppli.modeRencontre;
        // on ne valide le score que si les parties ont été lancées et si le score n'a pas déjà été validé
        this.valider = (SessionAppli.listeParties.length > 0)  && SessionAppli.modeRencontre && !SessionAppli.scoreValide;

        // on n'envoie à SPID que si le scoré a été validé
        this.spid = SessionAppli.scoreValide && SessionAppli.modeRencontre;      
    }

    ngOnInit(): void {

        // calcul de la largeur de l'écran
        let mobile:Mobile= new Mobile;
        SessionAppli.dimEcran = mobile.largeurEcran < mobile.hauteurEcran ? mobile.largeurEcran : mobile.hauteurEcran;
        this.dim = SessionAppli.dimEcran;
        console.log("OS : " + mobile.OS() + ", modèle : " + mobile.modele);

    }

    onFeuille(args: EventData) {
        let button = args.object as Button;

        // consulter ou envoyer la feuille de match
        this.router.navigate(["feuille"]);
    }

    onValiderScore(args: EventData) {
        let button = args.object as Button;
        // Vérifier que toutes les rencontres ont été disputées
        let scoreA:number = 0;
        let scoreX:number = 0;
        let scoreComplet:boolean=true;

        if(SessionAppli.listeParties.length == 0) {
            alert("Les parties n'ont pas encore été lancées, vous ne pouvez pas valider le score");
            return;
        }

        // calcul du score final
        scoreComplet = SessionAppli.MajScore();

        console.log("*** Score final =" + SessionAppli.score + " ***");
        console.log("*** ScoreComplet :" + scoreComplet.toString() + " ***");

        let cr:boolean;
        // si tout n'a pas été joué, on demande confirmation (la 1e fois)
        if(!scoreComplet && SessionAppli.licenceJA == 0) {
            dialogs.prompt({title:"Confirmation",
                message:"Toutes les rencontres n'ont pas été disputées, êtes vous sûr de vouloir valider en l'état ?",
                okButtonText:"VALIDER",
                cancelButtonText:"ANNULER"
                }).then(r => {
                    if(r.result) {
                        this.router.navigate(["valider/"+ SessionAppli.scoreA + "/" + SessionAppli.scoreX]);
                } else {
                    console.log("VALIDATION ANNULEE");
                    return;
                }
            });
        } else {
            this.router.navigate(["valider/" + SessionAppli.scoreA + "/" + SessionAppli.scoreX]);
        }
        
    }

    onEnvoyerASPID(args: EventData) {
        let button = args.object as Button;

        if(this.spid) {
            // to do : envoi à SPID
            // on RAZ (temporaire)
            SessionAppli.Efface(SessionAppli.rencontreChoisie);
            SessionAppli.Raz();
            alert("La rencontre a bien été envoyée, vous pouvez la consulter sur http://www.fftt.com");

            this.preparer = SessionAppli.listeRencontres.length > 0;
            this.lancer = false;
            this.valider = false;
            this.spid = false;
            this.abandonner = false;

//            this.routerExt.navigate(["envoi"]);
        }

    }

    onAbandonner(args: EventData) {
        let button = args.object as Button;

        dialogs.prompt({title:"Confirmation",
            message:"Etes vous sûr de vouloir abandonner la rencontre " //+ SessionAppli.titreRencontre
                    + " ? Les compositions et les résultats seront effacés.",
            okButtonText:"ABANDONNER LA RENCONTRE",
            cancelButtonText:"ANNULER"
            }).then(r => {
                if(r.result) {
                    
                    // effacement en BDD
                    SessionAppli.Efface(SessionAppli.rencontreChoisie);
                    SessionAppli.Raz();

                    this.preparer = SessionAppli.listeRencontres.length > 0;
                    this.lancer = false;
                    this.valider = false;
                    this.spid = false;
                    this.abandonner = false;

                    // Fin du mode rencontre
                    SessionAppli.modeRencontre = false;
                    this.modeRencontre = SessionAppli.modeRencontre;

                    alert("Rencontre abandonnée");
                    
                } else {
                    console.log("Abandon ANNULE");
                }
            });
    }

    onLancement(args: EventData) {
        let button = args.object as Button;
        // vérifier si on peut passer sur la page de lancement des parties
        // inutile : le bouton est inactif si pas this.lancer
        if(this.lancer) {
            this.router.navigate(["lancement"]);
        }
    }

    onPreparer(args: EventData) {
        
        if(SessionAppli.rencontreChoisie >= 0) {
            this.router.navigate(["preparation"]);
        } else {
            this.router.navigate(["choixrencontre"]);
        }

    }


    onTabChanged(args: EventData) {
        // vers quel onglet va-t-on
        const tab = args.object as TabView;
        
        console.log("Rencontre Choisie :" + SessionAppli.rencontreChoisie);
        switch(tab.selectedIndex) {
            case 0 :
                // rencontre à domicile
                SessionAppli.tab = 0;
                console.log("Tab >> rencontre à domicile");
            break;

            case 1 :
                // onglet 2 = scan de la partie
                console.log("Tab >> rencontre à l'extérieur");
                SessionAppli.tab = 1;
                // préparation de la session
                if(SessionAppli.rencontreChoisie < 0) {
                    let p:Partie;
//                    SessionAppli.rencontreChoisie = 0;
                    p = new Partie(ListeFormules.getFormule(SessionAppli.formule), "", null, null, false, false);
                    p.desc = "PARTIE IMPORTEE";
                    SessionAppli.listeParties.push(p);
                    console.log("Partie à scanner :" + SessionAppli.listeParties[0].desc);
                } else {
                    // appeler la page de scan des parties
                    this.router.navigate(["/qrscan/PARTIE/0"]);
                }
            break;

            case 2 :
                // config
                console.log("Tab >> config");
                SessionAppli.tab = 2;
//                this.router.navigate(["/ajouterClub"]);
            break;

            default : 
                // ???
                console.log("Tab >> inconnu : " + tab.selectedIndex);

        }
        
    }


    onClub(args: EventData) {
        
        SessionAppli.tab = 1;
        // appeler la page de choix des clubs
        this.router.navigate(["clubs/actions"]);
        
    }

     onJoueurs(args: EventData) {
         
        SessionAppli.tab = 1;
        // appeler la page de téléchargement des joueurs
        this.router.navigate(["joueurs"]);
        
    }

    onRencontre(args: EventData) {
        
        SessionAppli.tab = 1;
        // appeler la page de choix de rencontre
        this.router.navigate(["choixrencontre"]);
        
    }

    onCompo(args: EventData) {
        
        // préparation de la session
        if(SessionAppli.rencontreChoisie < 0) {
            SessionAppli.tab = 1;
            SessionAppli.rencontreChoisie = 0;
        }
        // appeler la page de compo des équipes
        this.router.navigate(["preparation"]);
        
    }

    onDownload(args:EventData) {
        const titre:string="Télécharger RESPEQTT";
        const dim:number = SessionAppli.dimEcran - 40;
        const json:string= "https://www.valencinpierre.fr/wp-content/uploads/2021/07/respeqtt.apk";

         this.router.navigate(["attente/" + json + "/" + dim + "/" + titre + "/<<back/0"]);
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


    onCompoDoubles(args: EventData) {
        
        // préparation de la session
        if(SessionAppli.rencontreChoisie < 0) {
            SessionAppli.tab = 1;
            SessionAppli.rencontreChoisie = 0;
        }
        // si on a déjà une équipe de saisie on propose de l'utiliser
        let cote:string="";
        let texteEquipe:string="\n";
        const f:FormuledeRencontre=ListeFormules.getFormule(SessionAppli.formule);
        if(SessionAppli.equipeX.length > 0) {
            cote = "X";
            for(let i=0; i < SessionAppli.equipeX.length; i++ ) {
                texteEquipe = texteEquipe + SessionAppli.equipeX[i].nom + " " + SessionAppli.equipeX[i].prenom + "\n";
            }
        } else {
            if(SessionAppli.equipeA.length > 0) {
                cote = "A";
                for(let i=0; i < SessionAppli.equipeA.length; i++ ) {
                    texteEquipe = texteEquipe + SessionAppli.equipeA[i].nom + " " + SessionAppli.equipeA[i].prenom + "\n";
                }
            }
        }
        if(cote != "" && f.id > 0) {
            dialogs.prompt({title:"Préférence",
            message:"Voulez-vous saisir les doubles à partir de l'équipe en cours : " + texteEquipe,
            okButtonText:"GARDER",
            cancelButtonText:"SCANNER UNE AUTRE EQUIPE"
            }).then(r => {
                if(r.result) {
                    console.log("!!! On garde l'équipe !!!");
                    // aller à la page de compo des doubles
                    this.router.navigate(["compoDoubleExt/" + cote + "/1/" + f.nbDoubles.toString()]);
                } else {
                    // appeler la page de scan des doubles
                    console.log("-> qrscan/EQUIPE/0");
                    this.router.navigate(["qrscan/EQUIPE/0"]);
                }
            });
        }
        
    }


    onPartie(args: EventData) {
        
        // préparation de la session
        if(SessionAppli.rencontreChoisie < 0) {
            SessionAppli.tab = 1;
            SessionAppli.rencontreChoisie = 0;
        }
        // appeler la page de scan des parties
        this.router.navigate(["qrscan/PARTIE/0"]);

    }
}
