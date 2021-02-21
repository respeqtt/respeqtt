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
import { textAlignmentProperty } from "@nativescript/core";
import { RespeqttDb } from "../db/dbRespeqtt";
import { SessionAppli} from "../session/session";
import { bool2SQL, SQL2bool, toSQL, toURL, URLtoString, URLtoStringSansQuote } from "../outils/outils";

export class EltListeRencontre {
    id:number;
    journee:number;
    division:string;
    date:string;
    sel:boolean;
}

export class Rencontre{

    // attributs en BDD
    id:number;
    club1: number;
    club2: number;
    date:string;
    phase:number;
    journee:number;
    nbJoueurs:number;
    formule:number;
    nbSets:number;
    echelon:string;
    feminin:boolean;
    division:string;
    ligue:string;
    poule:string;

    // liste des rencontres
    public static liste:Array<any>;

    // renvoie la liste des rencontres en BDD pour affichage sur la page des rencontres
    public static getListe() {
        var liste:Array<any>;
        var n:number;
        // requêtes SQL
        var selListe:string = "select ren_kn, ren_va_division, ren_vn_journee, ren_vd_date from Rencontre";

        let promise = new Promise(function(resolve, reject) {

            RespeqttDb.db.all(selListe).then(rows => {
                liste = [];
                n = 0;
                for(var row in rows) {
                    var elt = new EltListeRencontre;
                    elt.id = Number(rows[row][0]);
                    console.log("li" + n, "id=" + elt.id + "/" + rows[row][0]);
                    elt.division = rows[row][1];
                    console.log("li" + n, "division=" + elt.division + "/" + rows[row][1]);
                    elt.journee = Number(rows[row][2]);
                    console.log("li" + n, "journee=" + elt.journee + "/" + rows[row][2]);
                    elt.date = rows[row][3];
                    console.log("li" + n, "date=" + elt.date + "/" + rows[row][3]);
                    elt.sel= false;
                    liste.push(elt);
                    n = n + 1;
                }
                console.log(n + " rencontres lues");
                resolve(liste);
            }, error => {
                reject(error);
            });
        });
        return promise;
    }

    // simulation, à remplacer par SPID
    public static SIM_LoadListe():void {

        // création de 3 clubs
        var sqlClub =`insert into Club (clu_kn, clu_va_nom) values (`;

        let clubs= [
            `1690162, 'Valenc''In Pierre TT')`,
            `1690221, 'Val d''Ozon TT')`,
            `1690160, 'PL Lyon 3 Villette Paul Bert')`
        ];

        // création des rencontres
        let sqlRen=`insert into Rencontre (ren_kn, ren_club1_kn, ren_club2_kn, ren_vd_date, ren_vn_phase, ren_vn_journee,
            ren_vn_nb_joueurs, ren_for_kn, ren_vn_nb_sets, ren_vn_echelon, ren_vn_feminin,
            ren_va_division, ren_va_ligue, ren_va_poule) values (`;
       let rencontres = [
           `1, 1690162, 1690221, '2020/11/08 09H00', 1, 4, 4, 18, 3, 3, 0, 'PR', 'AURA', 'D')`,
           `2, 1690162, 1690160, '2020/11/08 09H00', 1, 4, 4, 18, 3, 3, 0, 'D1', 'AURA', 'B')`
       ];

        for (var j in clubs) {
            RespeqttDb.db.execSQL(sqlClub + clubs[j]).then(id => {
                console.log("Club " + clubs[j] + " inséré");
                }, error => {
                    console.log("ECHEC INSERT Club " + error.toString());
                });
        }
        for (var j in rencontres) {
            RespeqttDb.db.execSQL(sqlRen + rencontres[j]).then(id => {
                console.log("Rencontre " + rencontres[j] + " insérée");
                }, error => {
                    console.log("ECHEC INSERT Rencontre " + error.toString());
                });
        }
    }

     // renvoie la rencontre complete
     public static getRencontre(id:number) {
        const select = `select ren_club1_kn, ren_club2_kn, ren_vd_date, ren_vn_phase, ren_vn_journee, ren_vn_nb_joueurs,
                            ren_for_kn, ren_vn_nb_sets, ren_vn_echelon, ren_vn_feminin, ren_va_division, ren_va_ligue, ren_va_poule
                        from Rencontre
                        where ren_kn = `
                     + id.toString();

        let promise = new Promise(function(resolve, reject) {
            RespeqttDb.db.get(select).then(row => {
                if(row) {
                    var rencontre = new Rencontre;

                    rencontre.id = id;
                    rencontre.club1= Number(row[0]);
                    rencontre.club2 = Number(row[1]);
                    rencontre.date= row[2];
                    rencontre.phase= Number(row[3]);
                    rencontre.journee= Number(row[4]);
                    rencontre.nbJoueurs= Number(row[5]);
                    rencontre.formule= Number(row[6]);
                    rencontre.nbSets= Number(row[7]);
                    rencontre.echelon= row[10];
                    rencontre.feminin= Boolean(row[11]);
                    rencontre.division= row[12];
                    rencontre.ligue= row[13];
                    rencontre.poule= row[14];

                    resolve(rencontre);
                }
                else {
                    resolve("Pas trouvé la rencontre " + id.toString());
                }
            }, error => {
                reject(error);
            });
        });
        return promise;
    }

     // renvoie la description d'une rencontre  pour affichage
     public static getDescriptionRencontre(num:number) {
        const select = `select ren_va_division || ren_va_poule || ' ' || c1.clu_va_nom || ' vs ' ||  c2.clu_va_nom from Rencontre
                        join Club c1 on (c1.clu_kn = ren_club1_kn)
                        join Club c2 on (c2.clu_kn = ren_club2_kn)
                        where ren_kn = `
                     + num.toString();

        let promise = new Promise(function(resolve, reject) {
            RespeqttDb.db.get(select).then(row => {
                if(row) {
                    resolve(row[0]);
                }
                else {
                    resolve("Pas trouvé la rencontre " + num.toString());
                }
            }, error => {
                reject(error);
            });
        });
        return promise;
    }


};

export class EltListeClub {
    numero:number;
    nom:string;
}

export class Club{

    // attributs en BDD
    id:number;
    nom:string;

    // requêtes SQL
    private static selListe = "select clu_kn, clu_va_nom from Club";

    // liste des clubs
    public static liste:Array<any>;

     // renvoie la liste en BDD des clubs  pour affichage sur la page des clubs
    public static getListe() {
        var liste:Array<any>;
        var n:number;
        let promise = new Promise(function(resolve, reject) {

            RespeqttDb.db.all(Club.selListe).then(rows => {
                liste = [];
                n = 0;
                for(var row in rows) {
                    var elt = new EltListeClub;
                    elt.numero = Number(rows[row][0]);
                    console.log("club" + n, "num=" + elt.numero + "/" + rows[row][0]);
                    elt.nom = rows[row][1];
                    console.log("club" + n, "nom=" + elt.nom + "/" + rows[row][1]);
                    liste.push(elt);
                    n = n + 1;
                }
                console.log(n + " clubs lus");
                resolve(liste);
            }, error => {
                reject(error);
            });
        });
        return promise;
    }

     // renvoie la description d'un club  pour affichage
     public static getClub(id:number) {
        const select = "select clu_va_nom from Club where clu_kn = " + id.toString();
        let promise = new Promise(function(resolve, reject) {
            RespeqttDb.db.get(select).then(row => {
                if(row) {
                    var club = new Club;
                    club.id = id;
                    club.nom = row[0];
                    resolve(club);
                }
                else {
                    resolve("(pas de club sélectionné)");
                }
            }, error => {
                reject(error);
            });
        });
        return promise;
    }

     // renvoie la description d'un club  pour affichage
     public static getDescriptionClub(num:number) {
        const select = "select clu_va_nom from Club where clu_kn = " + num.toString();
        let promise = new Promise(function(resolve, reject) {
            RespeqttDb.db.get(select).then(row => {
                if(row) {
                    resolve(num.toString() + " " + row[0]);
                }
                else {
                    resolve("(pas de club sélectionné)");
                }
            }, error => {
                reject(error);
            });
        });
        return promise;
    }

};

export class EltListeLicencie {
    id:number;
    nom:string;
    prenom:string;
    points:number;
    mute:boolean;
    etranger:boolean;
    feminin:boolean;
    sel:boolean;
    place:string;
    double:number;

}
export class Licencie{
    // attributs
    id:number;
    nom:string;
    prenom:string;
    points:number;
    mute:boolean;
    etranger:boolean;
    feminin:boolean;

    // requêtes SQL
    private static selListe = "select lic_kn, lic_va_nom, lic_va_prenom, lic_vn_points, lic_vn_mute, lic_vn_etranger, lic_vn_feminin from Licencie";

    // liste des licencies
    public static liste:Array<any>;


    // renvoie la liste en BDD des joueurs du club demandé pour affichage sur la page des joueurs
    public static getListe(clubId:number) {
        var liste:Array<any>;
        var n:number;
        let where = " where lic_clu_kn=" + clubId.toString();
        let promise = new Promise(function(resolve, reject) {
            RespeqttDb.db.all(Licencie.selListe + where).then(rows => {
                liste = [];
                n = 0;
                for(var row in rows) {
                    var elt = new EltListeLicencie;
                    elt.id = Number(rows[row][0]);
                    console.log("li" + n, "id=" + elt.id + "/" + rows[row][0]);
                    elt.nom = rows[row][1];
                    elt.prenom = rows[row][2];
                    elt.points = Number(rows[row][3]);
                    elt.mute = Boolean(rows[row][4]);
                    elt.etranger = Boolean(rows[row][5]);
                    elt.feminin = Boolean(rows[row][6]);
                    elt.sel = false;
                    liste.push(elt);
                    n = n + 1;
                }
                console.log(n + " licenciés lus");
               resolve(liste);
            }, error => {
                reject(error);
            });

        });

        return promise;
    }

    // simulation, à remplacer par SPID
    public static SIM_LoadListe():void {
        // création des joueurs
        let sql=`insert into Licencie (lic_clu_kn, lic_kn, lic_va_nom, lic_va_prenom, lic_vn_points,
            lic_vn_mute, lic_vn_etranger, lic_vn_feminin) values (`;
        let joueurs= [
            `1690162, 690101, 'GAUZY', 'Sylvain', 880, 0, 0, 0)`,
            `1690162, 690102, 'SECRETIN', 'Jean', 990, 0, 0, 0)`,
            `1690162, 690103, 'GATIEN', 'Jean-Pierre', 770, 1, 0, 0)`,
            `1690162, 690104, 'GASNIER', 'Laurine', 660, 0, 0, 1)`,
            `1690162, 690105, 'ZHEN DONG', 'Lin', 770, 1, 1, 0)`,

            `1690221, 690201, 'ROBERT', 'Marcel', 1088, 0, 0, 0)`,
            `1690221, 690202, 'MICHON', 'Alexandre', 550, 0, 0, 0)`,
            `1690221, 690203, 'PIERRE', 'Jacques', 789, 1, 0, 0)`,
            `1690221, 690204, 'ANDRE', 'Christophe', 654, 0, 0, 0)`,
            `1690221, 690205, 'MARTIN', 'Charlotte', 1234, 1, 1, 1)`
        ];

        for (var j in joueurs) {
            RespeqttDb.db.execSQL(sql + joueurs[j]).then(id => {
                console.log("Joueur " + joueurs[j] + " inséré");
                }, error => {
                    console.log("ECHEC INSERT joueur " + error.toString());
                });
        }
    }
};

export class Partie{
    id:number;                  // clé
    joueurA:number;             // numéro de licence joueur de l'équipe A ; 2 numéros séparés par la virgule pour les doubles
    joueurX:number;             // numéro de licence joueur de l'équipe X
    simple:boolean;             // VRAI si c'est un simple
//    score:number;               // 2 si A a gagné, 1 si X a gagné, -2 si X forfait, -1 si A forfait, 0 si pas joué
    scoreAX:string="";             // score de A et X séparé par un -
    sets:Array<Set>=[];         // liste des sets disputés
    desc:string;                // description pour la liste
    sel:boolean;                // sélection si dans une liste

    // crée la liste des parties
    static InitListeParties(eqA:Array<EltListeLicencie>, eqX:Array<EltListeLicencie>, forfaitA:boolean, forfaitX:boolean):Array<Partie> {
        var liste:Array<Partie>=[];

        // récuperer la formule
        Formule.getFormule(SessionAppli.formule).then(f=> {
            const formule = f as Formule;
            var n:number;   // nombre de parties
            var partie:Partie;

            // mettre en forme les parties
            n = formule.getNbParties();
            console.log("Nb parties=" + n);
            for(var i:number=0; i < SessionAppli.nbJoueurs; i++) {
                console.log("J" + (i+1) + " A = " + (forfaitA ? "(forfait)" : eqA[i].nom) + "/ J" + (i+1) + " X = " + (forfaitX ? "(forfait)" : eqX[i].nom));
            }
            for(var i:number = 0; i<n; i++) {
                partie = new Partie(formule.getPartie(i+1), eqA, eqX, forfaitA, forfaitX);
                liste.push(partie);
            }
        },error =>{
            console.log("Impossible de trouver la formule " + SessionAppli.formule.toString());
        });

        return liste;
    }

    // crée une partie à partir de son modèle p (ex : AW) et des deux équipes
    // p vide -> partie créée vide
    constructor(p:string, eqA:Array<EltListeLicencie>, eqX:Array<EltListeLicencie>, forfaitA:boolean, forfaitX:boolean) {

        var joueur:EltListeLicencie;

        if(p != ""){
            // pas sélectionnée
            this.sel = false;
            // description = A/nom prénom vs X/nom prénom = points
            this.desc = p.charAt(0) + "/";
            console.log(p);
            if(p.charCodeAt(0) < 65) {
                // c'est un double
                this.desc = "*** double" + this.desc + " *** = ";
                // mettre le score en cas de forfait
                if(forfaitA && !forfaitX) {
                    this.scoreAX = "0-2";
                }
                if(forfaitX && !forfaitA) {
                    this.scoreAX = "2-0";
                }
                if(forfaitA && forfaitX) {
                    this.scoreAX = "0-0";
                }
            } else {
                // c'est un simple
                // coté A
                if(!forfaitA) {
                    joueur = eqA[p.charCodeAt(0)-65];
                    console.log("Rang A =" + (p.charCodeAt(0)-65));
                    this.desc = this.desc + joueur.nom + " " + joueur.prenom + " vs ";
                    this.joueurA = joueur.id;
                }
                // coté X
                if(!forfaitX) {
                    this.desc = this.desc + p.charAt(1) + "/";
                    console.log("Rang X =" + (p.charCodeAt(1)-87));
                    joueur = eqX[p.charCodeAt(1)-87];
                    this.desc = this.desc + joueur.nom + " " + joueur.prenom + " = ";
                    this.joueurX = joueur.id;
                }
                // mettre le score en cas de forfait
                if(forfaitA || eqA[p.charCodeAt(0)-65].nom == "(absent)") {
                    this.scoreAX = "0-2";
                }
                if(forfaitX || eqX[p.charCodeAt(1)-87].nom == "(absent)") {
                    this.scoreAX = "2-0";
                }

                // corriger si double forfait
                if((forfaitA && eqX[p.charCodeAt(1)-87].nom == "(absent)")
                || (forfaitX && eqA[p.charCodeAt(0)-65].nom == "(absent)")
                || (eqX[p.charCodeAt(1)-87].nom == "(absent)" && eqA[p.charCodeAt(0)-65].nom == "(absent)")
                ) {
                    this.scoreAX = "0-0";
                }
            }
        }
    }

    // met à jour le score des parties disputées ; renvoie TRUE si le score est valide
    setScore(result:Array<Set>, nbSets:number):boolean {
        let ptsA:number = 0;
        let ptsX:number = 0;

        // on efface toute saisie précédente
        this.sets=[];

        // cas des parties disputées
        for(var i=0; i < result.length; i++) {
            // si X gagne 11-0 => -99
            if(result[i].score < 0) {
                ptsX++;
            } else {
                ptsA++;
            }
            // compléter le set
            result[i].numSet = i;
            // mémoriser le set
            this.sets.push(result[i]);
            console.log("nbsets à jouer = ", nbSets);
            // vérifier que si un joueur a gagné il n'y a pas de set à suivre
            if((ptsA == nbSets || ptsX == nbSets) && i+1 < result.length) {
                console.log("!!! Score incorrect : des sets ont été joués après le résultat acquis");
                console.log("ptsA=" + ptsA + ", ptsX=" + ptsX + ", i+1=" + (i+1) + ", length=" + result.length);
                return false;
            }
        }
        // vérifier que le bon nombre de sets ont été joués
        console.log(nbSets + " sets gagnants / " + nbSets + " joués");
        if (ptsA < nbSets && ptsX < nbSets) {
            console.log("!!! Score incomplet : aucun joueur n'a remporté " + nbSets + " sets");
            return false;
        }
        if (ptsA > nbSets) {
            console.log("!!! Score incorrect : le joueur coté A a remporté plus de sets (" + ptsA + ") que nécessaire :" + nbSets);
            return false;
        }
        if (ptsX > nbSets) {
            console.log("!!! Score incorrect : le joueur coté X a remporté plus de sets (" + ptsX + ") que nécessaire :" + nbSets);
            return false;
        }
        if(ptsA > ptsX) {
            this.scoreAX = "2-1";
            // mettre à jour la description
            console.log("desc:" + this.desc + "; pos = :"+ this.desc.search("=") + "; debut:" + this.desc.substr(0, this.desc.search("=")));
            // this.desc = this.desc.substr(0, this.desc.search("=") + 1) + "2-1";
        } else {
            this.scoreAX = "1-2";
            // mettre à jour la description
            // this.desc = this.desc.substr(0, this.desc.search("=") + 1) + "1-2";
        }
        console.log("Partie=" + this.desc);
        return true;
    }

    ScoreToJSon (numPartie:number, numRencontre:number):string {
        var json:string;

        // début
        // encoder les / de la description
        const desc = toURL(SessionAppli.listeParties[numPartie].desc);
        json = '{"rencontre":"' + numRencontre
             +  '", "partie":"' + numPartie
             + '", "desc":"' + desc
             + '", "nbsets":"' + SessionAppli.nbSetsGagnants
             + '", "res": [';

        // Coder le résultat des sets en JSON
        for(var i = 0; i < this.sets.length; i++) {
            if(i>0) json = json + ","
            json = json + '{"set": "' + i + '", "score": "' + this.sets[i].score  + '"}';
        }
        json = json + ']}';

        return json;
    }

/*
    // convertit un message json en partie ; renvoie l'indice de la partie
    PartieToJson(iPartie:number):string {
        var json:string;

        // début
        json = '{"partie":"' + iPartie.toString()
             +  '", "desc":"' + SessionAppli.listeParties[iPartie].desc
             + '", "joueurA":"' + SessionAppli.listeParties[iPartie].joueurA.toString()
             + '", "joueurX":"' + SessionAppli.listeParties[iPartie].joueurX.toString()
             + '"}';

            return json;
    }
*/

    // convertit un message json en partie ; renvoie l'indice de la partie
    JsonToPartie (json:string):number {
        var data;
        var ok:boolean=true;

        // analyse du JSON en entrée
        data = JSON.parse(json);
        // récupérer le n° de la partie
        var iPartie:number = Number(data.partie);
        // contrôler la description
        // décoder les / de la description
        const desc = URLtoStringSansQuote(data.desc);


        if(iPartie >= 0 && iPartie < 30) {
            // on crée assez de parties pour avoir celle que l'on veut
            for(var i=SessionAppli.listeParties.length; i < iPartie+1 ; i++) {
                var p:Partie = new Partie("", null, null, false, false);
                SessionAppli.listeParties.push(p);
            }
            // analyse du JSON en entrée
            data = JSON.parse(json);
            SessionAppli.listeParties[iPartie].desc = desc;
            SessionAppli.listeParties[iPartie].joueurA = data.joueurA;
            SessionAppli.listeParties[iPartie].joueurX = data.joueurX;
            SessionAppli.nbSetsGagnants = data.nbsets;
        } else {
            console.log("Numéro de partie incorrect : " + data.partie);
            ok = false;
        }


        // si tout s'est bien passé on retourne le numéro de partie, sinon -1
        if(ok) {
            return data.partie;
        } else {
            return -1;
        }
    }

    // convertit un message json en score d'une partie
    public static JsonToScore (json:string):number {
        var data;
        var iPartie:number = -1;

        // analyse du JSON en entrée
        data = JSON.parse(json);
        iPartie = Number(data.partie);
        // décoder les / de la description
        const desc = URLtoStringSansQuote(data.desc);

        // controles
        if( iPartie >= 0 && data.res.length>0 && SessionAppli.listeParties[iPartie].desc == desc) {
            // mémoriser les sets
            var listeSets:Array<Set>=[];
            var s:Set;
            console.log(data.res.length.toString() + " sets dans le scan");
            for(var i=0; i < data.res.length; i++) {
                s = new Set(data.res[i].score);
                listeSets.push(s);
            }
            // mettre à jour les sets et le score de la partie
            SessionAppli.listeParties[iPartie].setScore(listeSets, SessionAppli.nbSetsGagnants);
            // consigner les réclamations
            if(data.reclamA != "") {
                SessionAppli.reclamationClubA = SessionAppli.reclamationClubA + "\n Partie n°" + data.num + ": " + data.reclamA;
            }
            if(data.reclamX != "") {
                SessionAppli.reclamationClubX = SessionAppli.reclamationClubX + "\n Partie n°" + data.num + ": " + data.reclamX;
            }
            return iPartie;
        } else {
            console.log("Ce n'est pas le résultat de la partie ou de la rencontre attendue");
            return -1;
        }
    }

    // écrit une partie d'une rencontre en BDD ; essaie update, si ne marche pas essaie insert
    private static PersistePartie(rencontre:number, partie:Partie, rang:number) {
        var update:string;
        var insertP: string  = `insert into Partie (par_ren_kn, par_vn_num, par_va_desc,
                               par_vn_jouA, par_vn_jouX, par_vn_double, par_va_score) values (`;
        var insertS: string  = "insert into Set_ren (set_par_kn, set_vn_num, set_vn_score) values (";
        var values:string;

        // détection des doubles
        var double:boolean = partie.joueurA > 0 ? false : true;
        update = "update Partie set par_va_desc = " + toSQL(partie.desc) + ", "
        + "par_vn_jouA = " + (double ? 0 : partie.joueurA) + ", "
        + "par_vn_jouX = " + (double ? 0 : partie.joueurX) + ", "
        + "par_vn_double = " + bool2SQL(double) + ", "
        + "par_va_score = " + toSQL(partie.scoreAX) + " "
        + "where par_ren_kn = " + rencontre
        + " and par_vn_num = " + rang;

        console.log(update);
        RespeqttDb.db.execSQL(update).then(n => {
            if(n > 0) {
                console.log("Partie " + rang + " mise à jour en BDD");
            } else {
                // la partie n'existe pas => insert
                values = rencontre + ", "
                        + rang + ", "
                        + toSQL(partie.desc) + ", "
                        + (double ? 0 : partie.joueurA) + ", "
                        + (double ? 0 : partie.joueurX) + ", "
                        + bool2SQL(double) + ", "
                        + toSQL(partie.scoreAX) + ")";

                RespeqttDb.db.execSQL(insertP + values).then(id => {
                    console.log("Partie " + rang + " | " + insertP + values);
                }, error2 => {
                    console.log("Echec insertion dans la table Partie ", error2);
                });
            }
        }, error => {
            console.log("Echec update dans la table Partie ", error);
        });
    }

    // écrit la liste des parties d'une rencontre en BDD ; essaie update, si ne marche pas essaie insert
    public static PersisteListeParties(rencontre:number, parties:Array<Partie>) {

        // écriture de la liste des parties en BDD
        for(var i = 0; i < parties.length; i++) {
            Partie.PersistePartie(rencontre, parties[i], i);
        }

        // écriture des sets en BDD
        Set.PersisteSets(rencontre, parties);

    }

    // recharge les parties de la rencontre dans la session en cours
    public static RechargeParties(rencontre:number) {

        var sql:string = `select par_vn_num integer, par_va_desc,par_vn_jouA, par_vn_jouX, par_vn_double, par_va_score
              from Partie where par_ren_kn = ` + rencontre;
        RespeqttDb.db.all(sql).then(rows => {
            for(var row in rows) {
                var rang = Number(rows[row][0]);
                var elt:Partie = new Partie("", null, null, false, false);

                elt.id = rang;
                elt.desc = rows[row][1];
                elt.joueurA = Number(rows[row][2]);
                elt.joueurX = Number(rows[row][3]);
                elt.simple = !SQL2bool(Number(rows[row][4]));
                elt.scoreAX = rows[row][5];
                elt.sel = false;
                elt.sets = [];
                SessionAppli.listeParties.push(elt);

                console.log("partie relue (" + elt.id + ") = " + elt.desc + ", " + elt.joueurA + " vs " + elt.joueurX + " : "
                        + elt.scoreAX + " [" + (elt.simple ? "S":"D") + "]");
            }
        }, error => {
            console.log("Impossible de trouver en BDD les parties de la rencontre " + rencontre, error);
        });

    }

};


export class Set{
    numSet:number;
    score:number;

    constructor(res:number) {
        this.score = res;
    }

    // écrit un set d'une rencontre en BDD ; essaie update, si ne marche pas essaie insert
    private static PersisteSet(rencontre:number, partie:number, set:Set, rang:number) {
        var update:string;
        var values:string;
        var insert:string = `insert into Set_ren (set_ren_kn, set_par_kn, set_vn_num, set_vn_score) values (`;

        update = "update Set_ren set set_vn_score = " + set.score + " "
        + "where set_par_kn = " + partie
        + " and set_vn_num = " + rang
        + " and set_ren_kn = " + rencontre;

        console.log(update);
        RespeqttDb.db.execSQL(update).then(nSet => {
            if(nSet > 0) {
                    console.log("Set " + rang + " de la partie " + partie + " mis à jour en BDD");
            } else {
                // le set n'existe pas => insert
                values = rencontre + ", "
                    + partie + ", "
                    + rang + ", "
                    + set.score + ")";
                RespeqttDb.db.execSQL(insert + values).then(id => {
                console.log("Set " + rang + " de la partie " + partie + " inséré en BDD");
                }, error2 => {
                    console.log("Echec insertion dans la table Set_ren ", error2);
                });
            }
        }, error => {
            console.log("Echec update de la table Set_ren ", error);
        });

    }


    // écrit la liste des sets d'une rencontre en BDD ; essaie update, si ne marche pas essaie insert
    public static PersisteSets(rencontre:number, parties:Array<Partie>) {


        for(var i=0; i < parties.length; i++) {
            for(var j=0; j < parties[i].sets.length; j++) {
                Set.PersisteSet(rencontre, i, parties[i].sets[j], j);
            }
        }
    }

    // recharge les sets de la rencontre dans la session en cours
    public static RechargeSets(rencontre:number) {

        var sql:string = `select set_par_kn, set_vn_num, set_vn_score from Set_ren where set_ren_kn = ` + rencontre;
        RespeqttDb.db.all(sql).then(rows => {
            for(var row in rows) {
                var numPartie:number;
                var elt:Set = new Set(999);

                numPartie = Number(rows[row][0]);
                elt.numSet = rows[row][1];
                elt.score = Number(rows[row][2]);

                SessionAppli.listeParties[numPartie].sets.push(elt);
                console.log("set relu " + elt.numSet + " dans partie " + numPartie);
            }
        }, error => {
            console.log("Impossible de trouver en BDD les sets de la rencontre " + rencontre, error);
        });

    }

};

export class Formule{

    // attributs en BDD
    id:number;
    desc:string;

    // requêtes SQL
    private static selFormule = "select for_va_desc from Formule where for_kn = ";


    // chargement des formules
    public static LoadFormules():void {

        var sql =`insert into Formule (for_kn, for_va_desc) values (`;

        // formules
        let formules= [
            // 4 joueurs, complet
            "18, 'AW BX CY DZ AX BW DY CZ 11 22 DW CX AZ BY CW DX AY BZ')",
            // 2 joueurs, complet
            "5, 'AX BY 11 AY BX')"
        ];

        for (var j in formules) {
            RespeqttDb.db.execSQL(sql + formules[j]).then(id => {
                console.log("Formule " + formules[j] + " insérée");
                }, error => {
                    console.log("ECHEC INSERT Formule " + error.toString());
                });
        }
    }
    // renvoie les deux lettres (clubA + clubX) qui décrivent la partie
    // formule = description de la formule telle qu'en BDD
    // n = rang de la partie recherchée, à partir de 1
    public getPartie(n: number):string {
        const debut = (n-1)*3;
        const fin = debut + 2;
        return this.desc.substring(debut, fin);
    }

    // renvoie le nombre de parties
    public getNbParties():number {
        return (this.desc.length + 1)/3;
    }

    // renvoie la formule complete
    public static getFormule(id:number) {
        const select = Formule.selFormule + id.toString();

        let promise = new Promise(function(resolve, reject) {
            RespeqttDb.db.get(select).then(row => {
                if(row) {
                    var formule = new Formule;

                    formule.id = id;
                    formule.desc = row[0];

                    resolve(formule);
                }
                else {
                    reject("Pas trouvé la formule " + id.toString());
                }
            }, error => {
                reject(error);
            });
        });
        return promise;
    }
};

export class Compo{

    // écrit une équipe en BDD ; essaie update, si ne marche pas essaie insert
    public static PersisteEquipe(rencontre:number, equipe:Array<EltListeLicencie>, coteX:boolean) {

        console.log("Equipe de " + equipe.length + " joueurs");
        for(var i = 0; i < equipe.length; i++) {
            Compo.PersisteJoueur(equipe[i], (coteX ? 10 : 0) + i, rencontre);
        }
    }

    public static PersisteJoueur(joueur:EltListeLicencie, rang:number, rencontre:number) {

        var insert: string  = `insert into compo (cpo_ren_kn, cpo_vn_rang, cpo_lic_kn, cpo_va_nom, cpo_va_prenom, cpo_vn_points,
            cpo_vn_mute, cpo_vn_etranger, cpo_vn_feminin) values (`;
        var values:string;
        var update:string  = "update Compo set cpo_lic_kn = " + joueur.id + ", "
        + "cpo_va_nom = " + toSQL(joueur.nom) + ", "
        + "cpo_va_prenom = " + toSQL(joueur.prenom) + ", "
        + "cpo_vn_points = " + joueur.points + ", "
        + "cpo_vn_mute = " + bool2SQL(joueur.mute) +", "
        + "cpo_vn_etranger = " + bool2SQL(joueur.etranger) + ", "
        + "cpo_vn_feminin = " + bool2SQL(joueur.feminin)
        + " where cpo_ren_kn = " + rencontre
        + " and cpo_vn_rang = " + rang;

        console.log(update);
        RespeqttDb.db.execSQL(update).then(n => {
            if(n > 0) {
                console.log("Joueur " + rang + " mis à jour en BDD");
            } else {
                // le joueur n'existe pas => insert
                values = rencontre + ", "
                       + rang + ", "  // l'équipe X commence à 10
                       + joueur.id + ", "
                       + toSQL(joueur.nom) + ", "
                       + toSQL(joueur.prenom) + ", "
                       + joueur.points + ", "
                       + bool2SQL(joueur.mute) +", "
                       + bool2SQL(joueur.etranger) + ", "
                       + bool2SQL(joueur.feminin) + ")";

                RespeqttDb.db.execSQL(insert + values).then(id => {
                    console.log("Joueur " + rang + " inséré en BDD");
                }, error2 => {
                    console.log("Echec insertion dans la table Compo", error2);
                });
            }
        }, error => {
            console.log("Echec update dans la table Compo", error);
        });
    }


    // recharge les équipes de la rencontre dans la session en cours
    public static RechargeEquipes(rencontre:number) {

        var sql:string = `select cpo_vn_rang, cpo_lic_kn, cpo_va_nom, cpo_va_prenom, cpo_vn_points, cpo_vn_mute, cpo_vn_etranger, cpo_vn_feminin
               from Compo where cpo_ren_kn = ` + rencontre; + " order by cpo_vn_num asc"
        RespeqttDb.db.all(sql).then(rows => {
            for(var row in rows) {
                var rang = Number(rows[row][0]);
                var elt:EltListeLicencie = new EltListeLicencie();

                elt.id = Number(rows[row][1]);
                elt.nom = rows[row][2];
                elt.prenom = rows[row][3];
                elt.points = Number(rows[row][4]);
                elt.mute = SQL2bool(Number(rows[row][5]));
                elt.etranger = SQL2bool(Number(rows[row][6]));
                elt.feminin = SQL2bool(Number(rows[row][7]));
                if(rang > 9) {
                    // équipe X
                    SessionAppli.equipeX.push(elt);
                } else {
                    // équipe A
                    SessionAppli.equipeA.push(elt);
                }
                console.log("joueur " + rang + " nom " + elt.nom + " prenom " + elt.prenom + " licence=" + elt.id);
            }
        }, error => {
            console.log("Impossible de trouver en BDD les équipes de la rencontre " + rencontre, error);
        });

    }

};
