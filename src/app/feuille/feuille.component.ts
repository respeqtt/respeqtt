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
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";
import { Label, Button, EventData, TextField } from "@nativescript/core";
import { SessionAppli } from "../session/session";

import { knownFolders, path, File, Folder } from "@nativescript/core/file-system";
import * as SocialShare from "nativescript-social-share";

var utilityModule = require("utils/utils");

@Component({
    templateUrl: "./feuille.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"]
 })
export class FeuilleComponent {
    routeur: RouterExtensions;            // pour navigation
    titre:string;
    sousTitre:string;
    path:string;

    constructor(private _route: ActivatedRoute, private _routerExtensions: RouterExtensions) {

        this.routeur = _routerExtensions;
        this.titre = "Feuille de match";
        this.sousTitre = SessionAppli.titreRencontre;

        // construire la feuille de match
        if(SessionAppli.rencontreChoisie >=0) {
            SessionAppli.RemplirLaFeuille();
        }

        // enregistrer en tant que fichier
/*        var fs = require("file-system");
        let documentsFolder = fs.knownFolders.documents();
*/
        const documentsFolder:Folder = <Folder>knownFolders.documents();
        this.path = path.join(documentsFolder.path, "FeuilleDeMatch.html");
        const file:File = File.fromPath(this.path);

        // Ecriture du fichier
        file.writeText(SessionAppli.feuilleDeMatch)
            .then(result => {
                // Succeeded writing to the file.
                    console.log("Feuille de match enregistrée dans " + this.path);
                }).catch(err => {
                console.log("Erreur à l'écriture de la feuille de match");
                console.log(err.stack);
            });
    }

     onEnvoyer(args: EventData) {
        let button = args.object as Button;

        console.log("Envoi de la feuille ...");
        // Envoyer par mail
        SocialShare.shareHtml(SessionAppli.feuilleDeMatch, "Comment voulez-vous partager la feuille de match?");
        console.log("Feuille envoyée !");
    }

    onConsulter(args: EventData) {
        let button = args.object as Button;

        // est-ce que le fichier existe ?
        const documents = <Folder>knownFolders.documents();
        const filePath = path.join(documents.path, "FeuilleDeMatch.html");
        const exists = File.exists(filePath);
        console.log("Est-ce que la feuille de match existe ? "  + (exists ? "oui":"non"));

        // Consulter dans le navigateur

        utilityModule.openUrl("file://" + filePath);
    }

     onFermer(args: EventData) {
        let button = args.object as Button;

        this.routeur.backToPreviousPage();
    }
}
