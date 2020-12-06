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
    public static db:any;

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

    private static creeTableCompo:string = `create table if not exists Compo (cpo_lic_kn integer, cpo_ren_kn integer, cpo_va_rang text,
                PRIMARY KEY(cpo_ren_kn, cpo_va_rang),
                FOREIGN KEY (cpo_lic_kn) REFERENCES Licencie (lic_kn) ON DELETE CASCADE ON UPDATE NO ACTION,
                FOREIGN KEY (cpo_ren_kn) REFERENCES Rencontre (ren_kn) ON DELETE CASCADE ON UPDATE NO ACTION
                )`;

    private static creeTablePartie:string = `create table if not exists Partie (par_kn integer PRIMARY KEY, par_ren_kn integer, par_vn_ordreinteger,
                par_vn_jou1 integer, par_vn_jou2 integer, par_vn_simple integer, par_vn_score integer,
                FOREIGN KEY (par_ren_kn) REFERENCES Rencontre (ren_kn) ON DELETE CASCADE ON UPDATE NO ACTION
                )`;

    private static creeTableSet:string = `create table if not exists Set_ren (set_par_kn integer, set_vn_num integer, set_vn_score integer,
                PRIMARY KEY(set_par_kn, set_vn_num),
                FOREIGN KEY (set_par_kn) REFERENCES Partie (par_kn) ON DELETE CASCADE ON UPDATE NO ACTION
                )`;

    private static creeTableCartons:string = `create table if not exists Cartons (car_kn integer PRIMARY KEY, car_ren_kn integer, car_lic_kn integer,
                car_vn_couleur integer, car_va_motif text,
                FOREIGN KEY (car_ren_kn) REFERENCES Rencontre (ren_kn) ON DELETE CASCADE ON UPDATE NO ACTION,
                FOREIGN KEY (car_lic_kn) REFERENCES Licencie (lic_kn) ON DELETE CASCADE ON UPDATE NO ACTION
                )`;

    private static creeTableReserves:string = `create table if not exists Reserves (rsv_kn integer PRIMARY KEY, rsv_ren_kn integer,
                rsv_vd_heure text, rsv_va_score text, rsv_va_texte text, rsv_vn_reclam integer,
                FOREIGN KEY (rsv_ren_kn) REFERENCES Rencontre (ren_kn) ON DELETE CASCADE ON UPDATE NO ACTION
                )`;

    private static creeTableRapportJA:string = `create table if not exists Rapport_JA (rja_ren_kn integer PRIMARY KEY, rja_lic_kn integer, rja_va_nom text,
                rja_va_prenom text, rja_va_rapport text,
                FOREIGN KEY (rja_lic_kn) REFERENCES Rencontre (ren_kn) ON DELETE CASCADE ON UPDATE NO ACTION
                )`;


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
        RespeqttDb.db.deleteDatabase(this.dbName);
    }

    public static Init():boolean {

        // réinit de l'id BDD
        RespeqttDb.db = null;

        // créer la base de données
        new Sqlite(this.dbName).then(db => {
            // création des tables
            db.execSQL(this.creeTableRencontre).then(id => {
                RespeqttDb.db = db;
                db.execSQL(this.creeTableClub).then(id => {
                    db.execSQL(this.creeTableLicencie).then(id => {
                        db.execSQL(this.creeTableCompo).then(id => {
                            db.execSQL(this.creeTableFormule).then(id => {
                                db.execSQL(this.creeTablePartie).then(id => {
                                    db.execSQL(this.creeTableSet).then(id => {
                                        db.execSQL(this.creeTableCartons).then(id => {
                                            db.execSQL(this.creeTableReserves).then(id => {
                                                db.execSQL(this.creeTableRapportJA).then(id => {
                                                    console.log("Toutes tables OK");
                                                }, error => {
                                                    console.log("Impossible de créer la table RapportJA", error);
                                                    return false;
                                                });
                                            }, error => {
                                                console.log("Impossible de créer la table Reserves", error);
                                                return false;
                                            });
                                        }, error => {
                                            console.log("Impossible de créer la table Cartons", error);
                                            return false;
                                        });
                                    }, error => {
                                        console.log("Impossible de créer la table Set", error);
                                        return false;
                                    });
                                }, error => {
                                    console.log("Impossible de créer la table Partie", error);
                                    return false;
                                });
                            }, error => {
                                console.log("Impossible de créer la table Formule", error);
                                return false;
                            });
                        }, error => {
                            console.log("Impossible de créer la table Compo", error);
                            return false;
                        });
                    }, error => {
                        console.log("Impossible de créer la table Licencie", error);
                        return false;
                    });
                }, error => {
                    console.log("Impossible de créer la table Club", error);
                    return false;
                });
                }, error => {
                console.log("Impossible de créer la table Rencontre", error);
                return false;
            });
        }, error => {
            console.log("Impossible de créer/ouvrir la BDD", error);
            return false;
        });
        if(RespeqttDb.db == null) {
            console.log("!!! db NULL");
        } else {
            console.log("BDD ouverte ?", RespeqttDb.db.isOpen() ? "Yes" : "No");
        }
        return true;
    }


}
