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
import { Signature } from "../db/RespeqttDAO";
import { ListeFormules, Partie, Licencie, EltListeLicencie, FormuledeRencontre, Club } from "../db/RespeqttDAO";
import { Respeqtt } from "../db/RespeqttDAO";

import { erreur } from "../outils/outils";
import { ViewContainerRef } from "@angular/core";
import { ModalDialogService } from "@nativescript/angular";

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
    destination:string;



    constructor(private _route: ActivatedRoute, private _routerExtensions: RouterExtensions, private modal: ModalDialogService, private vcRef: ViewContainerRef) {
        // version logicielle
        this.version = SessionAppli.version;


        this.trace = "";
        this.pause = false;
        this.router = _routerExtensions;

        // par défaut
        this.destination = "actions";

        this.quoi = this._route.snapshot.paramMap.get("quoi");
        switch(this.quoi) {
            case "PARTIE" :        // si on scanne une partie, on est en mode hors rencontre dans l'onglet partie
                this.iPartie = Number(this._route.snapshot.paramMap.get("param"));

                console.log("SCAN de la partie " + this.iPartie);

                this.titre = "Scan de la partie";
                this.sousTitre = "au choix";
            break;
            case "EQUIPE" :        // si on scanne une compo de double, on est en mode rencontre
                this.titre = "Scan d'une équipe";
                this.sousTitre = "pour composer les doubles";
                if(this._route.snapshot.paramMap.get("param") == "X") {
                    this.cote = true;
                } else {
                    this.cote = false;
                }
            break;
            case "DOUBLES" :             // si on scanne une compo de double, on est en mode rencontre
                this.titre = "Scan de la composition des doubles";
                this.sousTitre = "de l'équipe " + this._route.snapshot.paramMap.get("param");
                if(this._route.snapshot.paramMap.get("param") == "X") {
                    this.cote = true;
                } else {
                    this.cote = false;
                }
            break;
            case "RESULTAT" : // si on scanne le résultat d'une partie, mémoriser son indice dans la liste des parties en cours
                this.iPartie = Number(this._route.snapshot.paramMap.get("param"));

                console.log("SCAN résultat de la partie " + this.iPartie);

                this.titre = "Scan du résultat de la partie";
                this.sousTitre = SessionAppli.listeParties[this.iPartie].desc;
            break;
            case "COMPO" : 
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
            break;
            case "SIGNATURE" :         // si on scanne une signature, on la mémorise pour l'équipe qui se déplace
                let capitaine:string = this._route.snapshot.paramMap.get("param");

                console.log("SCAN signature de " + capitaine);

                this.titre = "Scan de la signature de ";
                this.sousTitre = capitaine;
            break;
        }

        registerElement("BarcodeScanner", () => require("nativescript-barcodescanner").BarcodeScannerView);
        this.monScanner = new BarcodeScanner();
    }

    ngOnInit(): void {
    }

    scanCode(args: EventData) {
        this.monScanner.scan({
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
            switch(this.quoi) {
                case "PARTIE" : // si c'est une partie
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
                        this.destination = "resultat/" + iPartie;
                    } else {
                        alert("QRCode incorrect");
                    }
                break;
                case "EQUIPE" : // si c'est une équipe
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
                            this.destination = "compoDoubleExt/" + cote + "/1/" + f.nbDoubles.toString();
                        }
                        else {
                            console.log("Pas trouvé la formule " + nFormule.toString());
                        }
                    } else {
                        erreur(this, "Ce n'est pas l'équipe attendue, vérifiez le club (" + iClub.toString() + ")");
                    }
                break;
                case "DOUBLES" :    // si c'est un double
                    console.log("-- Scan DOUBLES --");
                    var iPartie:number;
                    // lire le JSON et mettre à jour la liste des parties avec la compo des doubles
                    SessionAppli.JsonToDoubles(result.text, this.cote);
                    // retour à la page de lancement des parties
                    this.destination = "lancement";
                break;
                case "RESULTAT" :   // si c'est un résultat de partie
                    console.log("-- Scan RESULTAT --");
                    var iPartie:number;
                    // lire le JSON et mettre à jour la liste des parties avec les scores et les sets
                    iPartie = Partie.JsonToScore(result.text);
                    if(iPartie > 0) {

                    } else {
                        alert("QRCode incorrect");
                    }
                    // retour à la page de lancement des parties
                    this.destination = "lancement";
                break;
                case "COMPO" :  // si c'est une compo d'équipe

                    console.log("-- Scan COMPO --");
                    // lire le JSON et mettre à jour la compo de l'équipe selon le coté
                    if(this.cote) {
                        SessionAppli.equipeX = SessionAppli.JsonToEquipe(result.text, SessionAppli.clubX.id, this.cote ? "X" : "A");
                        if(SessionAppli.equipeX.length == 0) {
                            console.log("Ce n'est pas l'équipe attendue");
                            erreur(this, "Ce n'est pas l'équipe attendue, vérifiez le club (" + SessionAppli.clubX.id.toString() + ") et le côté (" + (this.cote ? "X)" : "A)"));
                        } else {
                            console.log("Equipe de " + SessionAppli.equipeA.length.toString() + " joueurs");
                            let licCapitaineX:number;
                            console.log("Equipe X :" + SessionAppli.equipeX.length + " joueurs");
                            licCapitaineX = SessionAppli.JsonToCapitaine(result.text);
                            console.log("*** Capitaine = " + licCapitaineX.toString());
                            for(var i = 0; i < SessionAppli.equipeX.length; i++) {
                                // recherche du capitaine
                                console.log(SessionAppli.equipeX[i].place + "/ "
                                        + SessionAppli.equipeX[i].id + " "
                                        + SessionAppli.equipeX[i].nom + " "
                                        + SessionAppli.equipeX[i].prenom + " "
                                        + SessionAppli.equipeX[i].points + "pts");
                                if(SessionAppli.equipeX[i].id == licCapitaineX) {
                                    SessionAppli.capitaineX = SessionAppli.equipeX[i];
                                    console.log("+++ Capitaine = " + SessionAppli.capitaineX.nom);
                                }
                            }
                            // si le capitaine n'est pas un joueur de l'équipe on n'a que son numéro de licence
                            if(SessionAppli.capitaineX == null) {
                                let cap:EltListeLicencie = new EltListeLicencie();
                                cap.nom = "";
                                cap.id = licCapitaineX;
                                cap.prenom = "";
                                SessionAppli.capitaineX = cap;
                                console.log("--- Capitaine = " + SessionAppli.capitaineX.id.toString());
                            }
                        }
                    } else {
                        SessionAppli.equipeA = SessionAppli.JsonToEquipe(result.text, SessionAppli.clubA.id, this.cote ? "X" : "A");
                        if(SessionAppli.equipeA.length == 0) {
                            erreur(this, "Ce n'est pas l'équipe attendue, vérifiez le club (" + SessionAppli.clubA.id.toString() + ") et le côté (" + (this.cote ? "X)" : "A)"));
                        } else {
                            console.log("Equipe de " + SessionAppli.equipeA.length.toString() + " joueurs");
                            let licCapitaineA:number;
                            console.log("Equipe A :" + SessionAppli.equipeA.length + " joueurs");
                            licCapitaineA = SessionAppli.JsonToCapitaine(result.text);
                            for(var i = 0; i < SessionAppli.equipeA.length; i++) {
                                console.log(SessionAppli.equipeA[i].place + "/ "
                                        + SessionAppli.equipeA[i].id + " "
                                        + SessionAppli.equipeA[i].nom + " "
                                        + SessionAppli.equipeA[i].prenom + " "
                                        + SessionAppli.equipeA[i].points + "pts");
                                if(SessionAppli.equipeA[i].id == licCapitaineA) {
                                    SessionAppli.capitaineA = SessionAppli.equipeA[i];
                                }
                            }
                            // si le capitaine n'est pas un joueur de l'équipe on n'a que son numéro de licence
                            if(SessionAppli.capitaineA == null) {
                                let cap:EltListeLicencie = new EltListeLicencie();
                                cap.nom = "";
                                cap.id = licCapitaineA;
                                cap.prenom = "";
                                SessionAppli.capitaineA = cap;
                            }
                        }
                    }
                    // retour à la page de compo des équipes
                    this.destination = "preparation";
                break;
                case "SIGNATURE" : // si c'est une signature
                    console.log("-- Scan SIGNATURE --");
                    // lire le JSON et mettre à jour la signature du capitaine visiteur
                    let sig = new Signature();
                    if(sig.JsonToSignature(result.text)) {
                        if(SessionAppli.recoitCoteX) {
                            this.EnregistreSignatures(sig.GetSignature(), Respeqtt.GetSignature(), sig.GetLicence());
                        } else {
                            this.EnregistreSignatures(Respeqtt.GetSignature(), sig.GetSignature(), sig.GetLicence());
                        }
                    }
                    this.destination = "signer/" + sig.GetLicence().toString();
                break;
                case "SCORES" :
                    SessionAppli.JSonToScores(result.text);
                    // retour à la page de consultation des scores
                    this.destination = "lancement";
                break;
                case "RENCONTRE" :
                    SessionAppli.JSonToRencontre(result.text);
                    // retour à la page de consultation des actions
                    this.destination = "actions";
                break;
            }
            // retour à la page appelante
            this.router.navigate([this.destination],
                {
                    animated:true,
                    transition: {
                        name : SessionAppli.animationRetour, 
                        duration : 380,
                        curve : "easeIn"
                    }
                });
        
        }, (errorMessage) => {
            console.log("No scan : " + errorMessage);
        });    
    }

    onScanResult(args: EventData) {
            console.log("scan terminé");
    }

    onFermer(args: EventData) {

            // retour à la page appelante
            this.router.navigate([this.destination],
                {
                    animated:true,
                    transition: {
                        name : SessionAppli.animationRetour, 
                        duration : 380,
                        curve : "easeIn"
                    }
                });

    }
    EnregistreSignatures(sigA:string, sigX:string, lic:number) {
        
        SessionAppli.signatureA = sigA;
        SessionAppli.signatureX = sigX;
 
    }
}
