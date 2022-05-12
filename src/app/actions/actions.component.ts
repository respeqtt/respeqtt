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
import { TabView, Button, EventData } from "@nativescript/core";
import { RespeqttDb } from "../db/dbRespeqtt";
import { ListeFormules, EltListeRencontre, Rencontre, FormuledeRencontre } from "../db/RespeqttDAO";
import { Mobile } from "../outils/outils";
import { SessionAppli } from "../session/session";
import { RouterExtensions } from "@nativescript/angular";
import { Respeqtt } from "../db/RespeqttDAO";
import { Signature } from "../db/RespeqttDAO";

var dialogs = require("@nativescript/core/ui/dialogs");

@Component({
    templateUrl: "./actions.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"]
})
export class ActionsComponent implements OnInit {
    router: RouterExtensions;                     // pour navigation
    tab:number; //=SessionAppli.tab;                        // tab présenté
    modeRencontre:boolean; //=SessionAppli.modeRencontre;   // mode rencontre ou mode saisie équipe/saisie de score hors rencontre
    dim:number;
        version:string;
    aide:string;
    sigOK:boolean = false;

    // activation des boutons
    actChoisirRencontre:boolean=false;        // si au moins une rencontre, un club et un joueur en BDD et pas extérieur
    actChoisirRencontreExt:boolean=false;     // si au moins une rencontre, un club et un joueur en BDD et pas de rencontre en cours
    actGererParties:boolean=false;            // si compo des équipes validée et domicile
    actValider:boolean=false;                 // si tous les scores renseignés et domicile
    actVoirFeuille:boolean=false;             // si parties générées
    actEnvoyerSpid:boolean=false;             // si rencontre validée
    actAbandonner:boolean=false;              // si domicile ou extérieur
    actComposerEquipe:boolean=false;          // si extérieur et rencontre choisie
    actEquipesComposeesExt:boolean=false;     // si compo des équipes validée et extérieur
    actComposerDoubles:boolean=false;         // si extérieur et équipe saisie
    actImporterScores:boolean=false;          // si extérieur et compo des deux équipes renseignée
    actSaisirPartie:boolean=false;            // sauf si à domicile
    actAbandonnerExt:boolean=false;           // si extérieur et rencontre choisie
    actSigner:boolean=false;                  // si extérieur et rencontre choisie
    actConsulterScores:boolean=false;         // si extérieur et scores existent

    constructor(private _routerExtensions: RouterExtensions) {
        this.router = _routerExtensions;

        // version logicielle
        this.version = SessionAppli.version;
        console.log("Version logicielle: " + this.version);
        // Init de la BDD
        RespeqttDb.Init().then(ok => { 
            console.log("BD initialisée");
            // Recherche de la signature
            Respeqtt.ChargeSignature().then(res => {
                if(res) {
                    let sig = res as Signature;
                    let lic = sig.GetLicence();
                    console.log("licence=" + lic.toString());     
                    if(lic > 0) {
                        this.sigOK = true;
                        console.log("signature chargée pour " + sig.GetLicence().toString());
                    } else {
                        // pas trouvé de licence : il faut ouvrir la popup pour le saisir   
                        this.router.navigate(["init"]);
            }
                }  else {
                    // saisir le numéro de licence : il faut ouvrir la popup pour le saisir
                    this.router.navigate(["init"]);
                }   
            }, error => {
                alert("Impossible de lire la base de données : " + error);
            });

            // on ne choisit de rencontre que si on les a téléchargées
            if(SessionAppli.listeRencontres.length == 0) {
                Rencontre.getListe().then(liste => {
                    if(liste) {
                        SessionAppli.listeRencontres = liste as Array<EltListeRencontre>;
                        console.log("Liste rencontres chargées = " + SessionAppli.listeRencontres.length + " éléments");
                    }    
                    // Chargement des formules
                    ListeFormules.Init();
                    console.log("Liste des formules chargée (" + ListeFormules.tabFormules.length + " formules)");

                    console.log("Mode rencontre : " + (this.modeRencontre ? "OUI" : "NON"));
                    this.ActiveBoutons();        
                }, error => {
                    console.log(error);
                    this.ActiveBoutons();
                });
            } else {
                this.ActiveBoutons();
            }
        }, error => {
            console.log("BD ***PAS*** initialisée");
            console.log(error);
            this.actChoisirRencontre = false;
        });
    }

    ngOnInit(): void {
        // calcul de la largeur de l'écran
        let mobile:Mobile= new Mobile;
        SessionAppli.dimEcran = mobile.largeurEcran < mobile.hauteurEcran ? mobile.largeurEcran : mobile.hauteurEcran;
        this.dim = SessionAppli.dimEcran;
        console.log("OS : " + mobile.OS() + ", modèle : " + mobile.modele, ", API : " + mobile.api);

        // positionnement sur un onglet
        console.log("Tab=" + SessionAppli.tab.toString());
        if(SessionAppli.tab < 0) {
            switch (SessionAppli.domicile) {
                case 1 : this.tab = 0;
                break;
                case 0 : this.tab = 1;
                break;
                case -1 : this.tab  = 2;
            }
        } else {
            this.tab = SessionAppli.tab;
        }
    }  

    ActiveBoutons() {
        // boutons onglet domicile
        console.log("Evaluation des boutons actifs");
        this.actChoisirRencontre = (SessionAppli.listeRencontres != null) 
                                && (SessionAppli.listeRencontres.length > 0) 
                                && SessionAppli.domicile != 0
                                && !SessionAppli.scoreValide;
        // on ne peut abandonner que si on a une rencontre en cours
        this.actAbandonner = SessionAppli.rencontreChoisie != -1 && SessionAppli.domicile == 1;
        // on ne lance les parties que si la compo est figée
        this.actGererParties = SessionAppli.compoFigee && (SessionAppli.domicile == 1) && !SessionAppli.scoreValide;
        // on ne valide le score que si les parties ont été lancées et si le score n'a pas déjà été validé
        this.actValider = (SessionAppli.listeParties.length > 0)  && (SessionAppli.domicile == 1) && !SessionAppli.scoreValide;
        // on n'envoie à SPID que si le scoré a été validé
        this.actEnvoyerSpid = SessionAppli.scoreValide && (SessionAppli.domicile == 1);    
        // on ne consulte la feuille que si les parties ont été lancées
        this.actVoirFeuille = (SessionAppli.listeParties.length > 0)  && (SessionAppli.domicile == 1);
        // 
        this.actEquipesComposeesExt = SessionAppli.compoFigee && (SessionAppli.domicile == 0);

        // boutons onglet Extérieur
        // choix des rencontres
        this.actChoisirRencontreExt =  (SessionAppli.listeRencontres != null) 
                                    && (SessionAppli.listeRencontres.length > 0) 
                                    && (SessionAppli.rencontreChoisie == -1);     
        // composer équipe
        this.actComposerEquipe = (SessionAppli.domicile == 0) && SessionAppli.rencontreChoisie != -1;
        // composer les doubles
        this.actComposerDoubles = (SessionAppli.domicile == 0) 
                                && ((SessionAppli.equipeA.length > 0) ||  (SessionAppli.equipeX.length > 0));
        // importer les scores
        this.actImporterScores = (SessionAppli.domicile == 0) 
                                && SessionAppli.equipeA.length > 0 && SessionAppli.equipeX.length > 0;
        // consulter les scores
        this.actConsulterScores = (SessionAppli.domicile == 0) 
                                && SessionAppli.listeParties.length > 0 && SessionAppli.listeParties.length > 0;
        // saisir une partie
        this.actSaisirPartie = SessionAppli.domicile != 1;
        // abandonner la rencontre en cours
        this.actAbandonnerExt = (SessionAppli.domicile == 0) && (SessionAppli.rencontreChoisie != -1);
        // signer la feuille : on a choisi le capitaine de l'équipe qui se déplace
        console.log("CapitaineA =" + (SessionAppli.capitaineA != null).toString());
        console.log("CapitaineX =" + (SessionAppli.capitaineX != null).toString());
        if(SessionAppli.recoitCoteX && SessionAppli.capitaineA != null) {
            this.actSigner = (SessionAppli.domicile == 0) && (SessionAppli.rencontreChoisie != -1) && SessionAppli.capitaineA.id > 0;
        }else {
            if(!SessionAppli.recoitCoteX && SessionAppli.capitaineX != null) {
            this.actSigner = (SessionAppli.domicile == 0) && (SessionAppli.rencontreChoisie != -1) && SessionAppli.capitaineX.id > 0;
            } else {
                this.actSigner = false;
            }
        }
        // page d'aide
        this.aide = this.pageAide('aide');

    }

    onFeuille(args: EventData) {
        let button = args.object as Button;

        // consulter ou envoyer la feuille de match
        this.router.navigate(["feuille"],
        {
            animated:true,
            transition: {
                name : SessionAppli.animationAller, 
                duration : 380,
                curve : "easeIn"
            }
        });
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
                    console.log("VALIDATION ANNULEE");
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

    onEnvoyerASPID(args: EventData) {
        let button = args.object as Button;

        if(this.actEnvoyerSpid) {
            // to do : envoi à SPID
            // on RAZ (temporaire)
            SessionAppli.Efface(SessionAppli.rencontreChoisie).then(cr => {
                SessionAppli.Raz();
                alert("Fonction non encore implémentée, en attente de l'agrément FFTT");
                this.actEnvoyerSpid = false;
            }, error => {
                console.log("Impossible d'effacer la rencontre :" + error);
            });
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
                    SessionAppli.Efface(SessionAppli.rencontreChoisie).then(cr=> {
                        SessionAppli.Raz();

                        this.actChoisirRencontre = true;
                        this.actGererParties = false;
                        this.actVoirFeuille = false;
                        this.actValider = false;
                        this.actEnvoyerSpid = false;
                        this.actAbandonner = false;
                        this.actChoisirRencontreExt = true;
                        this.actComposerEquipe = false;
                        this.actComposerDoubles = false;
                        this.actAbandonnerExt = false;
                        this.actSigner = false;
                        this.actImporterScores = false;
                        this.actConsulterScores = false;

            
                        alert("Rencontre abandonnée");
                    }, error => {
                        console.log("Impossible d'effacer la rencontre : " + error);
                    });                    
                } else {
                    console.log("Abandon ANNULE");
                }
            });
    }


    onAbandonnerExt(args: EventData) {
        let button = args.object as Button;

        dialogs.prompt({title:"Confirmation",
            message:"Etes vous sûr de vouloir abandonner la rencontre " //+ SessionAppli.titreRencontre
                    + " ? Les compositions et les résultats seront effacés.",
            okButtonText:"ABANDONNER LA RENCONTRE",
            cancelButtonText:"ANNULER"
            }).then(r => {
                if(r.result) {
                    
                    // effacement en BDD
                    SessionAppli.Efface(SessionAppli.rencontreChoisie).then(cr => {
                        SessionAppli.Raz();

                        this.actChoisirRencontre = true;
                        this.actGererParties = false;
                        this.actVoirFeuille = false;
                        this.actValider = false;
                        this.actEnvoyerSpid = false;
                        this.actAbandonner = false;
                        this.actChoisirRencontreExt = true;
                        this.actComposerEquipe = false;
                        this.actComposerDoubles = false;
                        this.actAbandonnerExt = false;
                        this.actSigner = false;
                        this.actImporterScores = false;
                        this.actConsulterScores = false;


                        alert("Rencontre abandonnée");
                    }, error => {

                    });                         
                } else {
                    console.log("Abandon ANNULE");
                }
            });
    }    
    onLancement(args: EventData) {
        let button = args.object as Button;
        // vérifier si on peut passer sur la page de lancement des parties
        // inutile : le bouton est inactif si pas this.lancer
        if(this.actGererParties) {
            this.router.navigate(["lancement"],
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

    onPreparer(args: EventData) {
        
        if(SessionAppli.rencontreChoisie >= 0) {
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
            this.router.navigate(["choixrencontre"],
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


    onTabChanged(args: EventData) {
        // vers quel onglet va-t-on
        const tab = args.object as TabView;

        this.ActiveBoutons();
        console.log("Domicile = " + SessionAppli.domicile.toString());
        
        console.log("Rencontre Choisie :" + SessionAppli.rencontreChoisie);
        switch(tab.selectedIndex) {
            case 0 :
                // rencontre à domicile
                SessionAppli.tab = 0;
                console.log("Tab >> rencontre à domicile");
            break;

            case 1 :
                // rencontre à l'extérieur
                SessionAppli.tab = 1;
                console.log("Tab >> rencontre à l'extérieur");
            break;

            case 2 :
                // préparation
                SessionAppli.tab = 2;
                console.log("Tab >> préparer");
            break;

            case 3 :
                // aide
                console.log("Tab >> aide");
            break;

            default : 
                // ???
                console.log("Tab >> inconnu : " + tab.selectedIndex);

        }
        
    }


    onClub(args: EventData) {
        
        SessionAppli.tab = 1;
        // appeler la page de choix des clubs
        this.router.navigate(["clubs/actions"],
        {
            animated:true,
            transition: {
                name : SessionAppli.animationAller, 
                duration : 380,
                curve : "easeIn"
            }
        });
        
    }

     onJoueurs(args: EventData) {
         
        SessionAppli.tab = 1;
        // appeler la page de téléchargement des joueurs
        this.router.navigate(["joueurs"],
        {
            animated:true,
            transition: {
                name : SessionAppli.animationAller, 
                duration : 380,
                curve : "easeIn"
            }
        });
        
    }

    onRencontre(args: EventData) {
        
        SessionAppli.tab = 1;
        // appeler la page de choix de rencontre
        this.router.navigate(["choixrencontre"],
        {
            animated:true,
            transition: {
                name : SessionAppli.animationAller, 
                duration : 380,
                curve : "easeIn"
            }
        });
        
    }

    onCompo(args: EventData) {
        
        // préparation de la session
        if(SessionAppli.rencontreChoisie < 0) {
            SessionAppli.tab = 1;
            SessionAppli.rencontreChoisie = 0;
        }
        // appeler la page de compo des équipes
        this.router.navigate(["preparation"],
        {
            animated:true,
            transition: {
                name : SessionAppli.animationAller, 
                duration : 380,
                curve : "easeIn"
            }
        });
        
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
        // si on recoit coté A et que l'équipe X est déjà composée
        if(!SessionAppli.recoitCoteX && SessionAppli.equipeX.length > 0) {
            cote = "X";
            for(let i=0; i < SessionAppli.equipeX.length; i++ ) {
                texteEquipe = texteEquipe + SessionAppli.equipeX[i].nom + " " + SessionAppli.equipeX[i].prenom + "\n";
            }
        } else {
            // si on recoit coté X et que l'équipe A est déjà composée
            if(SessionAppli.recoitCoteX && SessionAppli.equipeA.length > 0) {
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
                    this.router.navigate(["compoDoubleExt/" + cote + "/1/" + f.nbDoubles.toString()],
                    {
                        animated:true,
                        transition: {
                            name : SessionAppli.animationAller, 
                            duration : 380,
                            curve : "easeIn"
                        }
                    });
                } else {
                    // appeler la page de scan des doubles
                    console.log("-> qrscan/EQUIPE/0");
                    this.router.navigate(["qrscan/EQUIPE/0"],
                    {
                        animated:true,
                        transition: {
                            name : SessionAppli.animationAller, 
                            duration : 380,
                            curve : "easeIn"
                        }
                    });
                }
            });
        }
        
    }

    onDownloadRencontre(args:Event) {
        // appeler la page des rencontres
        this.router.navigate(["/rencontre"],
        {
            animated:true,
            transition: {
                name : SessionAppli.animationAller, 
                duration : 380,
                curve : "easeIn"
            }        
        });
    }

    onAjouterClub(args:Event) {
        // appeler la page des rencontres
        this.router.navigate(["../ajouterClub"],
        {
            animated:true,
            transition: {
                name : SessionAppli.animationAller, 
                duration : 380,
                curve : "easeIn"
            }        
        });
    }

    onPartager(args: EventData) {
        
        // préparation de la session
        if(SessionAppli.rencontreChoisie < 0) {
            SessionAppli.tab = 1;
            SessionAppli.rencontreChoisie = 0;
        }
        const quoi:string= SessionAppli.ScoresToJSon();
        const titre:string="Scores de " + SessionAppli.titreRencontre;
        const dim:number = SessionAppli.dimEcran - 40;

        // appeler la page d'affichage du QRCode des scores

         this.router.navigate(["attente/" + quoi + "/" + dim + "/" + titre + "/actions/aucun"],
        {
            animated:true,
            transition: {
                name : SessionAppli.animationAller, 
                duration : 380,
                curve : "easeIn"
            }
        });

    }

    onImporter(args: EventData) {
        
        // préparation de la session
        if(SessionAppli.rencontreChoisie < 0) {
            SessionAppli.tab = 1;
            SessionAppli.rencontreChoisie = 0;
        }
        if(this.actImporterScores) {
            // appeler la page de scan des scores
            this.router.navigate(["qrscan/SCORES/0"],
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


    onConsulter(args: EventData) {
        
        // préparation de la session
        if(SessionAppli.rencontreChoisie < 0) {
            SessionAppli.tab = 1;
            SessionAppli.rencontreChoisie = 0;
        }
        // appeler la page de lancement
        if(this.actConsulterScores) {
            this.router.navigate(["lancement"],
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

    onPartie(args: EventData) {
        
        // préparation de la session
        if(SessionAppli.rencontreChoisie < 0) {
            SessionAppli.tab = 1;
            SessionAppli.rencontreChoisie = 0;
        }
        // appeler la page de scan des parties
        this.router.navigate(["qrscan/PARTIE/0"],
        {
            animated:true,
            transition: {
                name : SessionAppli.animationAller, 
                duration : 380,
                curve : "easeIn"
            }
        });

    }

    onSigner(args:Event) {
        // appeler la page de signature
        this.router.navigate(["../signer/MONTRER"],
        {
            animated:true,
            transition: {
                name : SessionAppli.animationAller, 
                duration : 380,
                curve : "easeIn"
            }        
        });
    }


    pageAide(contexte:string):string {
        let page:string;

    //    page='file://' + contexte + '.html';
        page = `
        <!DOCTYPE html>
        <html>
        
        <head>
        </head>
        
        <h1>Pour commencer :</h1>
        <a id="top"> HAUT<a/>
        
        <h2>La veille de la rencontre (ou avant) : </h2>
        
        <p><i>si vous jouez à domicile :</i></p>
        <ul>
        <li>renseigner la rencontre, les clubs et les joueurs.</li>
        </ul>
        
        <p><i>si vous jouez à l'extérieur:</i></p>
        <ul>
        <li STYLE="padding:0 0 0 20px;">choisir la rencontre, renseigner votre club et vos joueurs</li>
        </ul>
        
        <h2>Le jour de la rencontre :</h2>
        
        <p><i>si vous jouez à domicile :</i></p>
        <ul>
        <li>choisir la rencontre dans la liste,</li>
        <li>composer son équipe et demander au club visiteur sa composition,</li>
        <li>poser des réserves (ou pas),</li>
        <li>valider la composition des deux équipes</li>
        <li>gérer les simples et les doubles (saisir les scores)</li>
        <li>poser des réclamations,</li>
        <li>demander au JA (s'il y en a un) son rapport,</li>
        <li>valider la feuille,</li>
        <li>envoyer les résultats à SPID et la feuille de match aux adversaires et aux partenaires.</li>
        </ul>
        <p><i>si vous jouez à l'extérieur :</i></p>
        <ul>
        <li>choisir la rencontre dans la liste,</li>
        <li>composer son équipe et donner sa composition au club qui reçoit,</li>
        <li>saisir des scores de simples,</li>
        <li>composer ses doubles et donner les compositions au club qui reçoit,</li>
        <li>signer la feuille,</li>
        <li>récupérer par mail la feuille de match validée</li>
        </ul>
        
        <a href="#top"> EN HAUT </a>
        
        
        </html>
        `;

        return page
    }

}
