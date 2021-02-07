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

var Sqlite = require ("nativescript-sqlite");


// Classe singleton de gestion de la base de données Respeqtt
export class RespeqttDb {

    private static dbName = "respeqtt.db";
    public static db:any=null;      // SQLite database

    // Ordres SQL de création des tables
    // Particularité SQLite : les colonnes déclarées de type integer PRIMARY KEY sont des alias de la colonne implicite ROWID qui est indexée
    //et automatiquement créee unique par table par SQLite
    // Les tables Club et Licencie utilisent resp. le numéro FFTT du club et le numéro de licence du joueur comme clé

    private static creeTableClub:string = `create table if not exists Club (clu_kn integer PRIMARY KEY, clu_va_nom text)`;

    private static creeTableLicencie:string = `create table if not exists Licencie (lic_kn integer PRIMARY KEY, lic_va_nom text, lic_va_prenom text,
                lic_vn_points integer, lic_clu_kn integer, lic_vn_mute integer, lic_vn_etranger integer, lic_vn_feminin integer,
                FOREIGN KEY (lic_clu_kn) REFERENCES Club (clu_kn) ON DELETE CASCADE ON UPDATE NO ACTION
                );`;

    private static creeTableFormule:string = `create table if not exists Formule (for_kn integer PRIMARY KEY, for_va_desc text)`;

    private static creeTableRencontre:string = `create table if not exists Rencontre (ren_kn integer PRIMARY KEY, ren_club1_kn integer,
                ren_club2_kn integer, ren_vd_date text, ren_vn_phase integer, ren_vn_journee integer, ren_vn_nb_joueurs integer,
                ren_for_kn integer, ren_vn_nb_sets integer, ren_vn_ja integer, ren_va_lieu text, ren_vn_echelon integer,
                ren_vn_feminin integer, ren_va_division text, ren_va_ligue text, ren_va_poule text, ren_va_feuille text,
                ren_vn_score_A integer, ren_vn_score_X integer,
                FOREIGN KEY (ren_club1_kn) REFERENCES Club (clu_kn) ON DELETE CASCADE ON UPDATE NO ACTION,
                FOREIGN KEY (ren_club2_kn) REFERENCES Club (clu_kn) ON DELETE CASCADE ON UPDATE NO ACTION,
                FOREIGN KEY (ren_for_kn) REFERENCES Formule (for_kn) ON DELETE CASCADE ON UPDATE NO ACTION
                )`;

    private static creeTableCompo:string = `create table if not exists Compo (cpo_lic_kn integer, cpo_ren_kn integer, cpo_vn_rang integer,
                cpo_va_nom text, cpo_va_prenom text, cpo_vn_points integer, cpo_vn_mute integer, cpo_vn_etranger integer,
                cpo_vn_feminin integer,
                PRIMARY KEY(cpo_ren_kn, cpo_vn_rang),
                FOREIGN KEY (cpo_lic_kn) REFERENCES Licencie (lic_kn) ON DELETE CASCADE ON UPDATE NO ACTION,
                FOREIGN KEY (cpo_ren_kn) REFERENCES Rencontre (ren_kn) ON DELETE CASCADE ON UPDATE NO ACTION
                )`;

    private static creeTablePartie:string = `create table if not exists Partie (par_vn_num integer, par_ren_kn integer, par_va_desc text,
                par_vn_jouA integer, par_vn_jouX integer, par_vn_double integer, par_va_score text,
                PRIMARY KEY(par_ren_kn, par_vn_num)
                FOREIGN KEY (par_ren_kn) REFERENCES Rencontre (ren_kn) ON DELETE CASCADE ON UPDATE NO ACTION
                )`;

    private static creeTableSet:string = `create table if not exists Set_ren (set_ren_kn, set_par_kn integer, set_vn_num integer, set_vn_score integer,
                PRIMARY KEY(set_ren_kn, set_par_kn, set_vn_num),
                FOREIGN KEY (set_par_kn) REFERENCES Partie (par_kn) ON DELETE CASCADE ON UPDATE NO ACTION,
                FOREIGN KEY (set_ren_kn) REFERENCES Rencontre (ren_kn) ON DELETE CASCADE ON UPDATE NO ACTION
                )`;

    public static creeTableSession:string = `create table if not exists Session (ses_ren_kn integer PRIMARY KEY,
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
                ses_va_feuilleDeMatch,
                FOREIGN KEY (ses_ren_kn) REFERENCES Rencontre (ren_kn) ON DELETE CASCADE ON UPDATE NO ACTION
                )`;

    // supprime les tables et la base
    public static Drop() {
        RespeqttDb.db.execSQL("drop table Club").then(error => {console.log("impossible de supprimer la table Club");});
        RespeqttDb.db.execSQL("drop table Cartons").then(error => {console.log("impossible de supprimer la table Cartons");});
        RespeqttDb.db.execSQL("drop table Reserves").then(error => {console.log("impossible de supprimer la table Reserves");});
        RespeqttDb.db.execSQL("drop table Rapport_JA").then(error => {console.log("impossible de supprimer la table Rapport_JA");});
        RespeqttDb.db.execSQL("drop table Formule").then(error => {console.log("impossible de supprimer la table Formule");});
        RespeqttDb.db.execSQL("drop table Compo").then(error => {console.log("impossible de supprimer la table Compo");});
        RespeqttDb.db.execSQL("drop table Partie").then(error => {console.log("impossible de supprimer la table Partie");});
        RespeqttDb.db.execSQL("drop table Set_ren").then(error => {console.log("impossible de supprimer la table Set");});
        RespeqttDb.db.execSQL("drop table Licencie").then(error => {console.log("impossible de supprimer la table Licencie");});
        RespeqttDb.db.execSQL("drop table Rencontre").then(error => {console.log("impossible de supprimer la table Rencontre");});
        RespeqttDb.db.execSQL("drop table Session").then(error => {console.log("impossible de supprimer la table Session");});
        RespeqttDb.db.deleteDatabase(RespeqttDb.dbName);
    }

    // initialise la base et crée les tables
    public static Init() {

        let promise = new Promise(function(resolve, reject) {
            if(RespeqttDb.db) {
                resolve(true);
            } else {
                // créer la base de données
                new Sqlite(RespeqttDb.dbName).then(db => {
                    RespeqttDb.db = db;
                    // création des tables
                    db.execSQL(RespeqttDb.creeTableRencontre).then(id => {
                        db.execSQL(RespeqttDb.creeTableClub).then(id => {
                            db.execSQL(RespeqttDb.creeTableLicencie).then(id => {
                                db.execSQL(RespeqttDb.creeTableCompo).then(id => {
                                    db.execSQL(RespeqttDb.creeTableFormule).then(id => {
                                        db.execSQL(RespeqttDb.creeTablePartie).then(id => {
                                            db.execSQL(RespeqttDb.creeTableSet).then(id => {
                                                db.execSQL(RespeqttDb.creeTableSession).then(id => {
                                                        console.log("Toutes tables OK / BDD PRETE");
                                                        resolve(true);
                                                    }, error => {
                                                        console.log("Impossible de créer la table Session", error);
                                                        reject(error);
                                                    });
                                            }, error => {
                                                console.log("Impossible de créer la table Set", error);
                                                reject(error);
                                            });
                                        }, error => {
                                            console.log("Impossible de créer la table Partie", error);
                                            reject(error);
                                        });
                                    }, error => {
                                        console.log("Impossible de créer la table Formule", error);
                                        reject(error);
                                    });
                                }, error => {
                                    console.log("Impossible de créer la table Compo", error);
                                    reject(error);
                                });
                            }, error => {
                                console.log("Impossible de créer la table Licencie", error);
                                reject(error);
                            });
                        }, error => {
                            console.log("Impossible de créer la table Club", error);
                            reject(error);
                        });
                        }, error => {
                        console.log("Impossible de créer la table Rencontre", error);
                        reject(error);
                    });
                }, error => {
                    console.log("Impossible de créer/ouvrir la BDD", error);
                    reject(error);
                });
            }
        });
        return promise;
    }

    // cherche la session dans la table des sessions et la crée si besoin
    public static ChercheSessionEnBase(rencontre:number) {
        let nbSessions:number=0;

        // vérifier si la table existe
        RespeqttDb.db.get("select count(*) from Session where ses_ren_kn = " + rencontre).then(row => {
            nbSessions = Number(row[0]);
            if(nbSessions > 0) {
                console.log("Session trouvée en BDD");
            } else {
                RespeqttDb.db.execSQL("insert into Session (ses_ren_kn").then(id => {
                    console.log("Table Session créée");
                }, error2 => {
                    console.log("Impossible de créer la table Session", error2);
                });
                }
        }, error => {
            console.log("création de la table Session");
            RespeqttDb.db.execSQL(RespeqttDb.creeTableSession).then(id => {
                console.log("Table Session créée");
            }, error2 => {
                console.log("Impossible de créer la table Session", error2);
            });
        });
    }

}
