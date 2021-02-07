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

// double les ' dans le SQL et ajoute les ' en début et fin de chaine
export function toSQL(s:string):string {
    const pattern:RegExp = /'/g;
    const insert:string = "''";
    return "'" + s.replace(pattern, insert) + "'";
}

// traduit un booléen en entier (VRAI = 1, FAUX = 0)
export function bool2SQL(b:boolean):number {
    return b ? 1: 0;
}

// traduit un booléen en entier (0 = FAUX, autres = VRAI)
export function SQL2bool(n:number):boolean {
    return n != 0;
}

