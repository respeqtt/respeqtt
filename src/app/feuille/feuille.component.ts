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
import { Button, EventData } from "@nativescript/core";
import { SessionAppli } from "../session/session";
import { Rencontre } from "../db/RespeqttDAO";

import { Utils } from "@nativescript/core";

const fs = require("tns-core-modules/file-system");


import { File } from "@nativescript/core/file-system";
import * as SocialShare from "nativescript-social-share";

import { html2PdfFile } from 'nativescript-html2pdf';

import { getText, getTextSync, setText, setTextSync } from "nativescript-clipboard";

export function CopieDansPressePapier(texte:string) {
    setText(texte).then(() => {
        console.log("Copié : " + texte + " dans le presse papier");
    });

}

export function PasteFromPressePapier():string {

    return getTextSync();
}


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
            var r:Rencontre;
            Rencontre.getRencontre(SessionAppli.rencontreChoisie).then(ren =>{
                r = ren as Rencontre;
                console.log("Remplissage de la feuille de match...");
                SessionAppli.RemplirLaFeuille(r);
                console.log("Feuille de match remplie : " + SessionAppli.feuilleDeMatch.length + " octets");
            }, error => {
                console.log("Impossible de retrouver en BDD la rencontre choisie : ", error);
                return false;
            });

        }
    }

     onEnvoyer(args: EventData) {
        let button = args.object as Button;

        console.log("Envoi de la feuille ...");
        // Envoyer par mail
        SocialShare.shareText(SessionAppli.feuilleDeMatch, "Comment voulez-vous partager la feuille de match?");
        console.log("Feuille envoyée !");
    }

    // Fichier HTML + ouverture navigateur
    onConsulter(args: EventData) {
        let button = args.object as Button;

        // First get the required permissions
        // Note: this permissions should also be in your AndroidManifest.xml file as:
        //   <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
        // (Included by Nativescript)
        const permissions = require('nativescript-permissions')
        permissions.requestPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE)
        .then(() => {
            console.log('La permission WRITE_EXTERNAL_STORAGE a été accordée');
            // Get the publicly accessable Downloads directory path
            const sdDownloadPath = android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOWNLOADS).toString()
            console.log('sdDownloadPath: ' + sdDownloadPath)

            // Get a specific folder in that path (will be created if it does not exist)
            const myAppFolder = fs.Folder.fromPath(fs.path.join(sdDownloadPath, 'RESPEQTT'))
            console.log('RESPEQTT path: ' + myAppFolder.path)

            // Get a file in that path (will be created if it does not exist)
            // Note: In this case we try to get a unique file every time this code is run
            // const myFile = myAppFolder.getFile(`myfile_${date}.txt`)
            let htmlFile:File = myAppFolder.getFile('feuille-de-match.html');
                console.log('Fichier HTML : ' + htmlFile.path)

            // écrire le fichier HTML
            htmlFile.writeText(SessionAppli.feuilleDeMatch).then(() => {
                console.log("Fichier HTML écrit");
                // Consulter
                Utils.openFile(htmlFile.path);
            })
            .catch((err) => console.log(`Erreur lors de l'écriture du fichier HTML : ${err}`))
        })
        .catch(() => {
            console.error('La permission WRITE_EXTERNAL_STORAGE a été refusée!');
        });
    }


        // Fichier PDF
        onPDF(args: EventData) {
            let button = args.object as Button;

            // First get the required permissions
            // Note: this permissions should also be in your AndroidManifest.xml file as:
            //   <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
            // (Included by Nativescript)
            const permissions = require('nativescript-permissions')
            permissions.requestPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE)
            .then(() => {
                console.log('La permission WRITE_EXTERNAL_STORAGE a été accordée');
                // Get the publicly accessable Downloads directory path
                const sdDownloadPath = android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOWNLOADS).toString()
                console.log('sdDownloadPath: ' + sdDownloadPath)

                // Get a specific folder in that path (will be created if it does not exist)
                const myAppFolder = fs.Folder.fromPath(fs.path.join(sdDownloadPath, 'RESPEQTT'))
                console.log('RESPEQTT path: ' + myAppFolder.path)

                // Get a file in that path (will be created if it does not exist)
                // Note: In this case we try to get a unique file every time this code is run
                // const myFile = myAppFolder.getFile(`myfile_${date}.txt`)
                let pdfPath:string = myAppFolder.getFile('feuille-de-match.pdf').path;
                    console.log('myFile path: ' + pdfPath)
        //        let pdfPath: string = fs.knownFolders.documents().getFile('feuille-de-match.pdf').path;

                // convertit la feuille de match en PDF
                html2PdfFile(SessionAppli.feuilleDeMatch, pdfPath);

                // Ouvrir le lecteur de PDF
                Utils.openFile(pdfPath);
            })
            .catch(() => {
                console.error('La permission WRITE_EXTERNAL_STORAGE a été refusée!');
            });

    }



onQRCode(args: EventData) {
    let button = args.object as Button;

    // Convertir en QRCode

}

onCopier(args: EventData) {
    let button = args.object as Button;

    // Copier dans le presse papier
    CopieDansPressePapier(SessionAppli.feuilleDeMatch);
    console.log("Feuille copiée dans le presse papier");
}


     onFermer(args: EventData) {
        let button = args.object as Button;

        this.routeur.backToPreviousPage();
    }
}
