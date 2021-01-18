import { Club, EltListeLicencie, Partie, Rencontre, EltListeRencontre } from "../db/RespeqttDAO";

export class SessionAppli {

    public static listeRencontres:Array<EltListeRencontre>=[];
    public static recoitCoteX = false;
    public static clubChoisi:number = -1;
    public static rencontreChoisie = -1;
    public static titreRencontre = "";
    public static rencontre:Rencontre=null;
    public static clubA:Club=null;
    public static clubX:Club=null;
    public static equipeA:Array<EltListeLicencie>=[];
    public static equipeX:Array<EltListeLicencie>=[];
    public static forfaitA:boolean=false;
    public static forfaitX:boolean=false;
    public static dimEcran:number=0;    // plus petite dimension de l'écran
    public static compoFigee:boolean=false;
    public static scoreValide:boolean=false;
    public static listeParties:Array<Partie>=[];
    public static reserveClubA:string="";
    public static reserveClubX:string="";
    public static reclamationClubA:string="";
    public static reclamationClubX:string="";
    public static rapportJA:string="";
    public static nomJA:string="";
    public static prenomJA:string="";
    public static adresseJA:string="";
    public static licenceJA:number=0;
    public static score:string="";
    public static scoreA:number=0;
    public static scoreX:number=0;

    // sleep
    public static delay(ms: number){
        return new Promise(resolve => setTimeout(resolve, ms));
        }

    // Mise à jour du score
    // renvoie true si toutes les parties ont été disputées, false sinon
    public static MajScore():boolean {
        var scoreA:number = 0;
        var scoreX:number = 0;
        var scoreComplet:boolean = true;

        console.log("Calcul du score");
        for(var i = 0; i < SessionAppli.listeParties.length; i++) {
            if(SessionAppli.listeParties[i].scoreAX != "") {
                switch(SessionAppli.listeParties[i].score) {
                    case -1: // joueurs A et X forfaits
                    break;
                    case 0: // forfait joueur A
                        scoreX = scoreX + 2;
                    break;
                    case 1: // victoire joueur X
                        scoreA = scoreA + 1;
                        scoreX = scoreX + 2;
                    break;
                    case 2: // victoire joueur A
                        scoreA = scoreA + 2;
                        scoreX = scoreX + 1;
                    break;
                    case 3: // forfait joueur A
                        scoreA = scoreA + 2;
                    break;
                    default:
                        console.log("Score incorrect :" + SessionAppli.listeParties[i].desc + SessionAppli.listeParties[i].score);
                }
            } else {
                console.log(SessionAppli.listeParties[i].desc + SessionAppli.listeParties[i].score);
                scoreComplet = false;
            }
        }
        SessionAppli.scoreA = scoreA;
        SessionAppli.scoreX = scoreX;
        SessionAppli.score = scoreA.toString() + "-" + scoreX.toString();

        return scoreComplet;
    }

    // encode l'équipe en JSON
    public static EquipetoJSon(equipe:Array<EltListeLicencie>, numClub:number):string {
        var json:string='{"club":"';

        json = json + numClub.toString() + '", "equipe":[';

        for(var i=0; i < equipe.length; i++){
            if(i>0) json = json + ",";
            // ajouter chaque joueur : lettre + n° de licence seulement
            json = json + '{"place":"'  + equipe[i].place + '",';
            json = json + '"licence":"' + equipe[i].id + '",';
            json = json + '"nom":"'     + equipe[i].nom + '",';
            json = json + '"prenom":"'  + equipe[i].prenom + '",';
            json = json + '"points":"'  + equipe[i].points + '"}';
        }
        json = json + ']}';

        console.log("Equipe json =" + json);

        return json;
    }

    // décode le JSON en équipe
    public static JsonToEquipe(json:string, rencontre:Rencontre, club:number, cote:boolean):Array<EltListeLicencie> {
        var data;
        var equipe:Array<EltListeLicencie>=[];

        data = JSON.parse(json);
        // controles
        if(data.club == club) {
            for(var i = 0; i < data.equipe.length; i++) {
                const codePlace = data.equipe[i].place.charCodeAt(0);
                if((cote && codePlace >= "Z".charCodeAt(0) - rencontre.nbJoueurs)
                || (!cote && codePlace < "A".charCodeAt(0) + rencontre.nbJoueurs)) {
                    // ajouter le joueur dans la liste
                    var  elt:EltListeLicencie = new EltListeLicencie();
                    elt.id = Number(data.equipe[i].licence);
                    elt.place = data.equipe[i].place;
                    elt.nom = data.equipe[i].nom;
                    elt.prenom = data.equipe[i].prenom;
                    elt.points = Number(data.equipe[i].points);
                    equipe.push(elt);
                } else {
                    console.log("!!! Place pas cohérente avec le côté " + (cote ? "X" : "A"));
                    equipe = [];
                }
            }
        } else {
            console.log("!!! Club attendu " + club + " ; club lu : " + data.club);
            equipe = [];
        }
        return equipe;
    }



}
