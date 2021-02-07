import { Component } from "@angular/core";
import { RespeqttDb } from "../db/dbRespeqtt";
import { Club, EltListeLicencie, Compo, Partie, Rencontre, EltListeRencontre, Set } from "../db/RespeqttDAO";
import { toSQL, bool2SQL, SQL2bool } from "../outils/outils";

import { Feuille18 } from "./feuille18";


export class SessionAppli {

    public static listeRencontres:Array<EltListeRencontre>=[];
    public static recoitCoteX = false;
    public static clubChoisi:number = -1;
    public static rencontreChoisie = -1;
    public static titreRencontre = "";
    public static rencontre:Rencontre=null;
    public static clubA:Club=null;
    public static clubX:Club=null;
    public static equipeA:Array<EltListeLicencie>=[];
    public static equipeX:Array<EltListeLicencie>=[];
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

    // encode l'équipe en JSON
    public static EquipetoJSon(equipe:Array<EltListeLicencie>, numClub:number):string {
        var json:string='{"club":"';

        json = json + numClub.toString() + '", "equipe":[';

        for(var i=0; i < equipe.length; i++){
            if(i>0) json = json + ",";
            // ajouter chaque joueur : lettre + n° de licence seulement
            json = json + '{"place":"'  + equipe[i].place + '",';
            json = json + '"licence":"' + equipe[i].id + '",';
            json = json + '"nom":"'     + equipe[i].nom + '",';
            json = json + '"prenom":"'  + equipe[i].prenom + '",';
            json = json + '"points":"'  + equipe[i].points + '"}';
        }
        json = json + ']}';

        console.log("Equipe json =" + json);

        return json;
    }

    // décode le JSON en équipe
    public static JsonToEquipe(json:string, rencontre:Rencontre, club:number, cote:boolean):Array<EltListeLicencie> {
        var data;
        var equipe:Array<EltListeLicencie>=[];

        data = JSON.parse(json);
        // controles
        if(data.club == club) {
            for(var i = 0; i < data.equipe.length; i++) {
                const codePlace = data.equipe[i].place.charCodeAt(0);
                if((cote && codePlace >= "Z".charCodeAt(0) - rencontre.nbJoueurs)
                || (!cote && codePlace < "A".charCodeAt(0) + rencontre.nbJoueurs)) {
                    // ajouter le joueur dans la liste
                    var  elt:EltListeLicencie = new EltListeLicencie();
                    elt.id = Number(data.equipe[i].licence);
                    elt.place = data.equipe[i].place;
                    elt.nom = data.equipe[i].nom;
                    elt.prenom = data.equipe[i].prenom;
                    elt.points = Number(data.equipe[i].points);
                    equipe.push(elt);
                } else {
                    console.log("!!! Place pas cohérente avec le côté " + (cote ? "X" : "A"));
                    equipe = [];
                }
            }
        } else {
            console.log("!!! Club attendu " + club + " ; club lu : " + data.club);
            equipe = [];
        }
        return equipe;
    }

    // remplir la feuille de match avec les infos de la session
    public static RemplirLaFeuille() {

        var feuille:string;

        switch(SessionAppli.rencontre.formule) {
            case 18:
                feuille = Feuille18.FeuilleVide();
            break;
            default: console.log("!!!!!!! Formule " + SessionAppli.rencontre.formule + " inconnue !!!!!!!!!");
        }

        // remplacer les éléments dans la feuille

        // Juge Arbitre (nom, prénom, adresse)
        var JA:string;
        if(SessionAppli.nomJA != "") {
            JA = SessionAppli.nomJA + " " + SessionAppli.prenomJA;
        }
        feuille = feuille.replace(/#JA/g, JA);
         SessionAppli.feuilleDeMatch = feuille;

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
            ses_va_feuilleDeMatch)`;
        var values:string;

        values = " values ("
               + SessionAppli.rencontreChoisie + ", "
               + bool2SQL(SessionAppli.recoitCoteX) + ", "
               + SessionAppli.clubChoisi + ", "
               + toSQL(SessionAppli.titreRencontre) + ", "
               + (SessionAppli.clubA ? SessionAppli.clubA.id : 0) + ", "
               + (SessionAppli.clubX ? SessionAppli.clubX.id : 0) + ", "
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
               + toSQL(SessionAppli.feuilleDeMatch) + ") ";

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
            + "ses_va_feuilleDeMatch = " + toSQL(SessionAppli.feuilleDeMatch) + " "
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
        var del:string = "delete from Session where ses_ren_kn = " + rencontre;

        // insertion en BDD
        console.log(del);
        RespeqttDb.db.execSQL(del).then(id => {
            console.log("Session de la rencontre " + rencontre + " effacée de la BDD");
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
            ses_va_feuilleDeMatch
        from Session where ses_ren_kn = ` + rencontre;

        var clubA:number;
        var clubX:number;

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
                SessionAppli.forfaitA = SQL2bool(Number(row[5]));
                console.log("forfaitA = " + SessionAppli.forfaitA.toString());
                SessionAppli.forfaitX = SQL2bool(Number(row[6]));
                console.log("forfaitX = " + SessionAppli.forfaitX.toString());
                SessionAppli.compoFigee = SQL2bool(Number(row[7]));
                console.log("compo figée = " + SessionAppli.compoFigee.toString());
                SessionAppli.scoreValide = SQL2bool(Number(row[8]));
                console.log("score validé = " + SessionAppli.scoreValide.toString());
                SessionAppli.reserveClubA = row[9];
                console.log("réserve A = " + SessionAppli.reserveClubA);
                SessionAppli.reserveClubX = row[10];
                console.log("réserve X = " + SessionAppli.reserveClubX);
                SessionAppli.reclamationClubA = row[11];
                console.log("reclam A = " + SessionAppli.reclamationClubA);
                SessionAppli.reclamationClubX = row[12];
                console.log("reclam X = " + SessionAppli.reclamationClubX);
                SessionAppli.rapportJA = row[13];
                console.log("rapport JA = " + SessionAppli.rapportJA);
                SessionAppli.nomJA = row[14];
                console.log("nom JA = " + SessionAppli.nomJA);
                SessionAppli.prenomJA = row[15];
                console.log("prénom JA = " + SessionAppli.prenomJA);
                SessionAppli.adresseJA = row[16];
                console.log("adresse JA = " + SessionAppli.adresseJA);
                SessionAppli.licenceJA = Number(row[17]);
                console.log("licenceJA = " + SessionAppli.licenceJA.toString());
                SessionAppli.score = row[18];
                console.log("score = " + SessionAppli.score);
                SessionAppli.scoreA = Number(row[19]);
                console.log("scoreA = " + SessionAppli.scoreA.toString());
                SessionAppli.scoreX = Number(row[20]);
                console.log("scoreX = " + SessionAppli.scoreX.toString());
                SessionAppli.feuilleDeMatch = row[21];
                console.log("feuille de match = " + SessionAppli.feuilleDeMatch);

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
                    SessionAppli.rencontre = null;
                    SessionAppli.rencontreChoisie = -1;
                    SessionAppli.compoFigee = false;
                    SessionAppli.scoreValide = false;
                    SessionAppli.titreRencontre = "";
                    SessionAppli.clubA = null;
                    SessionAppli.clubX = null;
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
    }
}
