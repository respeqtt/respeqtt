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
    ja: number;
    lieu:string;
    echelon:string;
    feminin:boolean;
    division:string;
    ligue:string;
    poule:string;
    va_feuille:string;
    scoreA:number;
    scoreX:number;

    // requêtes SQL
    private static selListe = "select ren_kn, ren_va_division, ren_vn_journee, ren_vd_date from Rencontre";

    // liste des rencontres
    public static liste:Array<any>;

    // renvoie la liste des rencontres en BDD pour affichage sur la page des rencontres
    public static getListe() {
        var liste:Array<any>;
        var n:number;
        let promise = new Promise(function(resolve, reject) {

            RespeqttDb.db.all(Rencontre.selListe).then(rows => {
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
                            ren_for_kn, ren_vn_nb_sets, ren_vn_ja, ren_va_lieu, ren_vn_echelon,
                            ren_vn_feminin, ren_va_division, ren_va_ligue, ren_va_poule, ren_va_feuille,
                            ren_vn_score_A, ren_vn_score_X
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
                    rencontre.ja= Number(row[8]);
                    rencontre.lieu= row[9];
                    rencontre.echelon= row[10];
                    rencontre.feminin= Boolean(row[11]);
                    rencontre.division= row[12];
                    rencontre.ligue= row[13];
                    rencontre.poule= row[14];
                    rencontre.va_feuille= row[15];
                    rencontre.scoreA= row[16];
                    rencontre.scoreX= row[17];

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
    rencontre:Rencontre;        // rencontre associée
    joueurA:number;             // numéro de licence joueur de l'équipe A ; 2 numéros séparés par la virgule pour les doubles
    joueurX:number;             // numéro de licence joueur de l'équipe X
    simple:boolean;             // VRAI si c'est un simple
    score:number;               // 2 si A a gagné, 1 si X a gagné, 0 si X forfait, 3 si A forfait
    sets:Array<Set>=[];         // liste des sets disputés
    desc:string;                // description pour la liste
    sel:boolean;                // sélection si dans une liste

    // crée la liste des parties
    static InitListeParties(r:Rencontre, eqA:Array<EltListeLicencie>, eqX:Array<EltListeLicencie>):Array<Partie> {
        var liste:Array<Partie>=[];

        // récuperer la formule
        Formule.getFormule(r.formule).then(f=> {
            const formule = f as Formule;
            var n:number;   // nombre de parties
            var partie:Partie;

            // mettre en forme les parties
            n = formule.getNbParties();
            console.log("Nb parties=" + n);
            for(var i:number=0; i < r.nbJoueurs; i++) {
                console.log("J" + (i+1) + " A = " + eqA[i].nom + "/ J" + (i+1) + " X = " + eqX[i].nom);
            }
            for(var i:number = 0; i<n; i++) {
                partie = new Partie(formule.getPartie(i+1), eqA, eqX);
                liste.push(partie);
            }
        },error =>{
            console.log("Impossible de trouver la formule " + r.formule.toString());
        });

        return liste;
    }

    // crée une partie à partir de son modèle p (ex : AW) et des deux équipes
    constructor(p:string, eqA:Array<EltListeLicencie>, eqX:Array<EltListeLicencie>) {

        var joueur:EltListeLicencie;

        // pas sélectionnée
        this.sel = false;
        // description = A/nom prénom vs X/nom prénom = points
        this.desc = p.charAt(0) + "/";
        console.log(p);
        if(p.charCodeAt(0) < 65) {
            // c'est un double
            this.desc = "*** double" + this.desc + " *** = ";
        } else {
            // c'est un simple
            // coté A
            joueur = eqA[p.charCodeAt(0)-65];
            console.log("Rang A =" + (p.charCodeAt(0)-65));
            this.desc = this.desc + joueur.nom + " " + joueur.prenom + " vs ";
            // coté X
            this.desc = this.desc + p.charAt(1) + "/";
            console.log("Rang X =" + (p.charCodeAt(1)-87));
            joueur = eqX[p.charCodeAt(1)-87];
            this.desc = this.desc + joueur.nom + " " + joueur.prenom + " = ";
        }

    }

    // met à jour le score des parties disputées ; renvoie TRUE si le score est valide
    setScore(result:Array<Set>, r:Rencontre):boolean {
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
            result[i].partie = this;
            result[i].numSet = i;
            // mémoriser le set
            this.sets.push(result[i]);
            // vérifier que si un joueur a gagné il n'y a pas de set à suivre
            if((ptsA == r.nbSets || ptsX == r.nbSets) && i+1 < result.length) {
                console.log("!!! Score incorrect : des sets ont été joués après le résultat acquis");
                return false;
            }
        }
        // vérifier que le bon nombre de sets ont été joués
        console.log(r.nbSets + " sets gagnants / " + r.nbSets + " joués");
        if (ptsA < r.nbSets && ptsX < r.nbSets) {
            console.log("!!! Score incomplet : aucun joueur n'a remporté " + r.nbSets + " sets");
            return false;
        }
        if (ptsA > r.nbSets) {
            console.log("!!! Score incorrect : le joueur coté A a remporté plus de sets (" + ptsA + ") que nécessaire :" + r.nbSets);
            return false;
        }
        if (ptsX > r.nbSets) {
            console.log("!!! Score incorrect : le joueur coté X a remporté plus de sets (" + ptsX + ") que nécessaire :" + r.nbSets);
            return false;
        }
        if(ptsA > ptsX) {
            this.score = 2;
            // mettre à jour la description
            console.log("desc:" + this.desc + "; pos = :"+ this.desc.search("=") + "; debut:" + this.desc.substr(0, this.desc.search("=")));
            this.desc = this.desc.substr(0, this.desc.search("=") + 1) + "2-1";
        } else {
            this.score = 1;
            // mettre à jour la description
            this.desc = this.desc.substr(0, this.desc.search("=") + 1) + "1-2";
        }
        console.log("Partie=" + this.desc);
        return true;
    }

    ScoreToJSon (numPartie:number, r:Rencontre):string {
        var json:string;

        // début
        json = '{"rencontre":"' + r.id +  '", "num":"' + numPartie + '", "res": [';


        // Coder le résultat des sets en JSON
        for(var i = 0; i < this.sets.length; i++) {
            if(i>0) json = json + ","
            json = json + '{"set": "' + i + '", "score": "' + this.sets[i].score  + '"}';
        }
        json = json + ']}';

        return json;
    }

    // convertit un message json en score d'une partie
    JsonToScore (json:string, rencontre:Rencontre, partie:number):boolean {
        var data;

        // analyse du JSON en entrée
        data = JSON.parse(json);


        // controles
        if(data.rencontre == rencontre.id && data.num == partie && data.res.length>0) {
            // mémoriser les sets
            var listeSets:Array<Set>=[];
            var s:Set;
            for(var i=0; i < data.res.length; i++) {
                s = new Set(data.res[i].score);
                listeSets.push(s);
            }
            // mettre à jour les sets et le score de la partie
            this.setScore(listeSets, rencontre);
            return true;
        } else {
            alert("Ce n'est pas le résultat de la partie ou de la rencontre attendue");
            return false;
        }

    }
};


export class Set{
    partie:Partie;
    numSet:number;
    score:number;

    constructor(res:number) {
        this.score = res;
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

export class Cartons{

};

export class Reserves{

};

export class RapportJA{

};
