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
import { Club, EltListeLicencie, Compo, Partie, Rencontre, EltListeRencontre, Set, Licencie, FormuledeRencontre, ListeFormules, Signature } from "../db/RespeqttDAO";
import { toSQL, bool2SQL, SQL2bool, toHTML, toURL } from "../outils/outils";

import { Feuille18 } from "./feuille18";    // championnat par équipes départemental Rhone etc
import { Feuille14 } from "./feuille14";    // championnat par équipes régional et national
import { Feuille5 }  from "./feuille5";     // coupe du Rhone

import { Verso }  from "./verso";           // verso de toutes les feuilles

export class SessionAppli {

    public static version = "ns8-1.093b";
    public static presentation:boolean = true;
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
    public static versoFeuille:string="";
    public static ptsParVictoire:number=2;
    public static domicile:number=-1;       // 0 = extérieur, 1 = domicile, -1 = pas encore choisi
    public static signatureA:string="PAS SIGNE";
    public static signatureX:string="PAS SIGNE";

    // divers
    public static animationAller:string = "slide";          // "explode", "fade",  "flipLeft", "flip", "slideRight", "slideTop", "slideBottom"
    public static animationRetour:string = "slideRight";

    // sleep
    public static delay(ms: number){
        return new Promise(resolve => setTimeout(resolve, ms));
        }

    // Mise à jour du score
    // renvoie true si toutes les parties ont été disputées, false sinon
    public static MajScore():boolean {
        let scoreA:number = 0;
        let scoreX:number = 0;
        let scoreComplet:boolean = true;

        console.log("Calcul du score");
        for(let i = 0; i < SessionAppli.listeParties.length; i++) {
            if(SessionAppli.listeParties[i].scoreAX != "") {
                switch(SessionAppli.listeParties[i].scoreAX) {
                    case "0-0": // joueurs A et X forfaits
                    break;
                    case "0-2": // forfait joueur A
                        scoreX = scoreX + 2;
                    break;
                    case "0-1": // victoire joueur X
                        scoreX = scoreX + 1;
                    break;
                    case "1-2": // victoire joueur X
                        scoreA = scoreA + 1;
                        scoreX = scoreX + 2;
                    break;
                    case "1-0": // victoire joueur A
                        scoreA = scoreA + 1;
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
        console.log("Attendu: cote " + (cote ? "X" : "A") + " club=" + attendu);
        if(numClub == attendu) {
            let iDouble = 0;
            // chercher les doubles dans la liste des parties
            for(let p=0; p < SessionAppli.listeParties.length; p++) {
                if(!SessionAppli.listeParties[p].simple) {
                    console.log("Trouvé double " + iDouble.toString() + " sur partie " + p.toString());
                    // compléter la compo du double de la session avec le double saisi
                    // si ce sont les doubles X, on complète après vs
                    let finA:number=SessionAppli.listeParties[p].desc.search(" vs ");
                    if(cote) {
                        SessionAppli.listeParties[p].desc = SessionAppli.listeParties[p].desc.substring(0, finA + 4) + data.doubles[iDouble].double + " = ";
                    } else {
                        SessionAppli.listeParties[p].desc = "#" + data.doubles[iDouble].double + " vs " + SessionAppli.listeParties[p].desc.substring(finA + 4);
                    }
                    iDouble++;
                } 
            }
        } else {
            console.log("Le club n°" + numClub.toString() + " n'est pas celui attendu");
        }

    }



    // encode l'équipe en JSON
    public static EquipetoJSon(equipe:Array<EltListeLicencie>, numClub:number, licCapitaine: number, formule:number):string {
        let json:string='{"club":"';

        json = json + numClub.toString() + '", "equipe":[';

        for(let i=0; i < equipe.length; i++){
            if(i>0) json = json + ",";
            // ajouter chaque joueur
            json = json + '{"place":"'  + equipe[i].place + '",';
            json = json + '"licence":"' + equipe[i].id + '",';
            json = json + '"nom":"'     + equipe[i].nom + '",';
            json = json + '"prenom":"'  + equipe[i].prenom + '",';
            json = json + '"cartons":"' + equipe[i].cartons + '",';
            json = json + '"points":"'  + equipe[i].points + '",';
            json = json + '"mute":"'    + (equipe[i].mute     ? "1" : "0") + '",';
            json = json + '"etranger":"'+ (equipe[i].etranger ? "1" : "0") + '",';
            json = json + '"feminin":"' + (equipe[i].feminin  ? "1" : "0") + '"}';
        }
        json = json + '], "capitaine":"' + licCapitaine + '",';
        json = json + '"formule":"' + formule.toString() + '"}';

        console.log("Equipe json =" + json);

        return json;
    }

    // extrait le capitaine du json de l'équipe
    public static JsonToCapitaine(json:string):number {
        let data;

        data = JSON.parse(json);

        return Number(data.capitaine);
    }

    // extrait la formule du json de l'équipe
    public static JsonToFormule(json:string):number {
        let data;

        data = JSON.parse(json);

        return Number(data.formule);
    }


    // extrait le club du json de l'équipe
    public static JsonToClub(json:string):number {
        let data;

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
            for(let i = 0; i < data.equipe.length; i++) {
                const place = data.equipe[i].place.charAt(0);

                // controle du coté
                console.log("Joueur" + i.toString());
                console.log("Cherche place=" + place);
                cote = f.coteDePlace(place);
                if (cote != coteAttendu && coteAttendu != null) {
                    console.log("!!! Ce n'est pas une place du coté attendu " + f.desc);
                    alert("L'équipe ne correspond pas au côté " + coteAttendu + " attendu");
                    equipe = [];
                    return equipe;
                } else {
                    switch(cote){
                        case 'A' :
                        case 'X' :
                            // ajouter le joueur dans la liste
                            let  elt:EltListeLicencie = new EltListeLicencie();
                            elt.id = Number(data.equipe[i].licence);
                            elt.place = data.equipe[i].place;
                            elt.nom = data.equipe[i].nom;
                            elt.prenom = data.equipe[i].prenom;
                            elt.cartons = Number(data.equipe[i].cartons);
                            elt.points = Number(data.equipe[i].points);
                            elt.mute = Number(data.equipe[i].mute) > 0;
                            elt.feminin = Number(data.equipe[i].feminin) > 0;
                            elt.etranger = Number(data.equipe[i].etranger) > 0;
                            equipe.push(elt);
                        break;
                        default :
                            // controle de la place dans la formule
                            console.log("!!! Place pas connue de la formule " + f.desc);
                            alert("La place " + place + " n'existe pas dans cette rencontre.");
                            equipe = [];
                    }
                }
            }
        } else {
            console.log("!!! Club attendu " + club.toString() + " ; club lu : " + data.club);
            alert("L'équipe ne fait pas partie du club attendu : " + club.toString());
            equipe = [];
            return equipe;
        }
        return equipe;
    }

    private static Encode(j:string):string {
        let s:string="";

        for(let i = 0; i < j.length; i++) {
            let c:string;
            switch(j.charAt(i)) {
                case '"' : c = ""; break;       // on supprime les ""
                case '{' : c = "N"; break;
                case ':' : c = "P"; break;
                case '[' : c = "Q"; break;
                case ']' : c = "R"; break;
                case '}' : c = "S"; break;
                case ',' : c = "T"; break;
                case '-' : c = "O"; break;
                default : c = j.charAt(i).toUpperCase();
            }
            s = s + c;
        }

        return s;
    }

    private static Decode(j:string):string {
        let s:string="";

        let c:string;
        let c0:string = "%";
        for(let i = 0; i < j.length; i++) {
            switch(j.charAt(i)) {
                case 'N' : c = "{"; break;
                case 'P' : c = ":"; break;
                case 'Q' : c = "["; break;
                case 'R' : c = "]"; break;
                case 'S' : c = "}"; break;
                case 'T' : c = ","; break;
                case 'O' : c = "-"; break;

                case 'G' : c = "parties"; break;
                case 'H' : c = "partie"; break;
                case 'I' : c = "desc"; break;
                case 'J' : c = "nbSets"; break;
                case 'K' : c = "sets"; break;
                case 'L' : c = "set"; break;
                case 'M' : c = "score"; break;
                default :  c = j.charAt(i);
            }
            // si on commence un texte ou un nombre ou si on en sort on met un "
            let an:boolean = c.match(/[A-Za-z0-9\-]/) != null;
            let an0:boolean = c0.match(/[A-Za-z0-9\-]/) != null;

//            console.log("c0="+c0+", c=" + c + ", an0=" + an0.toString() + ", an=" + an.toString());

            if( (!an0 && an) || (an0 && !an) ) {
                  s = s + '"';
            }
            s = s + c;
            c0 = c;
        }
        return s;
    }    

    public static ScoresToJSon ():string {
        let json:string = '{"G":[';
    
        // boucler sur les parties
        for(let i = 0; i< SessionAppli.listeParties.length; i++) {
            // encoder les / de la description
            let desc = ListeFormules.getFormule(SessionAppli.formule).desc.substring(i*3, i*3+2);
            // encoder les doubles avec les lettres de la compo
            let descPartie:string = SessionAppli.listeParties[i].desc;
            let compo:string="";
            if((desc=="11" || desc == "22") && descPartie.charAt(0) != "*") {
                let pos:number = descPartie.search("-");
                if(pos > 0) {
                    compo = descPartie.substring(pos-2, pos);
                    console.log("++ trouvé compo équipe double : " + compo);
                }
                let finPartie:string = descPartie.substring(pos+1);
                pos = finPartie.search("-");
                if(pos > 0) {
                    compo = compo + finPartie.substring(pos-2, pos);
                    console.log("++ trouvé compo double : " + compo);
                }
                desc = compo;
                console.log("++ compo double=" + compo);
            }
            // trop long
//            const desc = SessionAppli.listeParties[i].joueurA.toString() + "-" + SessionAppli.listeParties[i].joueurX.toString();
            json = json + '{"H":"' + i
            + '","I":"' + desc
            + '","J":"' + SessionAppli.listeParties[i].sets.length
            + '","K":[';
            // Coder le résultat des sets en JSON
            for(let j = 0; j < SessionAppli.listeParties[i].sets.length; j++) {
                if(j>0) json = json + ","
                json = json + '{"L":"' + j + '","M":"' + SessionAppli.listeParties[i].sets[j].score  + '"}';
            }
            json = json + ']}';
            if(i+1 < SessionAppli.listeParties.length) {
                json = json + ',';
            }
        }
        json = json + ']}';
        console.log("Json = " + json.length.toString() + " caractères");
        console.log("Json = " + json);
    
        return SessionAppli.Encode(json);
    }

    public static JSonToScores(s:string){
        // on décode ce qui est reçu pour le remettre en json
        let json:string = SessionAppli.Decode(s);
        console.log("json décodé=" + json);
        let data;

        // récupérer la formule de la rencontre
        let f:FormuledeRencontre = ListeFormules.getFormule(SessionAppli.formule);

        // analyse du JSON en entrée
        data = JSON.parse(json);
        console.log("data.parties.length="+ data.parties.length);
        SessionAppli.listeParties = [];
        for(let i = 0; i < data.parties.length; i++) {
            // reconstruire la description de la partie
            console.log("data.parties[" + i + "].desc="+ data.parties[i].desc);
            let partie:Partie = new Partie(f, data.parties[i].desc, SessionAppli.equipeA, SessionAppli.equipeX, SessionAppli.forfaitA, SessionAppli.forfaitX);
            
            let nbSetsA:number=0;
            let nbSetsX:number=0;
            console.log("data.parties[" + i + "].nbSets="+ data.parties[i].nbSets);
            for(let j=0; j < data.parties[i].nbSets; j++) {
                console.log("data.parties[" + i + "].sets["+j+"].score="+ data.parties[i].sets[j].score);
                // extraire les scores de chaque set et les affecter à la partie
                let set:Set = new Set(data.parties[i].sets[j].score);
                partie.sets.push(set);
                if(Set.AVainqueur(set.score)) {
                    nbSetsA++;
                }
                if(Set.XVainqueur(set.score)) {
                    nbSetsX++;
                }
           }
            // score de la partie
            // TODO : traiter les forfaits
            SessionAppli.scoreA=0;
            SessionAppli.scoreX=0;
            if(nbSetsA >= SessionAppli.nbSetsGagnants) {
                if(SessionAppli.ptsParVictoire == 1) {
                    partie.scoreAX = "1-0";
                } else {
                    partie.scoreAX = "2-1";
                }
                SessionAppli.scoreA++;
            } else {
                if(nbSetsX >= SessionAppli.nbSetsGagnants) {                
                    if(SessionAppli.ptsParVictoire == 1) {
                        partie.scoreAX = "0-1";
                    } else {
                        partie.scoreAX = "1-2";
                    }
                    SessionAppli.scoreX++;
                } else {
                    // pas encore joué
                    partie.scoreAX = ""; 
                }
            }
            SessionAppli.listeParties.push(partie);
        } 
    }

    private static CompleteFeuille(feuille:string, val:string, template:string):string {
        let rx:RegExp;

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

        let feuille:string;
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
        if(SessionAppli.nomJA != "") {
            feuille = this.CompleteFeuille(feuille, SessionAppli.nomJA + " " + SessionAppli.prenomJA, "#NomJA");
            feuille = this.CompleteFeuille(feuille, SessionAppli.licenceJA.toString(), "#LicJA");
            feuille = this.CompleteFeuille(feuille, SessionAppli.adresseJA, "#AdresseJA");
        } else {
            feuille = this.CompleteFeuille(feuille, "(pas de Juge Arbitre)", "#NomJA");
            feuille = this.CompleteFeuille(feuille, "", "#LicJA");
            feuille = this.CompleteFeuille(feuille, "", "#AdresseJA");
            }

        console.log("Rencontre n°" + r.id);
        // Lieu de la rencontre
        feuille = this.CompleteFeuille(feuille, SessionAppli.lieu, "#Lieu");
        // Ligue
        feuille = this.CompleteFeuille(feuille, r.ligue, "#Ligue");
        // Date heure
        let date:string;
        let heure:string;
        date = SessionAppli.date.substring(0, SessionAppli.date.indexOf(" ")-1);
        feuille = this.CompleteFeuille(feuille, date, "#Date");
        heure = SessionAppli.date.substring(SessionAppli.date.indexOf(" ")+1);
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
        let rx: RegExp;
        let iDouble = 0;
        const nbParties = (f.desc.length + 1)/3;
        let s:number;

        for(let p = 0; p < nbParties; p++) {
            s = 0;
            // si on a une partie jouée, on la note
            if(p < SessionAppli.listeParties.length) {
                // sets
                for(s = 0 ; s < SessionAppli.listeParties[p].sets.length; s++) {
                    feuille = this.CompleteFeuille(feuille, SessionAppli.listeParties[p].sets[s].score.toString(), "#P" + (p+1).toString() + "S" + (s+1).toString());
                }
            }
            // on complète les sets non joués avec des scores vides
            let nbSets = SessionAppli.nbSetsGagnants * 2 - 1;
            for(let n = s; n < nbSets; n++) {
                feuille = this.CompleteFeuille(feuille, "", "#P" + (p+1).toString() + "S" + (n+1).toString());
            }
            if(p < SessionAppli.listeParties.length) {
                // score équipe A
                feuille = this.CompleteFeuille(feuille, SessionAppli.listeParties[p].scoreAX.substring(0, 1), "#P" + (p+1).toString() + "SA");
                // score équipe X
                feuille = this.CompleteFeuille(feuille, SessionAppli.listeParties[p].scoreAX.substring(2, 3), "#P" + (p+1).toString() + "SX");

                // gestion des doubles : remplacer les intitulés
                if(!SessionAppli.listeParties[p].simple) {
                    iDouble++;
                    console.log("Double : " + SessionAppli.listeParties[p].desc);
                    let doubles:string[] = SessionAppli.listeParties[p].desc.split(" vs ");
                    if(doubles[0]) {
                        // enlever le # au début
                        feuille = this.CompleteFeuille(feuille, doubles[0].substring(1), "#Double" + (iDouble).toString() + "A");
                    }
                    if(doubles[1]) {
                        // enlever le = à la fin
                        feuille = this.CompleteFeuille(feuille, doubles[1].substring(0, doubles[1].length - 1), "#Double" + (iDouble).toString() + "X");
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
        let nbR:number;
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
        let nbC:number=0;
        console.log("Nb joueurs = " + SessionAppli.nbJoueurs);
        console.log("Nb joueurs eq A= " + SessionAppli.equipeA.length);
        console.log("Nb joueurs eq X= " + SessionAppli.equipeX.length);
        for(let i = 0; i < SessionAppli.nbJoueurs; i++) {
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
            // Signature Capitaine A
            if(SessionAppli.signatureA.length < 40) {
                feuille = this.CompleteFeuille(feuille, "NON SIGNEE", "#SignatureA");
            } else {
                feuille = this.CompleteFeuille(feuille, "*** SIGNEE ***", "#SignatureA");
            }
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
            // Signature Capitaine X
            if(SessionAppli.signatureX.length < 40) {
                feuille = this.CompleteFeuille(feuille, "NON SIGNEE", "#SignatureX");
            } else {
                feuille = this.CompleteFeuille(feuille, "*** SIGNEE ***", "#SignatureX");
            }
        } else {
            feuille = this.CompleteFeuille(feuille, "", "#CapitaineX");
            // LicCapitaineX
            feuille = this.CompleteFeuille(feuille, "", "#LicCapitaineX");
            // Signature Capitaine X
            if(SessionAppli.signatureX == "NON SIGNE") {
                feuille = this.CompleteFeuille(feuille, "NON SIGNEE", "#SignatureX");
            } else {
                feuille = this.CompleteFeuille(feuille, "*** SIGNEE ***", "#SignatureX");
            }
        }

        // Phase
        feuille = this.CompleteFeuille(feuille, r.phase.toString(), "#Phase");
        // Journée
        feuille = this.CompleteFeuille(feuille, r.journee.toString(), "#Journée");

        console.log("!!! Feuille remplie !!!");

        SessionAppli.feuilleDeMatch = feuille;

        // Remplir le verso
        let verso:string = Verso.FeuilleVide();

        // Cartons
        let nbCartons:number = 1;
        for(let i = 0; i < SessionAppli.nbJoueurs; i++) {
            if(SessionAppli.equipeA[i].cartons > 0) {
                verso = this.Cartons(verso, SessionAppli.equipeA[i], SessionAppli.clubA, nbCartons);
                nbCartons++;
            }
            if(SessionAppli.equipeX[i].cartons > 0) {
                verso = this.Cartons(verso, SessionAppli.equipeX[i], SessionAppli.clubX, nbCartons);
                nbCartons++;
            }
        }
        for(let i = nbCartons; i < 10; i++) {
            verso = this.Cartons(verso, null, null, i);
        }

        // JA et capitaines
        // Juge Arbitre (nom, prénom, adresse)
        console.log("Juge arbitre ...");
        if(SessionAppli.nomJA != "") {
            verso = this.CompleteFeuille(verso, SessionAppli.nomJA + " " + SessionAppli.prenomJA, "#NomJA");
            verso = this.CompleteFeuille(verso, SessionAppli.licenceJA.toString(), "#LicJA");
        } else {
            verso = this.CompleteFeuille(verso, "(pas de Juge Arbitre)", "#NomJA");
            verso = this.CompleteFeuille(verso, "", "#LicJA");
        }

        console.log("Capitaines ...");
        if(!SessionAppli.capitaineA) console.log(" pas de capitaine A");
        if(!SessionAppli.capitaineX) console.log(" pas de capitaine X");

        verso = this.CompleteFeuille(verso, SessionAppli.capitaineA.nom + " " + SessionAppli.capitaineA.prenom, "#CapitaineA");
        verso = this.CompleteFeuille(verso, SessionAppli.capitaineA.id.toString(), "#LicCapitaineA");
        verso = this.CompleteFeuille(verso, SessionAppli.capitaineX.nom + " " + SessionAppli.capitaineX.prenom, "#CapitaineX");
        verso = this.CompleteFeuille(verso, SessionAppli.capitaineX.id.toString(), "#LicCapitaineX");

        console.log("Signatures ...");
        // Signature Capitaine A
        console.log("Signatures au verso");
        if(SessionAppli.signatureA.length < 40) {
            verso = this.CompleteFeuille(verso, "NON SIGNEE", "#SignatureA");
        } else {
            verso = this.CompleteFeuille(verso, "*** SIGNEE ***", "#SignatureA");
            console.log("Signature A");
        }

        // Signature Capitaine X
        if(SessionAppli.signatureX.length < 40) {
            verso = this.CompleteFeuille(verso, "NON SIGNEE", "#SignatureX");
        } else {
            verso = this.CompleteFeuille(verso, "*** SIGNEE ***", "#SignatureX");
            console.log("Signature X");
        }

        // Réserves et Réclamation
        let nRetR:number = 0;
        if(SessionAppli.reserveClubA != "") {
            nRetR++;
            verso = this.CompleteFeuille(verso, SessionAppli.reserveClubA, "#Re" + nRetR.toString());

        }
        if(SessionAppli.reserveClubX != "") {
            nRetR++;
            verso = this.CompleteFeuille(verso, SessionAppli.reserveClubX, "#Re" + nRetR.toString());

        }
        if(SessionAppli.reclamationClubA != "") {
            nRetR++;
            verso = this.CompleteFeuille(verso, SessionAppli.reclamationClubA, "#Re" + nRetR.toString());

        }
        if(SessionAppli.reclamationClubX != "") {
            nRetR++;
            verso = this.CompleteFeuille(verso, SessionAppli.reclamationClubX, "#Re" + nRetR.toString());

        }
        for(let i=nRetR; i < 10; i++) {
            verso = this.CompleteFeuille(verso, "", "#Re" + i.toString());
        }

        // Rapport du JA
        let liRap:number = 1;
        if(SessionAppli.rapportJA != "") {
            let debut:number = 0;
            let finLigne:number = SessionAppli.rapportJA.search(/\n/);
            if(finLigne < 0) finLigne = SessionAppli.rapportJA.length;
            let li:string = SessionAppli.rapportJA.substring(debut, finLigne-1);
            verso = this.CompleteFeuille(verso, toHTML(li), "#Rap" + liRap.toString());
            while(finLigne >= 0 && liRap < 9) {
                liRap++;
                debut = finLigne;
                finLigne = SessionAppli.rapportJA.search(/\n/);
                li = SessionAppli.rapportJA.substring(debut+1, finLigne-1);
                verso = this.CompleteFeuille(verso, toHTML(li), "#Rap" + liRap.toString());
            }
            // dernière ligne (si on a déjà 8 lignes, on met le reste du rapport dans la 9e)
            li = SessionAppli.rapportJA.substring(debut+1, SessionAppli.rapportJA.length);
            verso = this.CompleteFeuille(verso, toHTML(li), "#Rap" + liRap.toString());
        }
        for(let i=liRap; i < 10; i++) {
            verso = this.CompleteFeuille(verso, "", "#Rap" + i.toString());
        }

        SessionAppli.versoFeuille = verso;
    }

    private static Cartons(verso:string, joueur:EltListeLicencie, club:Club, i:number):string {
        if(joueur == null) {
            verso = this.CompleteFeuille(verso, "", "#CJ" + i.toString());
            verso = this.CompleteFeuille(verso, "", "#CClub" + i.toString());
            verso = this.CompleteFeuille(verso, "" , "#CJaune" + i.toString());
            verso = this.CompleteFeuille(verso, "" , "#CJR1." + i.toString());
            verso = this.CompleteFeuille(verso, "" , "#CJR2." + i.toString());
            verso = this.CompleteFeuille(verso, "" , "#CRouge" + i.toString());
            verso = this.CompleteFeuille(verso, "" , "#MotifC" + i.toString());
        } else {
            let nbJaunes = joueur.cartons % 10;
            let nbRouges = joueur.cartons / 10;
            console.log(joueur.nom + " " + joueur.prenom + "=" + nbJaunes.toString() + " jaunes et " + Math.floor(nbRouges).toString()  + " rouges");
            if(nbJaunes > 0) {
                verso = this.CompleteFeuille(verso, joueur.nom + " " + joueur.prenom, "#CJ" + i.toString());
                verso = this.CompleteFeuille(verso, club.nom , "#CClub" + i.toString());
                verso = this.CompleteFeuille(verso, "" , "#MotifC" + i.toString());
                switch(nbJaunes){
                    case 1 : // 1 jaune
                    verso = this.CompleteFeuille(verso, "OUI" , "#CJaune" + i.toString());
                    verso = this.CompleteFeuille(verso, "" , "#CJR1." + i.toString());
                    verso = this.CompleteFeuille(verso, "" , "#CJR2." + i.toString());
                    break;
                    case 0 :
                    break;
                    case 2 : // 2 jaunes
                    verso = this.CompleteFeuille(verso, "" , "#CJaune" + i.toString());
                    verso = this.CompleteFeuille(verso, "OUI" , "#CJR1." + i.toString());
                    verso = this.CompleteFeuille(verso, "" , "#CJR2." + i.toString());
                    break;
                    default : // > 3 jaunes ou plus
                    verso = this.CompleteFeuille(verso, "" , "#CJaune" + i.toString());
                    verso = this.CompleteFeuille(verso, "" , "#CJR1." + i.toString());
                    verso = this.CompleteFeuille(verso, "OUI" , "#CJR2." + i.toString());
                }
            }
            if(nbRouges >= 1) {
                verso = this.CompleteFeuille(verso, "" , "#MotifC" + i.toString());
                verso = this.CompleteFeuille(verso, joueur.nom + " " + joueur.prenom, "#CJ" + i.toString());
                verso = this.CompleteFeuille(verso, club.nom , "#CClub" + i.toString());
                verso = this.CompleteFeuille(verso, "" , "#CJaune" + i.toString());
                verso = this.CompleteFeuille(verso, "" , "#CJR1." + i.toString());
                verso = this.CompleteFeuille(verso, "" , "#CJR2." + i.toString());
            verso = this.CompleteFeuille(verso, "OUI" , "#CRouge" + i.toString());
            } else {
                verso = this.CompleteFeuille(verso, "" , "#CRouge" + i.toString());
            }
    }
        return verso;
    }

    private static RemplitJoueurs(joueurs:string, equipe:EltListeLicencie[], feuille:string):string {

        let j:string;

        for(let i = 0; i < equipe.length; i++) {
            j = joueurs.charAt(2*i);
            // Id
            feuille = this.CompleteFeuille(feuille, equipe[i].id.toString(), "#Id" + j);
            // NomPrenom
            feuille = this.CompleteFeuille(feuille, equipe[i].nom + " " + equipe[i].prenom, "#NomPrenom" + j);
            // Pts
            feuille = this.CompleteFeuille(feuille, equipe[i].points.toString(), "#Pts" + j);
            // MutEtr
            let m:string = (equipe[i].mute ? "M" : "") + (equipe[i].etranger ? "E" : "");
            feuille = this.CompleteFeuille(feuille, m, "#MutEtr" + j);
            // NbCart
            let c: string;
            let nbJ:number;
            let nbR:number;
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

        let promise = new Promise(function(resolve, reject) {
            // vérifier si la table existe
            RespeqttDb.db.get("select count(*) from Session where ses_ren_kn = " + SessionAppli.rencontreChoisie).then(row => {
                nbSessions = Number(row[0]);
                if(nbSessions > 0) {
                    console.log("Session trouvée en BDD");
                    // update
                    SessionAppli.MajSessionAppli().then(cr => {
                        resolve(SessionAppli);
                    }, error => {
                        console.log("Impossible de persister la session :" + error);
                    });
                } else {
                    // insert
                    SessionAppli.CreeSessionAppli().then(cr => {
                        resolve(SessionAppli);
                    }, error => {
                        console.log("Impossible de persister la session :" + error);
                    });
                }
            }, error => {
                console.log("création de la table Session");
                RespeqttDb.db.execSQL(RespeqttDb.creeTableSession).then(id => {
                    console.log("Table Session créée");
                    // insert
                    SessionAppli.CreeSessionAppli().then(cr => {
                        resolve(SessionAppli);
                    }, error => {
                        console.log("Impossible de persister la session :" + error);
                    });
                }, error2 => {
                    console.log("Impossible de créer la table Session", error2);
                    reject(error2);
                });
            });
        });
        return promise;        
    }

    // insère la session en BDD
    private static CreeSessionAppli() {
        let insert:string = `insert into Session (ses_ren_kn,
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
            ses_va_lieu,
            ses_va_verso,
            ses_vn_points_victoire,
            ses_vn_domicile,
            ses_va_signatureA,
            ses_va_signatureX
            )`;
        let values:string;

        let promise = new Promise(function(resolve, reject) {
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
                + toSQL(SessionAppli.lieu) + ", "
                + toSQL(SessionAppli.versoFeuille) + ", "
                + SessionAppli.ptsParVictoire + ", "
                + SessionAppli.domicile + ", "
                +  toSQL(SessionAppli.signatureA) + ", "
                +  toSQL(SessionAppli.signatureX) + " "
                    + ") ";

            // insertion en BDD
            console.log(insert);
            console.log(values);
            RespeqttDb.db.execSQL(insert + values).then(id => {
                console.log("Session insérée en BDD");
                // insertion des équipes
                if(SessionAppli.equipeA.length > 0) {
                    Compo.PersisteEquipe(SessionAppli.rencontreChoisie, SessionAppli.equipeA, false);
                    console.log("Equipe A persistée : " + SessionAppli.equipeA.length + " joueurs");
                    if(SessionAppli.equipeX.length > 0) {
                        Compo.PersisteEquipe(SessionAppli.rencontreChoisie, SessionAppli.equipeX, true);
                        console.log("Equipe X persistée : " + SessionAppli.equipeX.length + " joueurs");
                        // insertion des parties
                        if(SessionAppli.listeParties.length > 0) {
                            Partie.PersisteListeParties(SessionAppli.rencontreChoisie, SessionAppli.listeParties);
                            // écriture des sets en BDD
                            Set.PersisteSets(SessionAppli.rencontreChoisie, SessionAppli.listeParties);
                                console.log("Liste parties persistée");
                        }
                    } else {
                        // insertion des parties
                        if(SessionAppli.listeParties.length > 0) {
                            Partie.PersisteListeParties(SessionAppli.rencontreChoisie, SessionAppli.listeParties);
                            // écriture des sets en BDD
                            Set.PersisteSets(SessionAppli.rencontreChoisie, SessionAppli.listeParties);
                            console.log("Liste parties persistée");
                        } 
                    }     
                } else {
                    if(SessionAppli.equipeX.length > 0) {
                        Compo.PersisteEquipe(SessionAppli.rencontreChoisie, SessionAppli.equipeX, true);
                        console.log("Equipe X persistée");
                        // insertion des parties
                        if(SessionAppli.listeParties.length > 0) {
                            Partie.PersisteListeParties(SessionAppli.rencontreChoisie, SessionAppli.listeParties)
                            // écriture des sets en BDD
                            Set.PersisteSets(SessionAppli.rencontreChoisie, SessionAppli.listeParties);
                            console.log("Liste parties persistée");
                        }
                    } else {
                        // insertion des parties
                        if(SessionAppli.listeParties.length > 0) {
                            Partie.PersisteListeParties(SessionAppli.rencontreChoisie, SessionAppli.listeParties);
                            // écriture des sets en BDD
                            Set.PersisteSets(SessionAppli.rencontreChoisie, SessionAppli.listeParties);
                            console.log("Liste parties persistée");
                        }     
                    }
                }
                resolve(SessionAppli); 
            }, error => {
                console.log("Impossible d'insérer la session en BDD", error);
                reject(error);
            });
        });
        return promise;
    }

    // Met à jour la session en BDD
    private static MajSessionAppli() {
        let update:string = "update Session set "
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
                            + "ses_va_lieu = " + toSQL(SessionAppli.lieu) + ", "
                            + "ses_va_verso = " + toSQL(SessionAppli.versoFeuille) + ", "
                            + "ses_vn_points_victoire = " + SessionAppli.ptsParVictoire + ", "
                            + "ses_vn_domicile = " + SessionAppli.domicile + ", "
                            + "ses_va_signatureA = " + toSQL(SessionAppli.signatureA) + ", "
                            + "ses_va_signatureX = " + toSQL(SessionAppli.signatureX) + " "
                            + "where ses_ren_kn = " + SessionAppli.rencontreChoisie;

        let promise = new Promise(function(resolve, reject) {
            // màj en BDD
            console.log(update);
            RespeqttDb.db.execSQL(update).then(id => {
                console.log("Session mise à jour en BDD");
                // màj des équipes
                if(SessionAppli.equipeA.length > 0) {
                    Compo.PersisteEquipe(SessionAppli.rencontreChoisie, SessionAppli.equipeA, false);
                    if(SessionAppli.equipeX.length > 0) {
                        Compo.PersisteEquipe(SessionAppli.rencontreChoisie, SessionAppli.equipeX, true);
                        // màj des parties
                        if(SessionAppli.listeParties.length > 0) {
                            Partie.PersisteListeParties(SessionAppli.rencontreChoisie, SessionAppli.listeParties);
                            // écriture des sets en BDD
                            Set.PersisteSets(SessionAppli.rencontreChoisie, SessionAppli.listeParties);
                            resolve(SessionAppli);
                        } else {
                            resolve(SessionAppli); 
                        }
                    }
                } else {
                    if(SessionAppli.equipeX.length > 0) {
                        Compo.PersisteEquipe(SessionAppli.rencontreChoisie, SessionAppli.equipeX, true);
                        // màj des parties
                        if(SessionAppli.listeParties.length > 0) {
                            Partie.PersisteListeParties(SessionAppli.rencontreChoisie, SessionAppli.listeParties);
                            // écriture des sets en BDD
                            Set.PersisteSets(SessionAppli.rencontreChoisie, SessionAppli.listeParties);
                            resolve(SessionAppli);
                        } else {
                            resolve(SessionAppli); 
                        }
                } else {
                        // màj des parties
                        if(SessionAppli.listeParties.length > 0) {
                            Partie.PersisteListeParties(SessionAppli.rencontreChoisie, SessionAppli.listeParties);
                            // écriture des sets en BDD
                            Set.PersisteSets(SessionAppli.rencontreChoisie, SessionAppli.listeParties);
                            resolve(SessionAppli);
                        } else {
                            resolve(SessionAppli); 
                        }
            }
                }
            }, error => {
                reject(error);
            });
        });
        return promise;
    }

    // efface la session liée à la rencontre en BDD
    public static Efface(rencontre:number) {
        let del:string;

        let promise = new Promise(function(resolve, reject) {        
            // insertion en BDD
            console.log(del);
            del = "delete from Set_ren where set_ren_kn = " + rencontre;
            RespeqttDb.db.execSQL(del).then(id => {
                console.log("Sets de la rencontre " + rencontre + " effacés de la BDD");
                del = "delete from Partie where par_ren_kn = " + rencontre;
                RespeqttDb.db.execSQL(del).then(id => {
                    console.log("Parties de la rencontre " + rencontre + " effacées de la BDD");
                    del = "delete from compo where cpo_ren_kn = " + rencontre;
                    RespeqttDb.db.execSQL(del).then(id => {
                        console.log("Composition des équipes de la rencontre " + rencontre + " effacée de la BDD");
                        del = "delete from Session where ses_ren_kn = " + rencontre;
                        RespeqttDb.db.execSQL(del).then(id => {
                            console.log("Session de la rencontre " + rencontre + " effacée de la BDD");
                            resolve(true);
                        }, error => {
                            console.log("Impossible d'effacer la session de la rencontre " + rencontre + " en BDD", error);
                            reject(error);
                        });
                    }, error => {
                        console.log("Impossible d'effacer la composition des équipes de la rencontre " + rencontre + " en BDD", error);
                        reject(error);
                    });
                }, error => {
                    console.log("Impossible d'effacer la session de la rencontre " + rencontre + " en BDD", error);
                    reject(error);
                });
            }, error => {
                console.log("Impossible d'effacer la session de la rencontre " + rencontre + " en BDD", error);
                reject(error);
            });
        });
        return promise;
    }

    // Recharger depuis le disque
    public static RechargeSession(rencontre:number):boolean {
        let sql:string;

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
            ses_va_lieu,
            ses_va_verso,
            ses_vn_domicile,
            ses_vn_points_victoire,
            ses_va_signatureA,
            ses_va_signatureX
        from Session where ses_ren_kn = ` + rencontre;

        let clubA:number;
        let clubX:number;
        let capitaineA:number;
        let capitaineX:number;

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
                SessionAppli.versoFeuille = row[30];
                SessionAppli.domicile = Number(row[31]);
                SessionAppli.ptsParVictoire = Number(row[32]);
                SessionAppli.signatureA = row[33];
                SessionAppli.signatureX = row[34];

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
                    SessionAppli.versoFeuille="";
                    SessionAppli.domicile = -1;
                    SessionAppli.ptsParVictoire = 2;
                    SessionAppli.signatureA = "PAS SIGNE";
                    SessionAppli.signatureX = "PAS SIGNE";
    }
}
