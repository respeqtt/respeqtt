import { Device, Screen, isAndroid, isIOS } from "@nativescript/core/platform";


export class Mobile {

    largeurEcran:number;
    hauteurEcran:number;
    estAndroid:boolean;
    estIos:boolean;
    modele:string;
    langue: string;

    public constructor() {
        // The absolute height of the screen in density independent pixels.
        this.largeurEcran = Screen.mainScreen.widthDIPs;
        console.log("screen.mainScreen.heightDIPs=" +  this.largeurEcran);
        // The absolute width of the screen in density independent pixels.
        this.hauteurEcran = Screen.mainScreen.heightDIPs;
        console.log("screen.mainScreen.widthDIPs=" +  this.hauteurEcran);
        // Quel OS ?
        this.estAndroid = isAndroid;
        this.estIos = isIOS;
        // Quel téléphone ?
        this.modele = Device.model;
        // Quelle langue ?
        this.langue = Device.language;
    }

}

export class StringListElt {
    s: string;
    sel:boolean;

    constructor(s:string){
        this.s = s;
        this.sel = false;
    }
}

