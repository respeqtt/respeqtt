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

import { registerElement } from "@nativescript/angular";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "@nativescript/angular";
import { EventData } from "@nativescript/core";
import { BarcodeScanner } from "nativescript-barcodescanner";
import { SessionAppli } from "../session/session";
import { ListeFormules, Partie, Licencie, EltListeLicencie, FormuledeRencontre, Club } from "../db/RespeqttDAO";

@Component({
    templateUrl: "./qrscan.component.html",
    moduleId:module.id,
    styleUrls: ["../global.css"]
 })
export class QRScanComponent implements OnInit{

    trace:string;
    pause: boolean;
    monScanner:BarcodeScanner;
    resultat:string;
    router:RouterExtensions;
    quoi:string;
    iPartie:number;
    titre:string;
    sousTitre:string;
    cote:boolean;
    version:string;



    constructor(private _route: ActivatedRoute, private _routerExtensions: RouterExtensions) {
        // version logicielle
        this.version = SessionAppli.version;


        this.trace = "";
        this.pause = false;
        this.router = _routerExtensions;

        this.quoi = this._route.snapshot.paramMap.get("quoi");
        // si on scanne une partie, on est en mode hors rencontre dans l'onglet partie
        if(this.quoi == "PARTIE") {
            this.iPartie = Number(this._route.snapshot.paramMap.get("param"));

            console.log("SCAN de la partie " + this.iPartie);

            this.titre = "Scan de la partie";
            this.sousTitre = "au choix";

        }

        // si on scanne une compo de double, on est en mode rencontre
        if(this.quoi == "EQUIPE") {
            this.titre = "Scan d'une équipe";
            this.sousTitre = "pour composer les doubles";
            if(this._route.snapshot.paramMap.get("param") == "X") {
                this.cote = true;
            } else {
                this.cote = false;
            }
        }

        // si on scanne une compo de double, on est en mode rencontre
        if(this.quoi == "DOUBLES") {
            this.titre = "Scan de la composition des doubles";
            this.sousTitre = "de l'équipe " + this._route.snapshot.paramMap.get("param");
            if(this._route.snapshot.paramMap.get("param") == "X") {
                this.cote = true;
            } else {
                this.cote = false;
            }
        }

        // si on scanne le résultat d'une partie, mémoriser son indice dans la liste des parties en cours
        if(this.quoi == "RESULTAT") {
            this.iPartie = Number(this._route.snapshot.paramMap.get("param"));

            console.log("SCAN résultat de la partie " + this.iPartie);

            this.titre = "Scan du résultat de la partie";
            this.sousTitre = SessionAppli.listeParties[this.iPartie].desc;

        }

        if(this.quoi == "COMPO") {
            if(this._route.snapshot.paramMap.get("param") == "X") {
                this.cote = true;
            } else {
                this.cote = false;
            }
            console.log("SCAN compo côté " + this._route.snapshot.paramMap.get("param")+"=" + this.cote);
            this.titre = "Scan de la composition de l'équipe";
            if(this.cote) {
                // X
                this.sousTitre = "X - " + SessionAppli.clubX.nom;
            } else {
                // A
                this.sousTitre = "A - " + SessionAppli.clubA.nom;
            }
        }

        registerElement("BarcodeScanner", () => require("nativescript-barcodescanner").BarcodeScannerView);

        this.monScanner = new BarcodeScanner();
    }

    ngOnInit(): void {


    }

    scanCode(args: EventData) {
        this.monScanner.scan(
            {
                formats: "QR_CODE", // peut aussi faire EAN_13
                cancelLabel: "EXIT. Essayer aussi le bouton de volume !", // iOS only, default 'Close'
                cancelLabelBackgroundColor: "#333333", // iOS only, default '#000000' (black)
                message: "Placer le QRCode dans le rectangle", // Android only, default is 'Place a barcode inside the viewfinder rectangle to scan it.'
                showFlipCameraButton: false,   // default false
                preferFrontCamera: false,     // default false
                showTorchButton: false,        // default false
                beepOnScan: true,             // Play or Suppress beep on scan (default true)
                fullScreen: true,             // Currently only used on iOS; with iOS 13 modals are no longer shown fullScreen by default, which may be actually preferred. But to use the old fullScreen appearance, set this to 'true'. Default 'false'.
                torchOn: false,               // launch with the flashlight on (default false)
                closeCallback: () => { console.log("Scanner fermé")}, // invoked when the scanner was closed (success or abort)
                resultDisplayDuration: 500,   // Android only, default 1500 (ms), set to 0 to disable echoing the scanned text
                orientation: "portrait",     // Android only, default undefined (sensor-driven orientation), other options: portrait|landscape
                openSettingsIfPermissionWasPreviouslyDenied: true, // On iOS you can send the user to the settings app if access was previously denied
                presentInRootViewController: true // iOS-only; If you're sure you're not presenting the (non embedded) scanner in a modal, or are experiencing issues with fi. the navigationbar, set this to 'true' and see if it works better for your app (default false).
              }).then((result) => {

                  this.trace = result.text;
                  console.log("*** Scan=" + result.text);
                  // si c'est une partie
                  if(this.quoi == "PARTIE") {
                      console.log("-- Scan PARTIE --");
                      var iPartie:number;
                    // créer la partie si on n'en a pas
                    if(SessionAppli.listeParties.length ==0) {
                        var p:Partie = new Partie(ListeFormules.getFormule(SessionAppli.formule), "", null, null, false, false);
                        SessionAppli.listeParties.push(p);
                    }
                    // lire le JSON et aller à la page de saisie des résultats
                    iPartie = SessionAppli.listeParties[this.iPartie].JsonToPartie(result.text);
                    console.log("Partie " + iPartie.toString());
                    // aller à la page de saisie des scores
                    if(iPartie >=0) {
                        this.router.navigate(["resultat/" + iPartie]);
                        return;
                    } else {
                        alert("QRCode incorrect");
                    }
                  }
                  // si c'est une équipe pour la compo des doubles
                  if(this.quoi == "EQUIPE") {
                    console.log("-- Scan EQUIPE --");
                    // lire le JSON pour permettre la compo des doubles
                    let equipe:EltListeLicencie[] = SessionAppli.JsonToEquipe(result.text, null, null);
                    let iClub:number = SessionAppli.JsonToClub(result.text);
                    let club = new Club;
                    club.id  = iClub;
                    club.nom = iClub.toString();
                    if(equipe) {
                        //trouver le coté
                        let cote:string;
                        if(equipe[0].place.charCodeAt(0) < "M".charCodeAt(0)) {
                            cote ="A";
                            SessionAppli.equipeA = equipe;
                            SessionAppli.clubA = club;

                        }
                        else {
                            cote = "X";
                            SessionAppli.equipeX = equipe;
                            SessionAppli.clubX = club;
                        }
                        // aller à la page de compo des doubles
                        // trouver le nb de doubles
                        const nFormule = SessionAppli.JsonToFormule(result.text);
                        console.log("Cherche formule=" + result.text + ", trouvé = " + nFormule.toString());
                        const f:FormuledeRencontre=ListeFormules.getFormule(nFormule);
                        if(f) {
                            console.log("appel de : " + "compoDouble/" + cote + "/1/" + f.nbDoubles.toString())
                            this.router.navigate(["compoDoubleExt/" + cote + "/1/" + f.nbDoubles.toString()]);
                        }
                        else {
                            console.log("Pas trouvé la formule " + nFormule.toString());
                        }
                    } else {
                        alert("QRCode incorrect");
                    }

                    return;
                  }
                  // si c'est un double
                  if(this.quoi == "DOUBLES") {
                    console.log("-- Scan DOUBLES --");
                    var iPartie:number;
                    // lire le JSON et mettre à jour la liste des parties avec la compo des doubles
                    SessionAppli.JsonToDoubles(result.text, this.cote);
                    // retour à la page de lancement des parties
                    this.router.navigate(["lancement"]);
                    return;
                  }
                  // si c'est un résultat
                  if(this.quoi == "RESULTAT") {
                    console.log("-- Scan RESULTAT --");
                    var iPartie:number;
                    // lire le JSON et mettre à jour la liste des parties avec les scores et les sets
                    iPartie = Partie.JsonToScore(result.text);
                    if(iPartie > 0) {

                    } else {
                        alert("QRCode incorrect");
                    }
                    // retour à la page de lancement des parties
                    this.router.navigate(["lancement"]);
                    return;
                  }
                  if(this.quoi == "COMPO") {
                    console.log("-- Scan COMPO --");
                    // lire le JSON et mettre à jour la compo de l'équipe selon le coté
                    if(this.cote) {
                        SessionAppli.equipeX = SessionAppli.JsonToEquipe(result.text, SessionAppli.clubX.id, this.cote ? "X" : "A");
                        if(SessionAppli.equipeX.length == 0) {
                            alert("Ce n'est pas l'équipe attendue");
                        } else {
                            console.log("Equipe X :" + SessionAppli.equipeX.length + " joueurs");
                            for(var i = 0; i < SessionAppli.equipeX.length; i++) {
                                console.log(SessionAppli.equipeX[i].place + "/ "
                                        + SessionAppli.equipeX[i].id + " "
                                        + SessionAppli.equipeX[i].nom + " "
                                        + SessionAppli.equipeX[i].prenom + " "
                                        + SessionAppli.equipeX[i].points + "pts");
                            }
                            const licCapitaine:number = SessionAppli.JsonToCapitaine(result.text);
                            Licencie.get(licCapitaine, SessionAppli.clubX.id).then(j =>{
                                if(j) {
                                    SessionAppli.capitaineX = j as EltListeLicencie;
                                } else {
                                    alert("Licence " + licCapitaine + " inconnue");
                                }
                            }, error => {alert("La licence " + licCapitaine.toString() + " ne fait pas partie du club " + SessionAppli.clubX.nom);
                            });
                        }
                    } else {
                        SessionAppli.equipeA = SessionAppli.JsonToEquipe(result.text, SessionAppli.clubA.id, this.cote ? "X" : "A");
                        if(SessionAppli.equipeA.length == 0) {
                            alert("Ce n'est pas l'équipe attendue");
                        } else {
                            console.log("Equipe A :" + SessionAppli.equipeA.length + " joueurs");
                            for(var i = 0; i < SessionAppli.equipeA.length; i++) {
                                console.log(SessionAppli.equipeA[i].place + "/ "
                                        + SessionAppli.equipeA[i].id + " "
                                        + SessionAppli.equipeA[i].nom + " "
                                        + SessionAppli.equipeA[i].prenom + " "
                                        + SessionAppli.equipeA[i].points + "pts");
                            }
                            const licCapitaine:number = SessionAppli.JsonToCapitaine(result.text);
                            Licencie.get(licCapitaine, SessionAppli.clubA.id).then(j =>{
                                if(j) {
                                    SessionAppli.capitaineA = j as EltListeLicencie;
                                } else {
                                    alert("Licence " + licCapitaine + " inconnue");
                                }
                            }, error => {alert("La licence " + licCapitaine.toString() + " ne fait pas partie du club " + SessionAppli.clubA.nom);
                            });                        }
                        }
                    }
                    // retour à la page de compo des équipes
                    this.router.navigate(["preparation"]);
                    return;
                }, (errorMessage) => {
                  console.log("No scan : " + errorMessage);
                }
        );
      }

    onScanResult(args: EventData) {
            console.log("scan terminé");
    }

    onFermer(args: EventData) {
        switch(this.quoi) {
            case "PARTIE":
                this.router.navigate(["resultat/" + this.iPartie]);
            break;
            case "COMPO":
                this.router.navigate(["preparation"]);
            break;
            case "EQUIPE":
                this.router.navigate(["actions"]);
            break;
            case "DOUBLES":
                this.router.navigate(["actions"]);
            break;
        }
    }
}
