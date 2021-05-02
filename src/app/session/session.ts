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

import { RespeqttDb } from "../db/dbRespeqtt";
import { Club, EltListeLicencie, Compo, Partie, Rencontre, EltListeRencontre, Set, Licencie, FormuledeRencontre, ListeFormules } from "../db/RespeqttDAO";
import { toSQL, bool2SQL, SQL2bool } from "../outils/outils";

import { Feuille18 } from "./feuille18";    // championnat par équipes départemental Rhone etc
import { Feuille14 } from "./feuille14";    // championnat par équipes régional et national
import { Feuille5 }  from "./feuille5";     // coupe du Rhone

export class SessionAppli {

    public static listeRencontres:Array<EltListeRencontre>=[];
    public static recoitCoteX = false;
    public static clubChoisi:number = -1;
    public static rencontreChoisie = -1;        // id de la rencontre en cours dans la table des rencontres (!= index dans ListeRencontres[])
    public static titreRencontre = "";
    public static clubA:Club=null;
    public static clubX:Club=null;
    public static equipeA:Array<EltListeLicencie>=[];
    public static equipeX:Array<EltListeLicencie>=[];
    public static capitaineA:EltListeLicencie = null;
    public static capitaineX:EltListeLicencie = null;
    public static forfaitA:boolean=false;
    public static forfaitX:boolean=false;
    public static dimEcran:number=0;    // plus petite dimension de l'écran
    public static compoFigee:boolean=false;
    public static scoreValide:boolean=false;
    public static listeParties:Array<Partie>=[];
    public static reserveClubA:string="";
    public static reserveClubX:string="";
    public static reclamationClubA:string="";
    public static reclamationClubX:string="";
    public static rapportJA:string="";
    public static nomJA:string="";
    public static prenomJA:string="";
    public static adresseJA:string="";
    public static licenceJA:number=0;
    public static score:string="";
    public static scoreA:number=0;
    public static scoreX:number=0;
    public static feuilleDeMatch:string="";
    public static tab=0;
    public static modeRencontre:boolean=false;
    public static nbJoueurs:number=0;
    public static nbSetsGagnants:number=0;
    public static formule:number=0;
    public static date:string="";
    public static lieu:string="";

    // sleep
    public static delay(ms: number){
        return new Promise(resolve => setTimeout(resolve, ms));
        }

    // Mise à jour du score
    // renvoie true si toutes les parties ont été disputées, false sinon
    public static MajScore():boolean {
        var scoreA:number = 0;
        var scoreX:number = 0;
        var scoreComplet:boolean = true;

        console.log("Calcul du score");
        for(var i = 0; i < SessionAppli.listeParties.length; i++) {
            if(SessionAppli.listeParties[i].scoreAX != "") {
                switch(SessionAppli.listeParties[i].scoreAX) {
                    case "0-0": // joueurs A et X forfaits
                    break;
                    case "0-2": // forfait joueur A
                        scoreX = scoreX + 2;
                    break;
                    case "1-2": // victoire joueur X
                        scoreA = scoreA + 1;
                        scoreX = scoreX + 2;
                    break;
                    case "2-1": // victoire joueur A
                        scoreA = scoreA + 2;
                        scoreX = scoreX + 1;
                    break;
                    case "2-0": // forfait joueur X
                        scoreA = scoreA + 2;
                    break;
                    default:
                        console.log("Score incorrect :" + SessionAppli.listeParties[i].desc + SessionAppli.listeParties[i].scoreAX);
                }
            } else {
                console.log(SessionAppli.listeParties[i].desc + SessionAppli.listeParties[i].scoreAX);
                scoreComplet = false;
            }
        }
        SessionAppli.scoreA = scoreA;
        SessionAppli.scoreX = scoreX;
        SessionAppli.score = scoreA.toString() + "-" + scoreX.toString();

        return scoreComplet;
    }

    // encode les doubles en JSON
    public static DoublestoJSon(doubles:Array<string>, numClub:number):string {
        let json:string = '{"club":"' + numClub.toString() + '", "doubles":[';

        for(let i=0; i < doubles.length; i++) {
            if(i>0) json = json + ', ';
            json = json + '{"double":"' + doubles[i] + '"}'
        }
        json = json + ']}';
        return json;
    }

    // convertit un message json en compo de doubles
    public static JsonToDoubles (json:string, cote:boolean) {
        let data;
        // analyse du JSON en entrée
        data = JSON.parse(json);

        let numClub:number = data.club;
        let attendu = cote ? SessionAppli.clubX.id : SessionAppli.clubA.id;
        if(numClub == attendu) {
            let iDouble = 0;
            // chercher les doubles dans la liste des parties
            for(let p=0; p < SessionAppli.listeParties.length; p++) {
                if(!SessionAppli.listeParties[p].simple) {
                    // compléter la compo du double de la session avec le double saisi
                    // si ce sont les doubles X, on complète après vs
                    let finA:number=SessionAppli.listeParties[p].desc.search(" vs ");
                    if(cote) {
                        SessionAppli.listeParties[p].desc = SessionAppli.listeParties[p].desc.substr(0, finA + 4) + data.doubles[iDouble].double + " = ";
                    } else {
                        SessionAppli.listeParties[p].desc = "#" + data.doubles[iDouble].double + " vs " + SessionAppli.listeParties[p].desc.substr(finA + 5);
                    }
                } else {
                }
            }
        } else {
            console.log("Le club n°" + numClub.toString() + " n'est pas celui attendu");
        }

    }



    // encode l'équipe en JSON
    public static EquipetoJSon(equipe:Array<EltListeLicencie>, numClub:number, licCapitaine: number, formule:number):string {
        var json:string='{"club":"';

        json = json + numClub.toString() + '", "equipe":[';

        for(var i=0; i < equipe.length; i++){
            if(i>0) json = json + ",";
            // ajouter chaque joueur : lettre + n° de licence seulement
            json = json + '{"place":"'  + equipe[i].place + '",';
            json = json + '"licence":"' + equipe[i].id + '",';
            json = json + '"nom":"'     + equipe[i].nom + '",';
            json = json + '"prenom":"'  + equipe[i].prenom + '",';
            json = json + '"cartons":"'  + equipe[i].cartons + '",';
            json = json + '"points":"'  + equipe[i].points + '"}';
        }
        json = json + '], "capitaine":"' + licCapitaine + '",';
        json = json + '"formule":"' + formule.toString() + '"}';

        console.log("Equipe json =" + json);

        return json;
    }

    // extrait le capitaine du json de l'équipe
    public static JsonToCapitaine(json:string):number {
        var data;

        data = JSON.parse(json);

        return Number(data.capitaine);
    }

    // extrait la formule du json de l'équipe
    public static JsonToFormule(json:string):number {
        var data;

        data = JSON.parse(json);

        return Number(data.formule);
    }


    // extrait le club du json de l'équipe
    public static JsonToClub(json:string):number {
        var data;

        data = JSON.parse(json);

        return Number(data.club);
    }


    // décode le JSON en équipe
    public static JsonToEquipe(json:string, club:number, coteAttendu:string):Array<EltListeLicencie> {
        let data;
        let equipe:Array<EltListeLicencie>=[];
        let cote : string;

        data = JSON.parse(json);

        // récupérer la formule avec l'équipe
        const numFormule:number = Number(data.formule);

        const f:FormuledeRencontre = ListeFormules.getFormule(numFormule);

        // controles
        if(data.club == club || club == null) {
            for(var i = 0; i < data.equipe.length; i++) {
                const place = data.equipe[i].place.charAt(0);

                // controle du coté
                console.log("Joueur" + i.toString());
                console.log("Cherche place=" + place);
                cote = f.coteDePlace(place);
                if (cote != coteAttendu && coteAttendu != null) {
                    console.log("!!! Ce n'est pas les doubles du coté attendu " + f.desc);
                    equipe = [];
                } else {
                    switch(cote){
                        case 'A' :
                        case 'X' :
                            // ajouter le joueur dans la liste
                            var  elt:EltListeLicencie = new EltListeLicencie();
                            elt.id = Number(data.equipe[i].licence);
                            elt.place = data.equipe[i].place;
                            elt.nom = data.equipe[i].nom;
                            elt.prenom = data.equipe[i].prenom;
                            elt.cartons = Number(data.equipe[i].cartons);
                            elt.points = Number(data.equipe[i].points);
                            equipe.push(elt);
                        break;
                        default :
                            // controle de la place dans la formule
                            console.log("!!! Place pas connue de la formule " + f.desc);
                            equipe = [];
                    }
                }
            }
        } else {
            console.log("!!! Club attendu " + club + " ; club lu : " + data.club);
            equipe = [];
        }
        return equipe;
    }

    private static CompleteFeuille(feuille:string, val:string, template:string):string {
        var rx:RegExp;

        rx = new RegExp(template, "g");
        if(val) {
            feuille = feuille.replace(rx, val);
        } else {
            feuille = feuille.replace(rx, "---");
        }

        return feuille;
    }

    // remplir la feuille de match avec les infos de la session et de la rencontre passée en paramètre
    public static RemplirLaFeuille(r:Rencontre) {

        var feuille:string;
        const f:FormuledeRencontre=ListeFormules.getFormule(SessionAppli.formule);

        console.log("Formule : " + f.id);

        // d'abord, mettre le score à jour
        this.MajScore();

        switch(Number(f.id)) {
            case 18:    // 4 x 4 simples + 2 doubles
                feuille = Feuille18.FeuilleVide();
            break;
            case 14:    // 4 x 3 simples  + 2 doubles
                feuille = Feuille14.FeuilleVide();
            break;
            case 5:     // 2 x 2 simples + 1 double
                feuille = Feuille5.FeuilleVide();
            break;
            default: console.log("!!!!!!! Formule " + SessionAppli.formule + " inconnue !!!!!!!!!");
                     return;
        }

        // remplacer les éléments dans la feuille

        // Juge Arbitre (nom, prénom, adresse)
        console.log("Juge arbitre ...");
        var ja:string="";
        if(SessionAppli.nomJA != "") {
            ja = SessionAppli.nomJA + " " + SessionAppli.prenomJA + " " + SessionAppli.adresseJA;
        }
        feuille = this.CompleteFeuille(feuille, ja, "#JA");

        console.log("Rencontre n°" + r.id);
        // Lieu de la rencontre
        feuille = this.CompleteFeuille(feuille, SessionAppli.lieu, "#Lieu");
        // Ligue
        feuille = this.CompleteFeuille(feuille, r.ligue, "#Ligue");
        // Date heure
        var date:string;
        var heure:string;
        date = SessionAppli.date.substr(0, SessionAppli.date.indexOf(" ")-1);
        feuille = this.CompleteFeuille(feuille, date, "#Date");
        heure = SessionAppli.date.substr(SessionAppli.date.indexOf(" ")+1);
        feuille = this.CompleteFeuille(feuille, heure, "#Heure");
        // Division
        feuille = this.CompleteFeuille(feuille, r.division, "#Division");
        // Poule
        feuille = this.CompleteFeuille(feuille, r.poule, "#Poule");
        // National
        // Régional
        // Départemental
        console.log("Echelon:", r.echelon);
        switch(r.echelon) {
            case 3 :
                feuille = this.CompleteFeuille(feuille, "Départemental", "#Départemental");
                feuille = this.CompleteFeuille(feuille, "-------------", "#Régional");
                feuille = this.CompleteFeuille(feuille, "-------------", "#National");
            break;
            case 2 :
                feuille = this.CompleteFeuille(feuille, "-------------", "#Départemental");
                feuille = this.CompleteFeuille(feuille, "Régional", "#Régional");
                feuille = this.CompleteFeuille(feuille, "-------------", "#National");
            break;
            case 1 :
                feuille = this.CompleteFeuille(feuille, "-------------", "#Départemental");
                feuille = this.CompleteFeuille(feuille, "-------------", "#Régional");
                feuille = this.CompleteFeuille(feuille, "National", "#National");
            break;
            default :
                feuille = this.CompleteFeuille(feuille, "Echelon inconnu", "#Départemental");
                feuille = this.CompleteFeuille(feuille, "???", "#Régional");
                feuille = this.CompleteFeuille(feuille, "???", "#National");
            break;
        }
        // Masculin
        feuille = this.CompleteFeuille(feuille, r.feminin ? "" : "Masculin", "#Masculin");
        // Féminin
        feuille = this.CompleteFeuille(feuille, r.feminin ? "Féminin" : "", "#Féminin");

        console.log("clubs...");
        // N° ClubA
        feuille = this.CompleteFeuille(feuille, SessionAppli.clubA.id.toString(), "#IdClubA");
        // Nom ClubA
        feuille = this.CompleteFeuille(feuille, SessionAppli.clubA.nom.toString(), "#NomClubA");

        // N° ClubX
        feuille = this.CompleteFeuille(feuille, SessionAppli.clubX.id.toString(), "#IdClubX");
        // Nom ClubX
        feuille = this.CompleteFeuille(feuille, SessionAppli.clubX.nom.toString(), "#NomClubX");

        console.log("joueurs...");
        // Joueurs
        feuille = SessionAppli.RemplitJoueurs(f.joueursA, SessionAppli.equipeA, feuille);
        feuille = SessionAppli.RemplitJoueurs(f.joueursX, SessionAppli.equipeX, feuille);

        // Parties
        console.log("parties...");
        var rx: RegExp;
        var iDouble = 0;
        const nbParties = (f.desc.length + 1)/3;
        var s:number;

        for(var p = 0; p < nbParties; p++) {
            s = 0;
            // si on a une partie jouée, on la note
            if(p < SessionAppli.listeParties.length) {
                // sets
                for(s = 0 ; s < SessionAppli.listeParties[p].sets.length; s++) {
                    feuille = this.CompleteFeuille(feuille, SessionAppli.listeParties[p].sets[s].score.toString(), "#P" + (p+1).toString() + "S" + (s+1).toString());
                }
            }
            // on complète les sets non joués avec des scores vides
            var nbSets = SessionAppli.nbSetsGagnants * 2 - 1;
            for(var n = s; n < nbSets; n++) {
                feuille = this.CompleteFeuille(feuille, "", "#P" + (p+1).toString() + "S" + (n+1).toString());
            }
            if(p < SessionAppli.listeParties.length) {
                // score équipe A
                feuille = this.CompleteFeuille(feuille, SessionAppli.listeParties[p].scoreAX.substr(0, 1), "#P" + (p+1).toString() + "SA");
                // score équipe X
                feuille = this.CompleteFeuille(feuille, SessionAppli.listeParties[p].scoreAX.substr(2, 1), "#P" + (p+1).toString() + "SX");

                // gestion des doubles : remplacer les intitulés
                if(!SessionAppli.listeParties[p].simple) {
                    iDouble++;
                    var doubles:string[] = SessionAppli.listeParties[p].desc.split(" vs ");
                    if(doubles[0]) {
                        feuille = this.CompleteFeuille(feuille, doubles[0].substr(1), "#Double" + (iDouble).toString() + "A");
                    }
                    if(doubles[1]) {
                        feuille = this.CompleteFeuille(feuille, doubles[1].substr(0, doubles[1].length - 1), "#Double" + (iDouble).toString() + "X");
                    }
                }

            } else {
                // score équipe A
                feuille = this.CompleteFeuille(feuille, "", "#P" + (p+1).toString() + "SA");
                // score équipe X
                feuille = this.CompleteFeuille(feuille, "", "#P" + (p+1).toString() + "SX");
                // gestion des doubles : remplacer les intitulés
                if(!SessionAppli.listeParties[p].simple) {
                    iDouble++;
                    feuille = this.CompleteFeuille(feuille, "", "#Double" + (iDouble).toString() + "A");
                    feuille = this.CompleteFeuille(feuille, "", "#Double" + (iDouble).toString() + "X");
                }
            }
        }

        console.log("Bilan...");
        // Score Equipe A
        feuille = this.CompleteFeuille(feuille, SessionAppli.scoreA.toString(), "#ScoreA");
        // Score Equipe X
        feuille = this.CompleteFeuille(feuille, SessionAppli.scoreX.toString(), "#ScoreX");
        // Nombre de réserves
        var nbR:number;
        nbR = (SessionAppli.reserveClubA == "" ? 0 : 1) + (SessionAppli.reserveClubX == "" ? 0 : 1);
        if(nbR > 0) {
            feuille = this.CompleteFeuille(feuille, nbR.toString(), "#NbRes");
        } else {
            feuille = this.CompleteFeuille(feuille, "---", "#NbRes");
        }
        // Nombre de réclamations
        nbR = (SessionAppli.reclamationClubA == "" ? 0 : 1) + (SessionAppli.reclamationClubX == "" ? 0 : 1);
        if(nbR > 0) {
            feuille = this.CompleteFeuille(feuille, nbR.toString(), "#NbRecl");
        } else {
            feuille = this.CompleteFeuille(feuille, "---", "#NbRecl");
        }
        // Nombre de cartons
        var nbC:number=0;
        console.log("Nb joueurs = " + SessionAppli.nbJoueurs);
        console.log("Nb joueurs eq A= " + SessionAppli.equipeA.length);
        console.log("Nb joueurs eq X= " + SessionAppli.equipeX.length);
        for(var i = 0; i < SessionAppli.nbJoueurs; i++) {
            if(SessionAppli.equipeA[i].cartons > 0) nbC++;
            if(SessionAppli.equipeX[i].cartons > 0) nbC++;
        }
        if(nbC>0) {
            feuille = this.CompleteFeuille(feuille, nbC.toString(), "#NbCart");
        } else {
            feuille = this.CompleteFeuille(feuille, "---", "#NbCart");
        }
        // RapportJA
        feuille = this.CompleteFeuille(feuille, SessionAppli.rapportJA == "" ? "NON" : "OUI", "#RapportJA");

        // CapitaineA
        if(SessionAppli.capitaineA) {
            feuille = this.CompleteFeuille(feuille, SessionAppli.capitaineA.nom + " " + SessionAppli.capitaineA.prenom, "#CapitaineA");
            // LicCapitaineA
            feuille = this.CompleteFeuille(feuille, SessionAppli.capitaineA.id.toString(), "#LicCapitaineA");
        } else {
            feuille = this.CompleteFeuille(feuille, "", "#CapitaineA");
            // LicCapitaineA
            feuille = this.CompleteFeuille(feuille, "", "#LicCapitaineA");
        }

        // CapitaineX
        if(SessionAppli.capitaineX) {
            feuille = this.CompleteFeuille(feuille, SessionAppli.capitaineX.nom + " " + SessionAppli.capitaineX.prenom, "#CapitaineX");
            // LicCapitaineX
            feuille = this.CompleteFeuille(feuille, SessionAppli.capitaineX.id.toString(), "#LicCapitaineX");
        } else {
            feuille = this.CompleteFeuille(feuille, "", "#CapitaineX");
            // LicCapitaineX
            feuille = this.CompleteFeuille(feuille, "", "#LicCapitaineX");
        }

        // Phase
        feuille = this.CompleteFeuille(feuille, r.phase.toString(), "#Phase");
        // Journée
        feuille = this.CompleteFeuille(feuille, r.journee.toString(), "#Journée");

        console.log("!!! Feuille remplie !!!");

        SessionAppli.feuilleDeMatch = feuille;
    }

    private static RemplitJoueurs(joueurs:string, equipe:EltListeLicencie[], feuille:string):string {

        var debut:number;
        var fin:number;
        var j:string;
        var rx: RegExp;

        for(var i = 0; i < equipe.length; i++) {
            j = joueurs.charAt(2*i);
            // Id
            feuille = this.CompleteFeuille(feuille, equipe[i].id.toString(), "#Id" + j);
            // NomPrenom
            feuille = this.CompleteFeuille(feuille, equipe[i].nom + " " + equipe[i].prenom, "#NomPrenom" + j);
            // Pts
            feuille = this.CompleteFeuille(feuille, equipe[i].points.toString(), "#Pts" + j);
            // MutEtr
            var m:string = (equipe[i].mute ? "M" : "") + (equipe[i].etranger ? "E" : "");
            feuille = this.CompleteFeuille(feuille, m, "#MutEtr" + j);
            // NbCart
            var c: string;
            var nbJ:number;
            var nbR:number;
            nbJ = equipe[i].cartons %10;
            nbR = Math.floor(equipe[i].cartons/10);
            c = (nbJ > 0 ? nbJ.toString() + " jaunes" : "") + (nbR > 0 ? nbR.toString() + " rouges" : "");
            feuille = this.CompleteFeuille(feuille, c, "#NbCart" + j);
        }
        return feuille;
    }


    // écrire sur disque
    public static Persiste() {

        let nbSessions:number=0;

        // vérifier si la table existe
        RespeqttDb.db.get("select count(*) from Session where ses_ren_kn = " + SessionAppli.rencontreChoisie).then(row => {
            nbSessions = Number(row[0]);
            if(nbSessions > 0) {
                console.log("Session trouvée en BDD");
                // update
                SessionAppli.MajSessionAppli();
            } else {
                // insert
                SessionAppli.CreeSessionAppli();
                }
        }, error => {
            console.log("création de la table Session");
            RespeqttDb.db.execSQL(RespeqttDb.creeTableSession).then(id => {
                console.log("Table Session créée");
                // insert
                SessionAppli.CreeSessionAppli();
            }, error2 => {
                console.log("Impossible de créer la table Session", error2);
            });
        });

    }

    // insère la session en BDD
    private static CreeSessionAppli() {
        var insert:string = `insert into Session (ses_ren_kn,
            ses_vn_recoitCoteX,
            ses_vn_clubChoisi,
            ses_va_titreRencontre,
            ses_clubA_kn,
            ses_clubX_kn,
            ses_capitaineA_kn,
            ses_capitaineX_kn,
            ses_vn_forfaitA,
            ses_vn_forfaitX,
            ses_vn_compoFigee,
            ses_vn_scoreValide,
            ses_va_reserveClubA,
            ses_va_reserveClubX,
            ses_va_reclamationClubA,
            ses_va_reclamationClubX,
            ses_va_rapportJA,
            ses_va_nomJA,
            ses_va_prenomJA,
            ses_va_adresseJA,
            ses_vn_licenceJA,
            ses_va_score,
            ses_vn_scoreA,
            ses_vn_scoreX,
            ses_va_feuilleDeMatch,
            ses_vn_modeRencontre,
            ses_vn_nbJoueurs,
            ses_vn_nbSetsGagnants,
            ses_vn_formule,
            ses_va_date,
            ses_va_lieu
            )`;
        var values:string;

        values = " values ("
               + SessionAppli.rencontreChoisie + ", "
               + bool2SQL(SessionAppli.recoitCoteX) + ", "
               + SessionAppli.clubChoisi + ", "
               + toSQL(SessionAppli.titreRencontre) + ", "
               + (SessionAppli.clubA ? SessionAppli.clubA.id : 0) + ", "
               + (SessionAppli.clubX ? SessionAppli.clubX.id : 0) + ", "
               + (SessionAppli.capitaineA ? SessionAppli.capitaineA.id : 0) + ", "
               + (SessionAppli.capitaineX ? SessionAppli.capitaineX.id : 0) + ", "
               + bool2SQL(SessionAppli.forfaitA) + ", "
               + bool2SQL(SessionAppli.forfaitX) + ", "
               + bool2SQL(SessionAppli.compoFigee) + ", "
               + bool2SQL(SessionAppli.scoreValide) + ", "
               + toSQL(SessionAppli.reserveClubA) + ", "
               + toSQL(SessionAppli.reserveClubX) + ", "
               + toSQL(SessionAppli.reclamationClubA) + ", "
               + toSQL(SessionAppli.reclamationClubX) + ", "
               + toSQL(SessionAppli.rapportJA) + ", "
               + toSQL(SessionAppli.nomJA) + ", "
               + toSQL(SessionAppli.prenomJA) + ", "
               + toSQL(SessionAppli.adresseJA) + ", "
               + SessionAppli.licenceJA + ", "
               + toSQL(SessionAppli.score) + ", "
               + SessionAppli.scoreA + ", "
               + SessionAppli.scoreX + ", "
               + toSQL(SessionAppli.feuilleDeMatch) + ", "
               + bool2SQL(SessionAppli.modeRencontre) + ", "
               + SessionAppli.nbJoueurs + ", "
               + SessionAppli.nbSetsGagnants + ", "
               + SessionAppli.formule + ", "
               + toSQL(SessionAppli.date) + ", "
               + toSQL(SessionAppli.lieu) + " "
                  + ") ";

        // insertion en BDD
        console.log(insert + values);
        RespeqttDb.db.execSQL(insert + values).then(id => {
            console.log("Session insérée en BDD");
            // insertion des équipes
            if(SessionAppli.equipeA) {
                Compo.PersisteEquipe(SessionAppli.rencontreChoisie, SessionAppli.equipeA, false);
            }
            if(SessionAppli.equipeX) {
                Compo.PersisteEquipe(SessionAppli.rencontreChoisie, SessionAppli.equipeX, true);

            }
            // insertion des parties
            if(SessionAppli.listeParties) {
                Partie.PersisteListeParties(SessionAppli.rencontreChoisie, SessionAppli.listeParties);
            }
        }, error => {
            console.log("Impossible d'insérer la session en BDD", error);
        });
    }

    // Met à jour la session en BDD
    private static MajSessionAppli() {
        var update:string = "update Session set "
            + "ses_vn_recoitCoteX = " + bool2SQL(SessionAppli.recoitCoteX) + ", "
            + "ses_vn_clubChoisi = " + SessionAppli.clubChoisi + ", "
            + "ses_va_titreRencontre = " + toSQL(SessionAppli.titreRencontre) + ", "
            + "ses_clubA_kn = " + SessionAppli.clubA.id + ", "
            + "ses_clubX_kn = "+ SessionAppli.clubX.id + ", "
            + "ses_capitaineA_kn = "+ (SessionAppli.capitaineA ? SessionAppli.capitaineA.id : 0) + ", "
            + "ses_capitaineX_kn = "+ (SessionAppli.capitaineX ? SessionAppli.capitaineX.id : 0) + ", "
            + "ses_vn_forfaitA = " + bool2SQL(SessionAppli.forfaitA) + ", "
            + "ses_vn_forfaitX = " + bool2SQL(SessionAppli.forfaitX) + ", "
            + "ses_vn_compoFigee = " + bool2SQL(SessionAppli.compoFigee) + ", "
            + "ses_vn_scoreValide = " + bool2SQL(SessionAppli.scoreValide) + ", "
            + "ses_va_reserveClubA = " + toSQL(SessionAppli.reserveClubA )+ ", "
            + "ses_va_reserveClubX = " + toSQL(SessionAppli.reserveClubX) + ", "
            + "ses_va_reclamationClubA = " + toSQL(SessionAppli.reclamationClubA) + ", "
            + "ses_va_reclamationClubX = " + toSQL(SessionAppli.reclamationClubX) + ", "
            + "ses_va_rapportJA = " + toSQL(SessionAppli.rapportJA) + ", "
            + "ses_va_nomJA = " + toSQL(SessionAppli.nomJA) + ", "
            + "ses_va_prenomJA = " + toSQL(SessionAppli.prenomJA) + ", "
            + "ses_va_adresseJA = " + toSQL(SessionAppli.adresseJA) + ", "
            + "ses_vn_licenceJA = " + SessionAppli.licenceJA + ", "
            + "ses_va_score = " + toSQL(SessionAppli.score) + ", "
            + "ses_vn_scoreA = " + SessionAppli.scoreA + ", "
            + "ses_vn_scoreX = " + SessionAppli.scoreX + ", "
            + "ses_va_feuilleDeMatch = " + toSQL(SessionAppli.feuilleDeMatch) + ", "
            + "ses_vn_modeRencontre = " + bool2SQL(SessionAppli.modeRencontre) + ", "
            + "ses_vn_nbJoueurs = " + SessionAppli.nbJoueurs + ", "
            + "ses_vn_nbSetsGagnants = " + SessionAppli.nbSetsGagnants + ", "
            + "ses_vn_formule = " + SessionAppli.formule + ", "
            + "ses_va_date = " + toSQL(SessionAppli.date) + ", "
            + "ses_va_lieu = " + toSQL(SessionAppli.lieu) + " "
            + "where ses_ren_kn = " + SessionAppli.rencontreChoisie;

        // màj en BDD
        console.log(update);
        RespeqttDb.db.execSQL(update).then(id => {
            console.log("Session mise à jour en BDD");
            // màj des équipes
            if(SessionAppli.equipeA.length > 0) {
                Compo.PersisteEquipe(SessionAppli.rencontreChoisie, SessionAppli.equipeA, false);
            }
            if(SessionAppli.equipeX.length > 0) {
                Compo.PersisteEquipe(SessionAppli.rencontreChoisie, SessionAppli.equipeX, true);

            }
            // màj des parties
            if(SessionAppli.listeParties.length > 0) {
                Partie.PersisteListeParties(SessionAppli.rencontreChoisie, SessionAppli.listeParties);
            }
        }, error => {
            console.log("Impossible de mettre à jour la session en BDD", error);
        });
    }

    // efface la session liée à la rencontre en BDD
    public static Efface(rencontre:number) {
        var del:string;

        // insertion en BDD
        console.log(del);
        del = "delete from Set_ren where set_ren_kn = " + rencontre;
        RespeqttDb.db.execSQL(del).then(id => {
            console.log("Sets de la rencontre " + rencontre + " effacés de la BDD");
            del = "delete from Partie where par_ren_kn = " + rencontre;
            RespeqttDb.db.execSQL(del).then(id => {
                console.log("Parties de la rencontre " + rencontre + " effacées de la BDD");
                del = "delete from Session where ses_ren_kn = " + rencontre;
                RespeqttDb.db.execSQL(del).then(id => {
                    console.log("Session de la rencontre " + rencontre + " effacée de la BDD");
                }, error => {
                    console.log("Impossible d'effacer la session de la rencontre " + rencontre + " en BDD", error);
                });
            }, error => {
                console.log("Impossible d'effacer la session de la rencontre " + rencontre + " en BDD", error);
            });
        }, error => {
            console.log("Impossible d'effacer la session de la rencontre " + rencontre + " en BDD", error);
        });
    }

    // Recharger depuis le disque
    public static RechargeSession(rencontre:number):boolean {
        var sql:string;

        // recharger la session
        sql = `select
            ses_vn_recoitCoteX,
            ses_vn_clubChoisi,
            ses_va_titreRencontre,
            ses_clubA_kn,
            ses_clubX_kn,
            ses_capitaineA_kn,
            ses_capitaineX_kn,
            ses_vn_forfaitA,
            ses_vn_forfaitX,
            ses_vn_compoFigee,
            ses_vn_scoreValide,
            ses_va_reserveClubA,
            ses_va_reserveClubX,
            ses_va_reclamationClubA,
            ses_va_reclamationClubX,
            ses_va_rapportJA,
            ses_va_nomJA,
            ses_va_prenomJA,
            ses_va_adresseJA,
            ses_vn_licenceJA,
            ses_va_score,
            ses_vn_scoreA,
            ses_vn_scoreX,
            ses_va_feuilleDeMatch,
            ses_vn_modeRencontre,
            ses_vn_nbJoueurs,
            ses_vn_nbSetsGagnants,
            ses_vn_formule,
            ses_va_date,
            ses_va_lieu
        from Session where ses_ren_kn = ` + rencontre;

        var clubA:number;
        var clubX:number;
        var capitaineA:number;
        var capitaineX:number;

        RespeqttDb.db.get(sql).then(row => {
            if(row) {
                SessionAppli.rencontreChoisie = rencontre;
                console.log("Chargement de la rencontre " + rencontre);
                SessionAppli.recoitCoteX = SQL2bool(Number(row[0]));
                console.log("coteX = " + SessionAppli.recoitCoteX.toString());
                SessionAppli.clubChoisi = Number(row[1]);
                console.log("club = " + SessionAppli.clubChoisi.toString());
                SessionAppli.titreRencontre = row[2];
                console.log("titre = " + SessionAppli.titreRencontre);
                clubA = Number(row[3]);
                console.log("clubA = " + clubA.toString());
                clubX = Number(row[4]);
                console.log("clubX = " + clubX.toString());
                capitaineA = Number(row[5]);
                console.log("capitaine A = " + capitaineA.toString());
                capitaineX = Number(row[6]);
                console.log("capitaine X = " + capitaineX.toString());
                SessionAppli.forfaitA = SQL2bool(Number(row[7]));
                console.log("forfaitA = " + SessionAppli.forfaitA.toString());
                SessionAppli.forfaitX = SQL2bool(Number(row[8]));
                console.log("forfaitX = " + SessionAppli.forfaitX.toString());
                SessionAppli.compoFigee = SQL2bool(Number(row[9]));
                console.log("compo figée = " + SessionAppli.compoFigee.toString());
                SessionAppli.scoreValide = SQL2bool(Number(row[10]));
                console.log("score validé = " + SessionAppli.scoreValide.toString());
                SessionAppli.reserveClubA = row[11];
                console.log("réserve A = " + SessionAppli.reserveClubA);
                SessionAppli.reserveClubX = row[12];
                console.log("réserve X = " + SessionAppli.reserveClubX);
                SessionAppli.reclamationClubA = row[13];
                console.log("reclam A = " + SessionAppli.reclamationClubA);
                SessionAppli.reclamationClubX = row[14];
                console.log("reclam X = " + SessionAppli.reclamationClubX);
                SessionAppli.rapportJA = row[15];
                console.log("rapport JA = " + SessionAppli.rapportJA);
                SessionAppli.nomJA = row[16];
                console.log("nom JA = " + SessionAppli.nomJA);
                SessionAppli.prenomJA = row[17];
                console.log("prénom JA = " + SessionAppli.prenomJA);
                SessionAppli.adresseJA = row[18];
                console.log("adresse JA = " + SessionAppli.adresseJA);
                SessionAppli.licenceJA = Number(row[19]);
                console.log("licenceJA = " + SessionAppli.licenceJA.toString());
                SessionAppli.score = row[20];
                console.log("score = " + SessionAppli.score);
                SessionAppli.scoreA = Number(row[21]);
                console.log("scoreA = " + SessionAppli.scoreA.toString());
                SessionAppli.scoreX = Number(row[22]);
                console.log("scoreX = " + SessionAppli.scoreX.toString());
                SessionAppli.feuilleDeMatch = row[23];
                console.log("feuille de match = " + SessionAppli.feuilleDeMatch);
                SessionAppli.modeRencontre = SQL2bool(Number(row[24]));
                SessionAppli.nbJoueurs = Number(row[25]);
                SessionAppli.nbSetsGagnants = Number(row[26]);
                SessionAppli.formule = Number(row[27]);
                SessionAppli.date = row[28];
                SessionAppli.lieu = row[29];


                // retrouver les clubs
                Club.getClub(clubA).then(c =>{
                    SessionAppli.clubA = c as Club;
                    Club.getClub(clubX).then(c2 =>{
                        SessionAppli.clubX = c2 as Club;
                    }, error2 => {
                        console.log("Impossible de trouver en BDD le club X : ", error2);
                        return false;
                    });
                }, error3 => {
                    console.log("Impossible de trouver en BDD le club A : ", error3);
                    return false;
                });
                // recharger les équipes
                Compo.RechargeEquipes(rencontre);

                // Retrouver les capitaines
                Licencie.get(capitaineA, 0).then(cA => {
                    SessionAppli.capitaineA = cA as EltListeLicencie;
                }, error3 => {
                    console.log("Impossible de trouver en BDD le capitaine A : ", error3);
                    return false;
                })
                Licencie.get(capitaineX, 0).then(cX => {
                    SessionAppli.capitaineX = cX as EltListeLicencie;
                }, error4 => {
                    console.log("Impossible de trouver en BDD le capitaine X : ", error4);
                    return false;
                })
                // recharger les parties
                Partie.RechargeParties(rencontre);
                // recharger les sets
                Set.RechargeSets(rencontre);
                alert("Rechargement de la rencontre sauvegardée.")

                return true;

             } else {
                 console.log("Pas de session en cours pour la rencontre " + rencontre + ".");
                 return false;
             }
        }, error => {
            console.log("Impossible de lire la session : en BDD", error);
            return false;
        });
        return false;
    }

    // RAZ la Session (sauf la liste des rencontres)
    public static Raz() {
                    // tout effacer dans la session sauf la liste des rencontres
                    SessionAppli.rencontreChoisie = -1;
                    SessionAppli.compoFigee = false;
                    SessionAppli.scoreValide = false;
                    SessionAppli.titreRencontre = "";
                    SessionAppli.clubA = null;
                    SessionAppli.clubX = null;
                    SessionAppli.capitaineA = null;
                    SessionAppli.capitaineX = null;
                    SessionAppli.clubChoisi = -1;
                    SessionAppli.equipeA = [];
                    SessionAppli.equipeX = [];
                    SessionAppli.forfaitA = false;
                    SessionAppli.forfaitX = false;
                    SessionAppli.listeParties = [];
                    SessionAppli.recoitCoteX = false;
                    SessionAppli.titreRencontre = "";
                    SessionAppli.listeParties=[];
                    SessionAppli.reserveClubA="";
                    SessionAppli.reserveClubX="";
                    SessionAppli.reclamationClubA="";
                    SessionAppli.reclamationClubX="";
                    SessionAppli.rapportJA="";
                    SessionAppli.nomJA="";
                    SessionAppli.prenomJA="";
                    SessionAppli.adresseJA="";
                    SessionAppli.licenceJA=0;
                    SessionAppli.score="";
                    SessionAppli.tab=0;
                    SessionAppli.modeRencontre=false;
                    SessionAppli.nbJoueurs=0;
                    SessionAppli.nbSetsGagnants=0;
                    SessionAppli.formule=0;
                    SessionAppli.date="";
                    SessionAppli.lieu="";
    }
}
