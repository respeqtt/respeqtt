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
import { SessionAppli} from "../session/session";
import { bool2SQL, SQL2bool, toSQL, toURL, URLtoString, URLtoStringSansQuote } from "../outils/outils";


export class Respeqtt {
    private static signature:Signature=null;

    public static isTest() {
        return true;
    }

    public static RAZSignature() {
        if(!this.SignatureEstVerrouillee()) {
            this.signature=null;
        }
    }


    public static GetLicence() {
        if(this.signature) {
            return this.signature.GetLicence();
        } else {
            return -1;
        }
    }

    public static GetSignature() {
        if(this.signature) {
            return this.signature.GetSignature();
        } else {
            return "";
        }
    }

    public static VerrouilleSignature() {
        this.signature.Verrouille();
    }


    public static SignatureEstVerrouillee():boolean {
        if(this.signature) {
            return this.signature.EstVerrouillee();
        } else {
            return false;
        }
    }


    public static ChargeSignature() {
        // requêtes SQL
        let sql:string = "select sig_va_signature, sig_vn_licence, sig_vn_lock from Signature where sig_kn = 0";
        let promise = new Promise(function(resolve, reject) {

            RespeqttDb.db.all(sql).then(rows => {
                let elt = new Signature;
                if(rows.length > 0) {
                    elt.SetSignature(rows[0][0]);
                    console.log("sig=" + rows[0][0]);
                    elt.SetLicence(Number(rows[0][1]));
                    console.log("lic=" + rows[0][1]);
                    // restaurer le verrou
                    if(Number(rows[0][2]) > 0) {
                        elt.Verrouille();
                        console.log("licence verrouillée :" + rows[0][2]);
                    } else {
                        console.log("licence NON verrouillée :" + rows[0][2]);
                    }

                    Respeqtt.signature = elt;
                    console.log("Trouvé licence : " + elt.GetLicence().toString());                    
                } else {
                    console.log("pas trouvé de signature");
                    let elt = new Signature;
                    elt.SetSignature("");
                    elt.SetLicence(-1);
                }                
                resolve(elt);
            }, error => {
                console.log("Erreur: " + error);                
                reject(error);
            });
        });
        return promise;
    }

    private static CreeSignature():string {
        let s: string = "";
        let d:Date = new Date();
        let inOptions: string = '{[(abcdefghijklmnopqrstuvwxyz+-§*%$_.;:#<>&|0123456789)]}';
    
        // génération aléatoire de la signature
        for (let i = 0; i < 20; i++) {
              s += inOptions.charAt(Math.floor(Math.random() * inOptions.length));
            }
        // ajout de la licence et de la date courante
        let mois = d.getMonth()+1;
        let jour = d.getDate();
        let heure = d.getHours();
        let min = d.getMinutes();
        let sec = d.getSeconds();
        let ms = d.getMilliseconds();

        s += Respeqtt.signature.GetLicence().toString() + "@" 
            + d.getFullYear().toString()
            + (mois < 10 ? "0" + mois.toString() : mois.toString())
            + (jour < 10 ? "0" + jour.toString() : jour.toString())
            + (heure < 10 ? "0" + heure.toString() : heure.toString())
            + (min < 10 ? "0" + min.toString() : min.toString())
            + (sec < 10 ? "0" + sec.toString() : sec.toString())
            + (ms < 10 ? "00" + ms.toString() : (ms < 100 ? "0" + ms.toString() : ms.toString()));
        console.log("Signature=" + s); 
        return s;       
    }

    public static MemoriseSignature(lic:number) {

    // initialiser la signature avec la licence
    Respeqtt.signature = new Signature();
    Respeqtt.signature.SetLicence(lic);
    // calculer la signature
    let s:string = this.CreeSignature();
    Respeqtt.signature.SetSignature(s);
    let sql ="insert into Signature (sig_kn, sig_va_signature, sig_vn_licence, sig_vn_lock) values (0, '"
            + s + "', " + lic.toString() + ", " + (Respeqtt.SignatureEstVerrouillee() ? "1" : "0") + ")";

    RespeqttDb.db.execSQL(sql).then(id => {
        console.log("Signature insérée");
        }, error => {
            console.log("ECHEC INSERT Signature " + error.toString());
        });
     
    }

    public static EffaceSignature() {

        let sql ="delete from Signature";
    
        RespeqttDb.db.execSQL(sql).then(id => {
            console.log("Signature effacée");
            }, error => {
                console.log("ECHEC DELETE Signature " + error.toString());
            });
         
        }    
}

export class Signature {
    private signature:string="";
    private licence:number=0;
    private lock:number=0;

    public Verrouille() {
        this.lock++;
    }

    public EstVerrouillee():boolean {
        return this.lock > 0;
    }

    public SetSignature(s:string) {
        this.signature = s;
    }
    public SetLicence(lic:number) {
        this.licence = lic;
    }
    public GetSignature():string {
        return this.signature;
    }
    public GetLicence():number {
        return this.licence;
    }

    // extrait la signature du json 
    public JsonToSignature(json:string):boolean {
        let data;

        data = JSON.parse(json);
        
        let lic = Number(data.licence);
        let sig = data.signature;

        if(lic > 0 && sig != "") {
            this.SetLicence(lic);
            this.SetSignature(sig);
            return true;
        } else {
            console.log("lic=" + data.licence + ", sig=" + sig);
            return false;
        }
    }

};

export class FormuledeRencontre {
    id:number;          // nombre de parties sur la feuille de match
    desc:string;        // description des parties
    joueursA:string;    // liste des lettres des joueurs coté A
    joueursX:string;    // liste des lettres des joueurs coté X
    arbitres:string;    // liste des lettres des joueurs proposés pour arbitrer
    nbDoubles:number;   // nb de doubles à disputer
    nbJoueurs:number;   // nb de joueurs par équipe

    public constructor(f:FormuledeRencontre) {
        this.id = f.id;
        this.desc = f.desc
        this.joueursA = f.joueursA;
        this.joueursX = f.joueursX;
        this.arbitres = f.arbitres;
        this.nbDoubles = f.nbDoubles;
        this.nbJoueurs = f.nbJoueurs;
    }

    // renvoie la première lettre du coté demandé
    public debut(cote:string):number {
        switch(cote) {
            case "A":
                return this.joueursA.charCodeAt(0);
            case "X":
                return this.joueursX.charCodeAt(0);
        }
        return -1;
    }

    // renvoie les deux lettres (clubA + clubX) qui décrivent la partie
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

    // renvoie le nombre de joueurs
    public getNbJoueurs():number {
        return this.nbJoueurs;
    }

    // renvoie le coté si la lettre est dans la formule
    public coteDePlace(place:string):string {
        for(let i = 0; i < this.joueursA.length; i++) {
            if(this.joueursA.charAt(i) == place) return "A";
            if(this.joueursX.charAt(i) == place) return "X";
        }
        return "?";
    }
};

export class EltListeRencontre {
    id:number;
    phase:number;
    journee:number;
    division:string;
    poule:string;
    date:string;
    sel:boolean;
};


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
    echelon:number;
    feminin:boolean;
    division:string;
    ligue:string;
    poule:string;

    // liste des rencontres
    public static liste:Array<any>;

    // renvoie la liste des rencontres en BDD pour affichage sur la page des rencontres
    public static getListe() {
        let liste:Array<any>;
        let n:number;
        // requêtes SQL
        let selListe:string = "select ren_kn, ren_va_division, ren_vn_journee, ren_vd_date, ren_va_poule, ren_vn_phase from Rencontre";
        let order:string=" order by  ren_va_division, ren_va_poule, ren_vn_phase, ren_vn_journee asc";

        let promise = new Promise(function(resolve, reject) {

            RespeqttDb.db.all(selListe + order).then(rows => {
                liste = [];
                n = 0;
                for(let row in rows) {
                    let elt = new EltListeRencontre;
                    elt.id = Number(rows[row][0]);
                    console.log("li" + n, "id=" + elt.id + "/" + rows[row][0]);
                    elt.division = rows[row][1];
                    console.log("li" + n, "division=" + elt.division + "/" + rows[row][1]);
                    elt.poule = rows[row][4];
                    console.log("li" + n, "poule=" + elt.poule + "/" + rows[row][4]);
                    elt.journee = Number(rows[row][2]);
                    console.log("li" + n, "journee=" + elt.journee + "/" + rows[row][2]);
                    elt.date = rows[row][3];
                    console.log("li" + n, "date=" + elt.date + "/" + rows[row][3]);
                    elt.phase = rows[row][5];
                    console.log("li" + n, "phase=" + elt.phase.toString() + "/" + rows[row][5]);
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

    // Renvoie la liste des rencontres à domicile ou à l'extérieur pour le club demandé
    public static getListeDom(club:number, dom:boolean) {
        let liste:Array<any>;
        let n:number;
        // requêtes SQL
        let selListe:string = "select ren_kn, ren_va_division, ren_vn_journee, ren_vd_date, ren_va_poule, ren_vn_phase from Rencontre";
        let where:string = " where ren_club" + (dom ? "1" : "2") + "_kn=" + club.toString();
        let order:string=" order by  ren_va_division, ren_va_poule, ren_vn_phase, ren_vn_journee asc";

        let promise = new Promise(function(resolve, reject) {

            RespeqttDb.db.all(selListe + where + order).then(rows => {
                liste = [];
                n = 0;
                for(let row in rows) {
                    let elt = new EltListeRencontre;
                    elt.id = Number(rows[row][0]);
                    console.log("li" + n, "id=" + elt.id + "/" + rows[row][0]);
                    elt.division = rows[row][1];
                    console.log("li" + n, "division=" + elt.division + "/" + rows[row][1]);
                    elt.poule = rows[row][4];
                    console.log("li" + n, "poule=" + elt.poule + "/" + rows[row][4]);
                    elt.journee = Number(rows[row][2]);
                    console.log("li" + n, "journee=" + elt.journee + "/" + rows[row][2]);
                    elt.date = rows[row][3];
                    console.log("li" + n, "date=" + elt.date + "/" + rows[row][3]);
                    elt.phase = rows[row][5];
                    console.log("li" + n, "phase=" + elt.phase.toString() + "/" + rows[row][5]);
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

        if(!Respeqtt.isTest()) {
            console.log("--- PAS EN MODE TEST ---");
            return;
        }

        // création de 3 clubs
        let sqlClub =`insert into Club (clu_kn, clu_va_nom) values (`;

        let clubs= [
            `1990001, 'Ping TT')`,
            `1990002, 'Pong TT')`
        ];

        // création des rencontres
        let sqlRen=`insert into Rencontre (ren_kn, ren_club1_kn, ren_club2_kn, ren_vd_date, ren_vn_phase, ren_vn_journee,
            ren_for_kn, ren_vn_nb_sets, ren_vn_echelon, ren_vn_feminin,
            ren_va_division, ren_va_ligue, ren_va_poule) values (`;
       let rencontres = [
           `1, 1990001, 1990002, '2022/11/08', 1, 4, 18, 3, 3, 0, 'PR', 'AURA', '4')`,
           `2, 1990002, 1990001, '2022/11/08', 1, 4, 18, 3, 3, 0, 'D1', 'AURA', '1')`,
           `3, 1990001, 1990002, '2022/03/04', 1, 3,  5, 3, 3, 0, 'C2', 'AURA', '3')`,
           `4, 1990001, 1990002, '2022/04/05', 2, 5, 14, 3, 2, 0, 'R3', 'AURA', '2')`
       ];

        for(let j in clubs) {
            RespeqttDb.db.execSQL(sqlClub + clubs[j]).then(id => {
                console.log("Club " + clubs[j] + " inséré");
                }, error => {
                    console.log("ECHEC INSERT Club " + error.toString());
                });
        }
        for(let j in rencontres) {
            RespeqttDb.db.execSQL(sqlRen + rencontres[j]).then(id => {
                console.log("Rencontre " + rencontres[j] + " insérée");
                }, error => {
                    console.log("ECHEC INSERT Rencontre " + error.toString());
                });
        }
    }

     // renvoie la rencontre complete
     public static getRencontre(id:number) {
        const select = `select ren_club1_kn, ren_club2_kn, ren_vd_date, ren_vn_phase, ren_vn_journee, 
                            ren_for_kn, ren_vn_nb_sets, ren_vn_echelon, ren_vn_feminin, ren_va_division, ren_va_ligue, ren_va_poule
                        from Rencontre
                        where ren_kn = `
                     + id.toString();

        let promise = new Promise(function(resolve, reject) {
            RespeqttDb.db.get(select).then(row => {
                if(row) {
                    let rencontre = new Rencontre;

                    rencontre.id = id;
                    rencontre.club1= Number(row[0]);
                    rencontre.club2 = Number(row[1]);
                    rencontre.date= row[2];
                    rencontre.phase= Number(row[3]);
                    rencontre.journee= Number(row[4]);
                    rencontre.formule= Number(row[5]);
                    rencontre.nbSets= Number(row[6]);
                    rencontre.echelon= row[7];
                    rencontre.feminin= Boolean(row[8]);
                    rencontre.division= row[9];
                    rencontre.ligue= row[10];
                    rencontre.poule= row[11];

                    console.log("Trouvé rencontre " + rencontre.id + " div " + rencontre.division + " poule " + rencontre.poule + " ligue " + rencontre.ligue);

                    resolve(rencontre);
                }
                else {
                    resolve("Pas trouvé la rencontre ");
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

    private static getNextId() {
        const select = "select max(ren_kn) as kn from Rencontre";
        let promise = new Promise(function(resolve, reject) {
            RespeqttDb.db.get(select).then(row => {
                if(row) {
                    let max:number=Number(row[0]);
                    console.log("Max kn=" + max.toString());
                    resolve(max+1);
                }
                else {
                    resolve(1);
                }
            }, error => {
                reject(error);
            });
        });
        return promise;
    }

    // Ajoute une rencontre en BDD
    public static AjouteRencontre(r:Rencontre) {

        let promise = new Promise(function(resolve, reject) {
                // rechercher la kn à utiliser
            Rencontre.getNextId().then(nextId => {
                console.log("ren_kn=" + nextId);                
                let sql =`insert into Rencontre (ren_kn, ren_club1_kn, ren_club2_kn, ren_vd_date, ren_vn_phase, ren_vn_journee,
                    ren_for_kn, ren_vn_nb_sets, ren_vn_echelon, ren_vn_feminin,
                    ren_va_division, ren_va_ligue, ren_va_poule) values (`
                    + nextId + ", " 
                    + r.club1 + ", " 
                    + r.club2 + ", '" 
                    + r.date + "', " 
                    + r.phase + ", " 
                    + r.journee + ", " 
                    + r.formule + ", " 
                    + r.nbSets + ", " 
                    + r.echelon + ", " 
                    + (r.feminin ? "0" : "1") + ", '" 
                    + r.division + "', '" 
                    + r.ligue + "', '" 
                    + r.poule + "'"
                    + ")";
        
                console.log(sql);
                RespeqttDb.db.execSQL(sql).then(id => {
                    console.log("Rencontre " + nextId + " ajoutée");
                    resolve(nextId);
                    }, error => {
                        console.log("ECHEC INSERT Rencontre " + error.toString());
                        reject(error);
                    });
                }, error =>{
                console.log("Impossible de lire les id des rencontres :" + error.toString());
                reject(error);
            });
        });
        return promise;
    }
    // Supprime une rencontre
    public static SupprimeRencontre(idRencontre:number) {
        let sql ="delete from Rencontre where ren_kn=" + idRencontre.toString();

        RespeqttDb.db.execSQL(sql).then(id => {
            console.log("Rencontre " + idRencontre.toString() + " supprimée");
            }, error => {
                console.log("ECHEC DELETE Rencontre " + error.toString());
            });
    }

};

export class EltListeClub {
    numero:number;
    nom:string;
    sel:boolean=false;
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
        let liste:Array<any>;
        let n:number;
        let order: string = " order by clu_kn asc";
        let promise = new Promise(function(resolve, reject) {

            RespeqttDb.db.all(Club.selListe + order).then(rows => {
                liste = [];
                n = 0;
                for(let row in rows) {
                    let elt = new EltListeClub;
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
                    let club = new Club;
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

    public static ajouteClub(numero:number, nom:string) {
        let sqlClub ="insert into Club (clu_kn, clu_va_nom) values (" + numero + ", " + toSQL(nom) + ")";

        RespeqttDb.db.execSQL(sqlClub).then(id => {
            console.log("Club " + nom + " ajouté");
            }, error => {
                console.log("ECHEC INSERT Club " + error.toString());
            });

    }

    public static supprimeClub(numero:number) {
        let sqlClub ="delete from Club where clu_kn=" + numero;

        RespeqttDb.db.execSQL(sqlClub).then(id => {
            console.log("Club " + numero + " supprimé");
            }, error => {
                console.log("ECHEC DELETE Club " + error.toString());
            });

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
    cartons:number;

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
    club:number;

    // requêtes SQL
    private static selListe = "select lic_kn, lic_va_nom, lic_va_prenom, lic_vn_points, lic_vn_mute, lic_vn_etranger, lic_vn_feminin from Licencie";

    // liste des licencies
    public static liste:Array<any>;

    // renvoie un Licencie à partir de sa licence
    public static getLic(id:number) {
        const select = "select lic_va_nom, lic_va_prenom, lic_vn_points, lic_vn_mute, lic_vn_etranger, lic_vn_feminin, lic_clu_kn from Licencie where lic_kn = " + id.toString();
        let promise = new Promise(function(resolve, reject) {
            RespeqttDb.db.get(select).then(row => {
                if(row) {
                    let lic = new Licencie;
                    lic.id = id;
                    lic.nom = row[0];
                    lic.prenom = row[1];
                    lic.points = Number(row[2]);
                    lic.mute = Boolean(row[3]);
                    lic.etranger = Boolean(row[4]);
                    lic.feminin = Boolean(row[5]);
                    lic.club = Number(row[6]);
                    resolve(lic);
                }
                else {
                    resolve(null);
                }
            }, error => {
                reject(error);
            });
        });
        return promise;
    };

    // renvoie un EltListeLicencie (nom, prenom et points) à partir de sa licence
    public static get(id:number, club:number) {
        let where:string = "";
        if(club > 0) {
            where = " and lic_clu_kn = " + club.toString();
        }
        const select = "select lic_va_nom, lic_va_prenom, lic_vn_points from Licencie where lic_kn = " + id.toString() + where;
        let promise = new Promise(function(resolve, reject) {
            RespeqttDb.db.get(select).then(row => {
                if(row) {
                    let lic = new EltListeLicencie;
                    lic.id = id;
                    lic.nom = row[0];
                    lic.prenom = row[1];
                    lic.points = Number(row[2]);
                    lic.cartons = 0;
                    lic.place="";
                    resolve(lic);
                }
                else {
                    resolve(null);
                }
            }, error => {
                reject(error);
            });
        });
        return promise;
    };


    // renvoie un EltListeLicencie (nom, prenom et points) à partir de sa licence
    public static ajouteLicencie(j:Licencie, club:number) {

        const sql:string="insert into Licencie (lic_va_nom, lic_va_prenom, lic_kn, lic_vn_points, lic_clu_kn, lic_vn_mute, lic_vn_etranger, lic_vn_feminin) values ('"
        + j.nom + "', '"
        + j.prenom + "', "
        + j.id + ", "
        + j.points + ", "
        + club + ", "
        + bool2SQL(j.mute) + ", "
        + bool2SQL(j.etranger) + ", "
        + bool2SQL(j.feminin) + ")";

        // insertion en BDD
        let promise = new Promise(function(resolve, reject) {
            RespeqttDb.db.execSQL(sql).then(id => {
                console.log("Joueur ajouté : " + j.id + " " + j.nom + " " + j.prenom + " au club " + club.toString());
            }, error2 => {
                console.log("Echec insertion du joueur " + j.id, error2);
            });
        });
        return promise;
    }
    

    // renvoie la liste en BDD des joueurs du club demandé pour affichage sur la page des joueurs
    public static getListe(clubId:number) {
        let liste:Array<any>;
        let n:number;
        let where = " where lic_clu_kn=" + clubId.toString();
        let order = " order by lic_va_nom, lic_va_prenom"
        let promise = new Promise(function(resolve, reject) {
            RespeqttDb.db.all(Licencie.selListe + where + order).then(rows => {
                liste = [];
                n = 0;
                for(let row in rows) {
                    let elt = new EltListeLicencie;
                    elt.id = Number(rows[row][0]);
                    console.log("li" + n, "id=" + elt.id + "/" + rows[row][0]);
                    elt.nom = rows[row][1];
                    elt.prenom = rows[row][2];
                    elt.points = Number(rows[row][3]);
                    elt.mute = Boolean(rows[row][4]);
                    elt.etranger = Boolean(rows[row][5]);
                    elt.feminin = Boolean(rows[row][6]);
                    elt.cartons = 0;
                    elt.place="";
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

        if(!Respeqtt.isTest()) {
            console.log("--- PAS EN MODE TEST ---");
            return;
        }

        // création des joueurs
        let sql=`insert into Licencie (lic_clu_kn, lic_kn, lic_va_nom, lic_va_prenom, lic_vn_points,
            lic_vn_mute, lic_vn_etranger, lic_vn_feminin) values (`;
        let joueurs= [
            `1990001, 690101, 'GAUZY', 'Sylvain',    1203, 0, 0, 0)`,
            `1990001, 690102, 'SECRETIN', 'Jean',     990, 0, 0, 0)`,
            `1990001, 690103, 'GATIEN', 'Marcel',     770, 1, 0, 0)`,
            `1990001, 690104, 'GASNIER', 'Laurine',   660, 0, 0, 1)`,
            `1990001, 690105, 'ZHEN DONG', 'Lin',    1015, 1, 1, 0)`,

            `1990002, 690201, 'ROBERT', 'Marcel',    1088, 0, 0, 0)`,
            `1990002, 690202, 'MICHON', 'Alexandre',  550, 0, 0, 0)`,
            `1990002, 690203, 'PIERRE', 'Jacques',    789, 1, 0, 0)`,
            `1990002, 690204, 'ANDRE',  'Kevin',      654, 0, 0, 0)`,
            `1990002, 690205, 'MARTIN', 'Charlotte', 1234, 1, 0, 1)`
        ];

        for(let j in joueurs) {
            RespeqttDb.db.execSQL(sql + joueurs[j]).then(id => {
                console.log("Joueur " + joueurs[j] + " inséré");
                }, error => {
                    console.log("ECHEC INSERT joueur " + error.toString());
                });
        }
    }
};

// renvoie le joueur qui correspond à la lettre
export function getJoueur(lettre:string):EltListeLicencie {
    switch(lettre) {
        case "A" : return SessionAppli.equipeA[0];
        case "B" : if(SessionAppli.formule > 1) return SessionAppli.equipeA[1];
        case "C" : if(SessionAppli.formule > 5) return SessionAppli.equipeA[2];
                   else return null;
        case "D" : if(SessionAppli.formule > 5) return SessionAppli.equipeA[3];
                   else return null;
        case "W" : if(SessionAppli.formule > 5) return SessionAppli.equipeX[0];
                   else return null;
        case "X" : switch(SessionAppli.formule) {
                            case 5:  return SessionAppli.equipeX[0];
                            case 14: return SessionAppli.equipeX[1];
                            case 18: return SessionAppli.equipeX[1];
                            default: return null;
                    }
        case "Y" : switch(SessionAppli.formule) {
                        case 5:  return SessionAppli.equipeX[1];
                        case 14: return SessionAppli.equipeX[2];
                        case 18: return SessionAppli.equipeX[2];
                        default: return null;
                   }
        case "Z" : if(SessionAppli.formule > 5) return SessionAppli.equipeX[3];
                   else return null;
        default  : console.log("Joueur >" + lettre + "< pas trouvé");
        return null;
    }
}

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

        let liste:Array<Partie>=[];
        let n:number;   // nombre de parties
        let partie:Partie;

        // récuperer la formule
        const formule:FormuledeRencontre = ListeFormules.getFormule(SessionAppli.formule);
        console.log("Formule en cours : " + formule.id.toString() + " / " + formule.desc);

        if(formule) {
            // mettre en forme les parties
            n = formule.getNbParties();
            console.log("Nb parties=" + n);
            for(let i:number=0; i < SessionAppli.nbJoueurs; i++) {
                console.log("J" + (i+1) + " A = " + (forfaitA ? "(absent)" : eqA[i].nom) + "/ J" + (i+1) + " X = " + (forfaitX ? "(absent)" : eqX[i].nom));
            }
            for(let i:number = 0; i<n; i++) {
                partie = new Partie(formule, formule.getPartie(i+1), eqA, eqX, forfaitA, forfaitX);
                liste.push(partie);
            }
            return liste;
        }
        return null;
    }
    

    // crée une partie à partir de son modèle p (ex : AW) et des deux équipes
    // p vide -> partie créée vide
    constructor(f:FormuledeRencontre, p:string, eqA:Array<EltListeLicencie>, eqX:Array<EltListeLicencie>, forfaitA:boolean, forfaitX:boolean) {

        let joueur:EltListeLicencie;
        const debutA:number=f.debut("A");
        const debutX:number=f.debut("X");

        console.log("Pts par victoire = " + SessionAppli.ptsParVictoire.toString());
        if(p != ""){
            // pas sélectionnée
            this.sel = false;
            console.log(p);
            if(p.charAt(0) == "1" || p.charAt(0) == "2") {
                // c'est un double pas encore composé
                this.simple = false;
                this.desc = "*** double" + p.charAt(0) + " *** = ";
                // mettre le score en cas de forfait
                if(forfaitA && !forfaitX) {
                    this.scoreAX = "0-" + SessionAppli.ptsParVictoire.toString();
                }
                if(forfaitX && !forfaitA) {
                    this.scoreAX = SessionAppli.ptsParVictoire.toString() + "-0";
                }
                if(forfaitA && forfaitX) {
                    this.scoreAX = "0-0";
                }
            } else {
                if(p.length>2) {
                    // c'est un double déjà composé
                    console.log("Composition du double : " + p);
                    this.simple = false;
                    for(let j=0; j < p.length; j++) {
                        // ajouter les lettres en début de double pour avoir : AB-nom prénom , nom prénom vs WX-nom prénom, nom prénom
                        switch(j) {
                            case 0 :
                                this.desc = "#" + p.substring(0,2) + "-";
                            break;
                            case 2 :
                                this.desc = this.desc + " vs " + p.substring(2,4) + "-";
                            break;
                            default :
                                this.desc = this.desc + ", ";
                            break;
                        }
                        if(j < 2) {
                            joueur = eqA[p.charCodeAt(j)-debutA]
                        } else {
                            joueur = eqX[p.charCodeAt(j)-debutX]
                        }
                        this.desc = this.desc + joueur.nom + " " + joueur.prenom;
                    }
                }
                else {
                    // c'est un simple
                    this.simple = true;
                    // coté A
                    if(!forfaitA) {
                        joueur = eqA[p.charCodeAt(0)-debutA];
                        console.log("Rang A =" + (p.charCodeAt(0)-debutA));
                        console.log("joueur A =" + joueur.id.toString());
                        this.desc = p.charAt(0) + "/" + joueur.nom + " " + joueur.prenom + " vs ";
                        this.joueurA = joueur.id;
                    }
                    // coté X
                    if(!forfaitX) {
                        this.desc = this.desc + p.charAt(1) + "/";
                        console.log("Rang X =" + (p.charCodeAt(1)-debutX));
                        joueur = eqX[p.charCodeAt(1)-debutX];
                        console.log("joueur X =" + joueur.id.toString());
                        this.desc = this.desc + joueur.nom + " " + joueur.prenom + " = ";
                        this.joueurX = joueur.id;
                    }
                    // mettre le score en cas de forfait
                    if(forfaitA) {
                        console.log("A forfait");
                        this.scoreAX = "0-" + SessionAppli.ptsParVictoire.toString();
                    } else {
                        console.log("A pas forfait");
                        if(eqA[p.charCodeAt(0)-debutA].nom == "(absent)") {
                            this.scoreAX = "0-" + SessionAppli.ptsParVictoire.toString();
                        }
                    }
                    
                    if(forfaitX) {
                        console.log("X forfait");
                        this.scoreAX = SessionAppli.ptsParVictoire.toString() + "-0";
                    } else {
                        console.log("X pas forfait");
                        if(eqX[p.charCodeAt(1)-debutX].nom == "(absent)") {
                            this.scoreAX = SessionAppli.ptsParVictoire.toString() + "-0";
                        }
                    } 

                    // corriger si double forfait
                    if(forfaitA && !forfaitX) {
                        if(eqX[p.charCodeAt(1)-debutX].nom == "(absent)") {
                            this.scoreAX = "0-0";
                        }
                    }
                    if(!forfaitA && forfaitX) {
                        if(eqA[p.charCodeAt(0)-debutA].nom == "(absent)") {
                            this.scoreAX = "0-0";
                        }
                    }
                    if(!forfaitA && !forfaitX && eqX[p.charCodeAt(1)-debutX].nom == "(absent)" && eqA[p.charCodeAt(0)-debutA].nom == "(absent)") {
                        this.scoreAX = "0-0";
                    }
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
        for(let i=0; i < result.length; i++) {
            if(Set.AVainqueur(result[i].score)) {
                ptsA++;
            } else {
                ptsX++;
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
            this.scoreAX = SessionAppli.ptsParVictoire.toString() + "-" + (SessionAppli.ptsParVictoire - 1).toString();
            // mettre à jour la description
            console.log("desc:" + this.desc + "; pos = :"+ this.desc.search("=") + "; debut:" + this.desc.substring(0, this.desc.search("=")));
        } else {
            this.scoreAX = (SessionAppli.ptsParVictoire - 1).toString() + "-" + SessionAppli.ptsParVictoire.toString();
        }
        console.log("Partie=" + this.desc);
        return true;
    }

    // Convertit le score d'une partie en JSON
    ScoreToJSon (numPartie:number, numRencontre:number):string {
        let json:string;

        // début
        // encoder les / de la description
        const desc = toURL(SessionAppli.listeParties[numPartie].desc);
        json = '{"rencontre":"' + numRencontre
             +  '", "partie":"' + numPartie
             + '", "desc":"' + desc
             + '", "nbsets":"' + SessionAppli.nbSetsGagnants
             + '", "res": [';

        // Coder le résultat des sets en JSON
        for(let i = 0; i < this.sets.length; i++) {
            if(i>0) json = json + ","
            json = json + '{"set": "' + i + '", "score": "' + this.sets[i].score  + '"}';
        }
        json = json + '], "remplissage":"Remplissage pour éviter les artefacts"}';

        return json;
    }

    // convertit un message json en partie ; renvoie l'indice de la partie
    JsonToPartie (json:string):number {
        let data;
        let ok:boolean=true;

        // analyse du JSON en entrée
        data = JSON.parse(json);
        // récupérer le n° de la partie
        let iPartie:number = Number(data.partie);
        // contrôler la description
        // décoder les / de la description
        const desc = URLtoStringSansQuote(data.desc);


        if(iPartie >= 0 && iPartie < 30) {
            // on crée assez de parties pour avoir celle que l'on veut
            for(let i=SessionAppli.listeParties.length; i < iPartie+1 ; i++) {
                let p:Partie = new Partie(ListeFormules.getFormule(SessionAppli.formule), "", null, null, false, false);
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
        let data;
        let iPartie:number = -1;

        // analyse du JSON en entrée
        data = JSON.parse(json);
        iPartie = Number(data.partie);
        // décoder les / de la description
        const desc = URLtoStringSansQuote(data.desc);

        // controles
        if( iPartie >= 0 && data.res.length>0 && SessionAppli.listeParties[iPartie].desc == desc) {
            // mémoriser les sets
            let listeSets:Array<Set>=[];
            let s:Set;
            console.log(data.res.length.toString() + " sets dans le scan");
            for(let i=0; i < data.res.length; i++) {
                s = new Set(data.res[i].score);
                listeSets.push(s);
            }
            // mettre à jour les sets et le score de la partie
            SessionAppli.listeParties[iPartie].setScore(listeSets, SessionAppli.nbSetsGagnants);
            return iPartie;
        } else {
            console.log("Ce n'est pas le résultat de la partie ou de la rencontre attendue");
            return -1;
        }
    }

    // écrit une partie d'une rencontre en BDD ; essaie update, si ne marche pas essaie insert
    private static PersistePartie(rencontre:number, partie:Partie, rang:number) {
        let update:string;
        let insertP: string  = `insert into Partie (par_ren_kn, par_vn_num, par_va_desc,
                               par_vn_jouA, par_vn_jouX, par_vn_double, par_va_score) values (`;
        let insertS: string  = "insert into Set_ren (set_par_kn, set_vn_num, set_vn_score) values (";
        let values:string;

        let promise = new Promise(function(resolve, reject) {

            // détection des doubles
            let double:boolean = partie.joueurA > 0 ? false : true;
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
                    resolve(true);
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
                        resolve(true);
                    }, error2 => {
                        console.log("Echec insertion dans la table Partie ", error2);
                        reject(error2);
                    });
                }
            }, error => {
                console.log("Echec update dans la table Partie ", error);
                reject(error);
            });
        });
        return promise;
    }

    // écrit la liste des parties d'une rencontre en BDD ; essaie update, si ne marche pas essaie insert
    public static PersisteListeParties(rencontre:number, parties:Array<Partie>, debutPartie=0) {

        Partie.PersistePartie(rencontre, parties[debutPartie], debutPartie).then(cr => {
            if(debutPartie+1 < parties.length) {
                Partie.PersisteListeParties(rencontre, parties, debutPartie+1);
            } else {
                return;
            }
        }, error => {
            console.log("Impossible de persister la partie " + (debutPartie+1).toString() + " : " + error);
        });
    }

    // recharge les parties de la rencontre dans la session en cours
    public static RechargeParties(rencontre:number) {

        let sql:string = `select par_vn_num integer, par_va_desc,par_vn_jouA, par_vn_jouX, par_vn_double, par_va_score
              from Partie where par_ren_kn = ` + rencontre;
        RespeqttDb.db.all(sql).then(rows => {
            for(let row in rows) {
                let rang = Number(rows[row][0]);
                let elt:Partie = new Partie(ListeFormules.getFormule(SessionAppli.formule), "", null, null, false, false);

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
    score:string;

    static rxA = new RegExp('^[0-9]+$');
    static rxX = new RegExp('^-[0-9]+$');


    constructor(res:string) {
        this.score = res;
    }

    public static AVainqueur(s:string):boolean {
        return this.rxA.test(s);
    }

    public static XVainqueur(s:string):boolean {
        return this.rxX.test(s);
    }

    public static ScoreOK(s:string):boolean {
        if(s) {
            console.log("Score à contrôler=" + s);
            if(s !="") {
                // set gagné par l'équipe A
                if(this.rxA.test(s))  {
                    console.log("Set gagné par équipe A");
                    return true;
                }
                // set gagné par l'équipe X
                if(this.rxX.test(s)) {
                    console.log("Set gagné par équipe X");
                    return true;
                }
                return false;
            }
        }
            return true;
    }

    // écrit un set d'une rencontre en BDD ; essaie update, si ne marche pas essaie insert
    private static PersisteSet(rencontre:number, partie:number, set:Set, rang:number) {
        let update:string;
        let values:string;
        let insert:string = `insert into Set_ren (set_ren_kn, set_par_kn, set_vn_num, set_va_score) values (`;

        let promise = new Promise(function(resolve, reject) {
            update = "update Set_ren set set_va_score = '" + set.score + "' "
            + "where set_par_kn = " + partie
            + " and set_vn_num = " + rang
            + " and set_ren_kn = " + rencontre;

            console.log(update);
            RespeqttDb.db.execSQL(update).then(nSet => {
                if(nSet > 0) {
                    console.log("Set " + rang + " de la partie " + partie + " mis à jour en BDD");
                    resolve(true);
                } else {
                    // le set n'existe pas => insert
                    values = rencontre + ", "
                        + partie + ", "
                        + rang + ", '"
                        + set.score + "')";
                    RespeqttDb.db.execSQL(insert + values).then(id => {
                        console.log("Set " + rang + " de la partie " + partie + " inséré en BDD");
                        resolve(true);
                    }, error2 => {
                        console.log("Echec insertion dans la table Set_ren ", error2);
                        reject(error2);
                    });
                }
            }, error => {
                console.log("Echec update de la table Set_ren ", error);
                reject(error);
            });
        });
        return promise;
    }


    // écrit la liste des sets d'une rencontre en BDD ; essaie update, si ne marche pas essaie insert
    public static PersisteSets(rencontre:number, parties:Array<Partie>, debutPartie:number=0, debutSet:number=0) {
            if(parties.length==0 || parties[debutPartie].sets.length==0) {
                return;
            }
            Set.PersisteSet(rencontre, debutPartie, parties[debutPartie].sets[debutSet], debutSet).then(cr => {
                if(debutSet+1 < parties[debutPartie].sets.length) {
                    Set.PersisteSets(rencontre, parties, debutPartie, debutSet+1);
                } else {
                    if(debutPartie+1 < parties.length) {
                        Set.PersisteSets(rencontre, parties, debutPartie+1);
                    } else {
                        return;
                    }
                }
            }, error => {
                console.log("Impossible de persister le set " 
                        + (debutSet+1).toString() + " de la partie " + (debutPartie+1).toString() + ": " + error);
            });
    }

    // recharge les sets de la rencontre dans la session en cours
    public static RechargeSets(rencontre:number) {

        let sql:string = `select set_par_kn, set_vn_num, set_va_score from Set_ren where set_ren_kn = ` + rencontre;
        RespeqttDb.db.all(sql).then(rows => {
            for(let row in rows) {
                let numPartie:number;
                let elt:Set = new Set("999");

                numPartie = Number(rows[row][0]);
                elt.numSet = rows[row][1];
                elt.score = rows[row][2];

                SessionAppli.listeParties[numPartie].sets.push(elt);
                console.log("set relu " + elt.numSet + " dans partie " + numPartie);
            }
        }, error => {
            console.log("Impossible de trouver en BDD les sets de la rencontre " + rencontre, error);
        });

    }

};

export class ListeFormules {
    // gestion de la table des formules
    static tabFormules:FormuledeRencontre[] = [];  // table des formules
    // formules
    // 0 pour les parties hors rencontre (SessionAppli.formule = 0)
    static json:string=`{
        "formules": [
            {
                "id": "0",
                "desc": "AX",
                "joueursA": "A",
                "joueursX": "X",
                "arbitres": "",
                "nbDoubles":"0",
                "nbJoueurs":"1"
            },
            {
                "id": "1",
                "desc": "AX",
                "joueursA": "A",
                "joueursX": "X",
                "arbitres": "",
                "nbDoubles":"0",
                "nbJoueurs":"1"
            },
            {
                "id": "5",
                "desc": "AX BY 11 AY BX",
                "joueursA": "A B",
                "joueursX": "X Y",
                "arbitres": "B X - B Y",
                "nbDoubles":"1",
                "nbJoueurs":"2"
            },
            {
                "id": "14",
                "desc": "AW BX CY DZ AX BW DY CZ 11 22 AY CW DX BZ",
                "joueursA": "A B C D",
                "joueursX": "W X Y Z",
                "arbitres": "D Z B W C Z A X - - D X A Y",
                "nbDoubles":"2",
                "nbJoueurs":"4"
            },
            {
                "id": "18",
                "desc": "AW BX CY DZ AX BW DY CZ 11 22 DW CX AZ BY CW DX AY BZ",
                "joueursA": "A B C D",
                "joueursX": "W X Y Z",
                "arbitres": "D Z B W C Y X A - - B Y X D A Z W C",
                "nbDoubles":"2",
                "nbJoueurs":"4"
            }
        ]
    }`;

    // charge la table des formules
    public static Init() {
        let mesFormules:FormuledeRencontre[] = JSON.parse(this.json).formules as FormuledeRencontre[];

        for(let i=0; i < mesFormules.length; i++) {
            let maFormule:FormuledeRencontre = new FormuledeRencontre(mesFormules[i] as FormuledeRencontre);
            console.log("Formule " + maFormule.id + " = " + maFormule.desc);
            this.tabFormules.push(maFormule);
        }

    }

    // renvoie la formule complete
    public static getFormule(id:number):FormuledeRencontre {

        for(let i = 0; i < this.tabFormules.length; i++) {
            if(this.tabFormules[i].id == id) {
                return this.tabFormules[i];
            }
        }
        console.log("Formule " + id.toString() + " pas trouvée");
        return null;
    }

};


export class Compo{

    // écrit une équipe en BDD ; essaie update, si ne marche pas essaie insert
    public static PersisteEquipe(rencontre:number, equipe:Array<EltListeLicencie>, coteX:boolean, debutJoueurs:number=0) {

        console.log("-- Persiste joueur " + debutJoueurs.toString() + " = " + equipe[debutJoueurs].id.toString() + " place " + equipe[debutJoueurs].place);
        Compo.PersisteJoueur(equipe[debutJoueurs], rencontre).then(cr=> {
            if(debutJoueurs+1 < equipe.length) {
                Compo.PersisteEquipe(rencontre, equipe, coteX, debutJoueurs+1);
            } else {
                return;
            }
        }, 
        error => {
            console.log("Echec insertion d'un joueur: ", error);
        }); 
    }

    public static PersisteJoueur(joueur:EltListeLicencie, rencontre:number) {
        let promise = new Promise(function(resolve, reject) {

            let insert: string  = `insert into compo (cpo_ren_kn, cpo_va_place, cpo_lic_kn, cpo_va_nom, cpo_va_prenom, cpo_vn_points,
                cpo_vn_mute, cpo_vn_etranger, cpo_vn_feminin, cpo_vn_cartons) values (`;
            let values:string;
            let update:string  = "update Compo set cpo_va_place = " 
            + toSQL(joueur.place == "" ? joueur.id.toString(): joueur.place) + ", "
            + "cpo_va_nom = " + toSQL(joueur.nom) + ", "
            + "cpo_va_prenom = " + toSQL(joueur.prenom) + ", "
            + "cpo_vn_points = " + joueur.points.toString() + ", "
            + "cpo_vn_mute = " + bool2SQL(joueur.mute) +", "
            + "cpo_vn_etranger = " + bool2SQL(joueur.etranger) + ", "
            + "cpo_vn_feminin = " + bool2SQL(joueur.feminin) + ", "
            + "cpo_vn_cartons = " + joueur.cartons.toString()
            + " where cpo_ren_kn = " + rencontre.toString()
            + " and cpo_lic_kn = " + joueur.id.toString()
            ;

            console.log(update);
            RespeqttDb.db.execSQL(update).then(n => {
                if(n > 0) {
                    console.log("*> Joueur " + joueur.place + " mis à jour en BDD");
                    resolve(joueur);
                } else {
                    // le joueur n'existe pas => insert
                    values = rencontre + ", "
                        + toSQL(joueur.place == "" ? joueur.id.toString(): joueur.place) + ", "
                        + joueur.id.toString() + ", "
                        + toSQL(joueur.nom) + ", "
                        + toSQL(joueur.prenom) + ", "
                        + joueur.points.toString() + ", "
                        + bool2SQL(joueur.mute) +", "
                        + bool2SQL(joueur.etranger) + ", "
                        + bool2SQL(joueur.feminin) + ", "
                        + joueur.cartons.toString() + ")";

                    RespeqttDb.db.execSQL(insert + values).then(id => {
                        console.log("+> Joueur " + joueur.place + " inséré en BDD");
                        resolve(joueur);
                    }, error2 => {
                        console.log("Echec insertion dans la table Compo", error2);
                        reject(error2);
                    });
                }
            }, error => {
                console.log("Echec update dans la table Compo", error);
                reject (error);
            });
        });
        return promise;

    }

    // recharge les équipes de la rencontre dans la session en cours
    public static RechargeEquipes(rencontre:number) {

        let sql:string = `select cpo_va_place, cpo_lic_kn, cpo_va_nom, cpo_va_prenom, cpo_vn_points, cpo_vn_mute, cpo_vn_etranger, cpo_vn_feminin, cpo_vn_cartons
               from Compo where cpo_ren_kn = ` + rencontre + " order by cpo_va_place asc"

        RespeqttDb.db.all(sql).then(rows => {
            console.log("Trouvé " + rows.length.toString() + " joueurs");
            for(let row in rows) {
                let rang = Number(rows[row][0]); 6
                let elt:EltListeLicencie = new EltListeLicencie();

                elt.id = Number(rows[row][1]);
                elt.place = rows[row][0];
                elt.nom = rows[row][2];
                elt.prenom = rows[row][3];
                elt.points = Number(rows[row][4]);
                elt.mute = SQL2bool(Number(rows[row][5]));
                elt.etranger = SQL2bool(Number(rows[row][6]));
                elt.feminin = SQL2bool(Number(rows[row][7]));
                elt.cartons = Number(rows[row][8]);
                if(elt.place.charAt(0) > "M") {
                    // équipe X
                    SessionAppli.equipeX.push(elt);
                } else {
                    // équipe A
                    SessionAppli.equipeA.push(elt);
                }
                console.log(elt.place + " joueur " + rang + " nom " + elt.nom + " prenom " + elt.prenom + " licence=" + elt.id + " cartons=" + elt.cartons);
            }
        }, error => {
            console.log("Impossible de trouver en BDD les équipes de la rencontre " + rencontre, error);
        });
    }

}

export function MajScoreDoubleForfait(iPartie:number){
    let finA:number = -1;
    let forfaitA:boolean=false;
    let forfaitX:boolean=false;
    let doubleA:string;
    let doubleX:string;

    finA = SessionAppli.listeParties[iPartie].desc.indexOf("vs");

    // est-ce que doubleA est forfait ?
    doubleA = SessionAppli.listeParties[iPartie].desc.substring(0, finA);
    console.log(">>doubleA=" + doubleA + "/" + doubleA.indexOf("(absent)"));
    if(SessionAppli.forfaitA || doubleA.indexOf("(absent)")>=0) forfaitA = true;

    // est-ce que doubleX est forfait ?
    doubleX = SessionAppli.listeParties[iPartie].desc.substring(finA);
    console.log(">>doubleX=" + doubleX + "/" + doubleX.indexOf("(absent)"));
    if(SessionAppli.forfaitX || doubleX.indexOf("(absent)")>=0) forfaitX = true;

    if(forfaitA) {
        if(forfaitX) {
            SessionAppli.listeParties[iPartie].scoreAX = "0-0";
        } else {
            if(SessionAppli.ptsParVictoire == 2) {
                SessionAppli.listeParties[iPartie].scoreAX = "0-" + SessionAppli.ptsParVictoire.toString();
            } else {
                SessionAppli.listeParties[iPartie].scoreAX = "0-" + SessionAppli.ptsParVictoire.toString();
            }
        }
    } else {
        if(forfaitX) {
            if(SessionAppli.ptsParVictoire == 2) {
                SessionAppli.listeParties[iPartie].scoreAX = SessionAppli.ptsParVictoire.toString() + "-0";
            } else {
                SessionAppli.listeParties[iPartie].scoreAX = SessionAppli.ptsParVictoire.toString() + "-0";
            }
        }
    }
}
