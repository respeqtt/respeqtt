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

    public OS():string {
        return this.estAndroid ? "android" : "IOS";
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

// échappe les / dans les paramètres des URL
export function toURLQuote(s:string):string {
    const pattern:RegExp = /\//g;
    const insert:string = "%2F";
    return "'" + toURL(s) + "'";
}

// échappe les / dans les paramètres des URL
export function toURL(s:string):string {
    const pattern:RegExp = /\//g;
    const insert:string = "%2F";
    return s.replace(pattern, insert);
}

// décode les / dans les paramètres des URL
export function URLtoString(s:string):string {
    const pattern:RegExp = /%2F/g;
    const insert:string = "/";
    return "'" + URLtoStringSansQuote(s) + "'";
}

// décode les / dans les paramètres des URL
export function URLtoStringSansQuote(s:string):string {
    const pattern:RegExp = /%2F/g;
    const insert:string = "/";
    return s.replace(pattern, insert);
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

// renvoie la date courante sous la forme d'une chaine JJ/MM/AAAA
export function Aujourdhui(maintenant:Date):string {

    var j:number = maintenant.getDate();
    var mois:number = maintenant.getMonth();
    var annee:number = maintenant.getFullYear();

    return (j > 9 ? j : "0" + j) + "/" + (mois > 9 ? mois : "0" + mois) + "/" + annee.toString();
}

// renvoie l'heure courante sous la forme d'une chaine hhHmm
export function HeureMinCourante(maintenant:Date):string {


    var heures:number = maintenant.getHours();
    var min:number = maintenant.getMinutes();

    return (heures > 9 ? heures : heures + " ") + "H" + (min > 9 ? min : "0" + min);
}


// renvoie la date heure courante sous la forme d'une chaine JJ/MM/AAAA HH:MI
export function Maintenant():string {

    const maintenant = new Date();
    return Aujourdhui(maintenant) + " " + HeureMinCourante(maintenant);

}


