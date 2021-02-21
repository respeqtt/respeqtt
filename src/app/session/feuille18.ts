export class Feuille18 {

    public static FeuilleVide():string {
        return `
        <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" >
        <style>
            table, th, td {
                border: 1px solid black;
                border-collapse: collapse;
            }
            th, td {
                 padding: 5px;
            }
        </style>
    </head>
    <body lang=FR>
    <table id="tabEntete" style="min-width:1500px">
        <tr max-height="50px">
            <td rowspan="2" style="width:5%">
                <img src="fftt.png" width="50px" height="50px">
            </td>
            <td style="width:90%;font-size:30px;padding-top:10;padding-bottom:0;margin-top:0;margin-bottom:0;text-align:center;vertical-align:middle">
            <b>FEDERATION FRANÇAISE DE TENNIS DE TABLE
            </td>
            <td rowspan="2" style="width:5%;vertical-align:bottom;font-size:8px">C.S.F. 11.2.0.4</td>
        </tr>
        <tr>
            <td style="width:70%;font-size:20px;padding-top:0;padding-bottom:10;margin-top:0;margin-bottom:0;text-align:center;vertical-align:middle">
            <b>Championnat par Equipes
            </td>
        </tr>
    </table>
    <table id="tabRencontre" style="min-width:1500px">
        <tr>
            <td style="width:49%">Nom, Prénom, Adresse du juge arbitre : <b>#JA</td>
            <td style="width:2%"> </td>
            <td colspan="2" style="width:25%">Lieu de rencontre : <b>#Lieu</td>
            <td colspan="2" style="width:25%">Ligue : <b>#Ligue </td>
        </tr>
        <tr>
            <td></td>
            <td> </td>
            <td>Date : <b>#Date</td>
            <td>Heure : <b>#Heure </td>
            <td>Division : <b>#Division </td>
            <td>Poule : <b>#Poule </td>
        </tr>
        <tr>
            <td></td>
            <td> </td>
            <td style="text-align:center">*National </td>
            <td style="text-align:center">*Régional </td>
            <td colspan="2" style="text-align:center">*Départemental  </td>
        </tr>
        <tr>
            <td></td>
            <td> </td>
            <td style="text-align:center">*Masculin  </td>
            <td style="text-align:center">*Féminin :  </td>
            <td colspan="2"> </td>
        </tr>
        <tr>
            <td colspan="6" style="width:100%"> </td>
        </tr>
    </table>
    <table id="tabEquipes" style="min-width:1500px">
        <tr>
            <td style="width:15%">N°<b>#IdClubA</td>
            <td colspan="4" style="width:34%">Association <b>#NomCLubA</td>
            <td style="width:2%"></td>
            <td style="width:15%">N°<b>#IdClubX</td>
            <td colspan="4" style="width:34%">Association <b>#NomCLubX</td>
        </tr>
        <tr>
            <td style="width:15%"><b>N° Licence</td>
            <td style="width:19%"><b>NOM-PRENOM</td>
            <td style="width:5%"><b>Points</td>
            <td style="width:5%"><b>
                <p style="padding-top:0;padding-bottom:0;margin-top:0;margin-bottom:0;">Muté</p>
                <p style="padding-top:0;padding-bottom:0;margin-top:0;margin-bottom:0;">Etranger</p>
            </td>
            <td style="width:5%"><b>Cartons</td>
            <td style="width:2%"></td>
            <td style="width:15%"><b>N° Licence</td>
            <td style="width:19%"><b>NOM-PRENOM</td>
            <td style="width:5%"><b>Points</td>
            <td style="width:5%"><b>
                <p style="padding-top:0;padding-bottom:0;margin-top:0;margin-bottom:0;">Muté</p>
                <p style="padding-top:0;padding-bottom:0;margin-top:0;margin-bottom:0;">Etranger</p>
            </td>
            <td style="width:5%"><b>Cartons</td>
        </tr>
        <tr>
            <td style="width:15%">A   <b>#IdA</td>
            <td style="width:19%"><b>#NomPrenomA</td>
            <td style="width:5%"><b>#PtsA</td>
            <td style="width:5%"><b>#MutEtrA</td>
            <td style="width:5%"><b>#NbCartA</td>
            <td style="width:2%"></td>
            <td style="width:15%">W   <b>#IdW</td>
            <td style="width:19%"><b>#NomPrenomW</td>
            <td style="width:5%"><b>#PtsW</td>
            <td style="width:5%"><b>#MutEtrW</td>
            <td style="width:5%"><b>#NbCartW</td>
        </tr>
        <tr>
            <td style="width:15%">B   <b>#IdB</td>
            <td style="width:19%"><b>#NomPrenomB</td>
            <td style="width:5%"><b>#PtsB</td>
            <td style="width:5%"><b>#MutEtrB</td>
            <td style="width:5%"><b>#NbCartB</td>
            <td style="width:2%"></td>
            <td style="width:15%">X   <b>#IdX</td>
            <td style="width:19%"><b>#NomPrenomX</td>
            <td style="width:5%"><b>#PtsX</td>
            <td style="width:5%"><b>#MutEtrX</td>
            <td style="width:5%"><b>#NbCartX</td>
        </tr>
        <tr>
            <td style="width:15%">C   <b>#IdC</td>
            <td style="width:19%"><b>#NomPrenomC</td>
            <td style="width:5%"><b>#PtsC</td>
            <td style="width:5%"><b>#MutEtrC</td>
            <td style="width:5%"><b>#NbCartC</td>
            <td style="width:2%"></td>
            <td style="width:15%">Y   <b>#IdY</td>
            <td style="width:19%"><b>#NomPrenomY</td>
            <td style="width:5%"><b>#PtsY</td>
            <td style="width:5%"><b>#MutEtrY</td>
            <td style="width:5%"><b>#NbCartY</td>
        </tr>
        <tr>
            <td style="width:15%">D   <b>#IdD</td>
            <td style="width:19%"><b>#NomPrenomD</td>
            <td style="width:5%"><b>#PtsD</td>
            <td style="width:5%"><b>#MutEtrD</td>
            <td style="width:5%"><b>#NbCartD</td>
            <td style="width:2%"></td>
            <td style="width:15%">Z   <b>#IdZ</td>
            <td style="width:19%"><b>#NomPrenomZ</td>
            <td style="width:5%"><b>#PtsZ</td>
            <td style="width:5%"><b>#MutEtrZ</td>
            <td style="width:5%"><b>#NbCartZ</td>
        </tr>
        <tr>
            <td colspan="11" style="width:100%"> </td>
        </tr>
    </table>
    <table id="tabParties" style="min-width:1500px">
        <tr>
            <td colspan="5" style="width:25%;text-align:center"><b>SCORES</td>
            <td colspan="3" rowspan="2" style="width:59%;text-align:center"><b>ORDRE DES PARTIES</td>
            <td colspan="2" style="width:16%;text-align:center"><b>POINTS</td>
        </tr>
        <tr>
            <td style="width:5%;text-align:center"><b>1</td>
            <td style="width:5%;text-align:center"><b>2</td>
            <td style="width:5%;text-align:center"><b>3</td>
            <td style="width:5%;text-align:center"><b>4</td>
            <td style="width:5%;text-align:center"><b>5</td>
            <td style="width:8%;text-align:center"><b>ABCD</td>
            <td style="width:8%;text-align:center"><b>WXYZ</td>
        </tr>
        <tr id="AvsW">
            <td style="width:5%;text-align:center"><b>#P1S1</td>
            <td style="width:5%;text-align:center"><b>#P1S2</td>
            <td style="width:5%;text-align:center"><b>#P1S3</td>
            <td style="width:5%;text-align:center"><b>#P1S4</td>
            <td style="width:5%;text-align:center"><b>#P1S5</td>
            <td style="width:27%">A   <b>#NomPrenomA</td>
            <td style="width:5%;text-align:center">contre</td>
            <td style="width:27%">W  <b>#NomPrenomW</td>
            <td style="width:8%;text-align:center"><b>#P1SA</td>
            <td style="width:8%;text-align:center"><b>#P1SX</td>
        </tr>
        <tr id="BvsX">
            <td style="width:5%;text-align:center"><b>#P2S1</td>
            <td style="width:5%;text-align:center"><b>#P2S2</td>
            <td style="width:5%;text-align:center"><b>#P2S3</td>
            <td style="width:5%;text-align:center"><b>#P2S4</td>
            <td style="width:5%;text-align:center"><b>#P2S5</td>
            <td style="width:27%">B   <b>#NomPrenomB</td>
            <td style="width:5%;text-align:center">"</td>
            <td style="width:27%">X   <b>#NomPrenomX</td>
            <td style="width:8%;text-align:center"><b>#P2SA</td>
            <td style="width:8%;text-align:center"><b>#P2SX</td>
        </tr>
        <tr id="CvsY">
            <td style="width:5%;text-align:center"><b>#P3S1</td>
            <td style="width:5%;text-align:center"><b>#P3S2</td>
            <td style="width:5%;text-align:center"><b>#P3S3</td>
            <td style="width:5%;text-align:center"><b>#P3S4</td>
            <td style="width:5%;text-align:center"><b>#P3S5</td>
            <td style="width:27%">C  <b>#NomPrenomC</td>
            <td style="width:5%;text-align:center">"</td>
            <td style="width:27%">Y  <b>#NomPrenomY</td>
            <td style="width:8%;text-align:center"><b>#P3SA</td>
            <td style="width:8%;text-align:center"><b>#P3SX</td>
        </tr>
        <tr id="DvsZ">
            <td style="width:5%;text-align:center"><b>#P4S1</td>
            <td style="width:5%;text-align:center"><b>#P4S2</td>
            <td style="width:5%;text-align:center"><b>#P4S3</td>
            <td style="width:5%;text-align:center"><b>#P4S4</td>
            <td style="width:5%;text-align:center"><b>#P4S5</td>
            <td style="width:27%">D  <b>#NomPrenomD</td>
            <td style="width:5%;text-align:center">"</td>
            <td style="width:27%">Z  <b>#NomPrenomZ</td>
            <td style="width:8%;text-align:center"><b>#P4SA</td>
            <td style="width:8%;text-align:center"><b>#P4SX</td>
        </tr>
        <tr id="AvsX">
            <td style="width:5%;text-align:center"><b>#P5S1</td>
            <td style="width:5%;text-align:center"><b>#P5S2</td>
            <td style="width:5%;text-align:center"><b>#P5S3</td>
            <td style="width:5%;text-align:center"><b>#P5S4</td>
            <td style="width:5%;text-align:center"><b>#P5S5</td>
            <td style="width:27%">A  <b>#NomPrenomA</td>
            <td style="width:5%;text-align:center">"</td>
            <td style="width:27%">X  <b>#NomPrenomX</td>
            <td style="width:8%;text-align:center"><b>#P5SA</td>
            <td style="width:8%;text-align:center"><b>#P5SX</td>
        </tr>
        <tr id="BvsW">
            <td style="width:5%;text-align:center"><b>#P6S1</td>
            <td style="width:5%;text-align:center"><b>#P6S2</td>
            <td style="width:5%;text-align:center"><b>#P6S3</td>
            <td style="width:5%;text-align:center"><b>#P6S4</td>
            <td style="width:5%;text-align:center"><b>#P6S5</td>
            <td style="width:27%">B  <b>#NomPrenomB</td>
            <td style="width:5%;text-align:center">"</td>
            <td style="width:27%">W  <b>#NomPrenomW</td>
            <td style="width:8%;text-align:center"><b>#P6SA</td>
            <td style="width:8%;text-align:center"><b>#P6SX</td>
        </tr>
        <tr id="DvsY">
            <td style="width:5%;text-align:center"><b>#P7S1</td>
            <td style="width:5%;text-align:center"><b>#P7S2</td>
            <td style="width:5%;text-align:center"><b>#P7S3</td>
            <td style="width:5%;text-align:center"><b>#P7S4</td>
            <td style="width:5%;text-align:center"><b>#P7S5</td>
            <td style="width:27%">D  <b>#NomPrenomD</td>
            <td style="width:5%;text-align:center">"</td>
            <td style="width:27%">Y  <b>#NomPrenomY</td>
            <td style="width:8%;text-align:center"><b>#P7SA</td>
            <td style="width:8%;text-align:center"><b>#P7SX</td>
        </tr>
        <tr id="CvsZ">
            <td style="width:5%;text-align:center"><b>#P8S1</td>
            <td style="width:5%;text-align:center"><b>#P8S2</td>
            <td style="width:5%;text-align:center"><b>#P8S3</td>
            <td style="width:5%;text-align:center"><b>#P8S4</td>
            <td style="width:5%;text-align:center"><b>#P8S5</td>
            <td style="width:27%">C  <b>#NomPrenomC</td>
            <td style="width:5%;text-align:center">"</td>
            <td style="width:27%">Z  <b>#NomPrenomZ</td>
            <td style="width:8%;text-align:center"><b>#P8SA</td>
            <td style="width:8%;text-align:center"><b>#P8SX</td>
        </tr>
        <tr id="Double1">
            <td style="width:5%;text-align:center"><b>#P9S1</td>
            <td style="width:5%;text-align:center"><b>#P9S2</td>
            <td style="width:5%;text-align:center"><b>#P9S3</td>
            <td style="width:5%;text-align:center"><b>#P9S4</td>
            <td style="width:5%;text-align:center"><b>#P9S5</td>
            <td style="width:27%">Double 1     <b>#Double1A</td>
            <td style="width:5%;text-align:center">"</td>
            <td style="width:27%">Double 1     <b>#Double1X</td>
            <td style="width:8%;text-align:center"><b>#P9SA</td>
            <td style="width:8%;text-align:center"><b>#P9SX</td>
        </tr>
        <tr id="Double2">
            <td style="width:5%;text-align:center"><b>#P10S1</td>
            <td style="width:5%;text-align:center"><b>#P10S2</td>
            <td style="width:5%;text-align:center"><b>#P10S3</td>
            <td style="width:5%;text-align:center"><b>#P10S4</td>
            <td style="width:5%;text-align:center"><b>#P10S5</td>
            <td style="width:27%">Double 2     <b>#Double2A</td>
            <td style="width:5%;text-align:center">"</td>
            <td style="width:27%">Double 2     <b>#Double2X</td>
            <td style="width:8%;text-align:center"><b>#P10SA</td>
            <td style="width:8%;text-align:center"><b>#P10SX</td>
        </tr>
        <tr id="DvsW">
            <td style="width:5%;text-align:center"><b>#P11S1</td>
            <td style="width:5%;text-align:center"><b>#P11S2</td>
            <td style="width:5%;text-align:center"><b>#P11S3</td>
            <td style="width:5%;text-align:center"><b>#P11S4</td>
            <td style="width:5%;text-align:center"><b>#P11S5</td>
            <td style="width:27%">D  <b>#NomPrenomD</td>
            <td style="width:5%;text-align:center">"</td>
            <td style="width:27%">W  <b>#NomPrenomW</td>
            <td style="width:8%;text-align:center"><b>#P11SA</td>
            <td style="width:8%;text-align:center"><b>#P11SX</td>
        </tr>
        <tr id="CvsX">
            <td style="width:5%;text-align:center"><b>#P12S1</td>
            <td style="width:5%;text-align:center"><b>#P12S2</td>
            <td style="width:5%;text-align:center"><b>#P12S3</td>
            <td style="width:5%;text-align:center"><b>#P12S4</td>
            <td style="width:5%;text-align:center"><b>#P12S5</td>
            <td style="width:27%">C  <b>#NomPrenomC</td>
            <td style="width:5%;text-align:center">"</td>
            <td style="width:27%">X  <b>#NomPrenomX</td>
            <td style="width:8%;text-align:center"><b>#P12SA</td>
            <td style="width:8%;text-align:center"><b>#P12SX</td>
        </tr>
        <tr id="AvsZ">
            <td style="width:5%;text-align:center"><b>#P13S1</td>
            <td style="width:5%;text-align:center"><b>#P13S2</td>
            <td style="width:5%;text-align:center"><b>#P13S3</td>
            <td style="width:5%;text-align:center"><b>#P13S4</td>
            <td style="width:5%;text-align:center"><b>#P13S5</td>
            <td style="width:27%">A  <b>#NomPrenomA</td>
            <td style="width:5%;text-align:center">"</td>
            <td style="width:27%">Z  <b>#NomPrenomZ</td>
            <td style="width:8%;text-align:center"><b>#P13SA</td>
            <td style="width:8%;text-align:center"><b>#P13SX</td>
        </tr>
        <tr id="BvsY">
            <td style="width:5%;text-align:center"><b>#P14S1</td>
            <td style="width:5%;text-align:center"><b>#P14S2</td>
            <td style="width:5%;text-align:center"><b>#P14S3</td>
            <td style="width:5%;text-align:center"><b>#P14S4</td>
            <td style="width:5%;text-align:center"><b>#P14S5</td>
            <td style="width:27%">B  <b>#NomPrenomB</td>
            <td style="width:5%;text-align:center">"</td>
            <td style="width:27%">Y  <b>#NomPrenomY</td>
            <td style="width:8%;text-align:center"><b>#P14SA</td>
            <td style="width:8%;text-align:center"><b>#P14SX</td>
        </tr>
        <tr id="CvsW">
            <td style="width:5%;text-align:center"><b>#P15S1</td>
            <td style="width:5%;text-align:center"><b>#P15S2</td>
            <td style="width:5%;text-align:center"><b>#P15S3</td>
            <td style="width:5%;text-align:center"><b>#P15S4</td>
            <td style="width:5%;text-align:center"><b>#P15S5</td>
            <td style="width:27%">C  <b>#NomPrenomC</td>
            <td style="width:5%;text-align:center">"</td>
            <td style="width:27%">W  <b>#NomPrenomW</td>
            <td style="width:8%;text-align:center"><b>#P16SA</td>
            <td style="width:8%;text-align:center"><b>#P16SX</td>
        </tr>
        <tr id="DvsX">
            <td style="width:5%;text-align:center"><b>#P16S1</td>
            <td style="width:5%;text-align:center"><b>#P16S2</td>
            <td style="width:5%;text-align:center"><b>#P16S3</td>
            <td style="width:5%;text-align:center"><b>#P16S4</td>
            <td style="width:5%;text-align:center"><b>#P16S5</td>
            <td style="width:27%">D  <b>#NomPrenomD</td>
            <td style="width:5%;text-align:center">"</td>
            <td style="width:27%">X  <b>#NomPrenomX</td>
            <td style="width:8%;text-align:center"><b>#P17SA</td>
            <td style="width:8%;text-align:center"><b>#P17SX</td>
        </tr>
        <tr id="AvsY">
            <td style="width:5%;text-align:center"><b>#P17S1</td>
            <td style="width:5%;text-align:center"><b>#P17S2</td>
            <td style="width:5%;text-align:center"><b>#P17S3</td>
            <td style="width:5%;text-align:center"><b>#P17S4</td>
            <td style="width:5%;text-align:center"><b>#P17S5</td>
            <td style="width:27%">A  <b>#NomPrenomA</td>
            <td style="width:5%;text-align:center">"</td>
            <td style="width:27%">Y  <b>#NomPrenomY</td>
            <td style="width:8%;text-align:center"><b>#P18SA</td>
            <td style="width:8%;text-align:center"><b>#P18SX</td>
        </tr>
        <tr id="BvsZ">
            <td style="width:5%;text-align:center"><b>#P18S1</td>
            <td style="width:5%;text-align:center"><b>#P18S2</td>
            <td style="width:5%;text-align:center"><b>#P18S3</td>
            <td style="width:5%;text-align:center"><b>#P18S4</td>
            <td style="width:5%;text-align:center"><b>#P18S5</td>
            <td style="width:27%">B  <b>#NomPrenomB</td>
            <td style="width:5%;text-align:center">"</td>
            <td style="width:27%">Z  <b>#NomPrenomZ</td>
            <td style="width:8%;text-align:center"><b>#P18SA</td>
            <td style="width:8%;text-align:center"><b>#P18SX</td>
        </tr>
        <tr>
            <td colspan="8" style="width:100%;text-align:right">TOTAL DES POINTS DE CHAQUE EQUIPE</td>
            <td style="width:8%;text-align:center"><b>#ScoreA</td>
            <td style="width:8%;text-align:center"><b>#ScoreX</td>
        </tr>
        <tr>
            <td colspan="10" style="width:100%"> </td>
        </tr>
    </table>
    <table id="tabRecap" style="min-width:1500px">
        <tr>
            <td style="width:5%"><b>#NbRes</td>
            <td style="width:10%">Réserves</td>
            <td rowspan="4" style="width:15%;text-align:center;vertical-align:top"><b>Capitaine équipe A</b>
                <p style="text-align:left;vertical-align:middle"> Nom <b>#CapitaineA</b></p>
                <p style="text-align:left"> N° licence <b>#IdCapitaineA</b></p>
                <p style="text-align:center"> Signature à la fin de la rencontre </p>
            </td>
            <td rowspan="4" style="width:15%;text-align:center;vertical-align:top"><b>Capitaine équipe X</b>
                <p style="text-align:left"> Nom <b>#CapitaineX</b></p>
                <p style="text-align:left"> N° licence <b>#IdCapitaineX</b></p>
                <p style="text-align:center;vertical-align:bottom"> Signature à la fin de la rencontre </p>
            </td>
            <td rowspan="2" style="width:22%;font-size:16"><b>Association <b>#ClubA</td>
            <td rowspan="2" style="width:4%;text-align:center;font-size:16"><b>#ScoreA</td>
            <td rowspan="4" style="width:13%;text-align:center;vertical-align:top"><b>Signature du Juge Arbitre</td>
            <td rowspan="4" style="width:8%;text-align:center;vertical-align:top"><b>Phase</b>
                <p style="text-align:left;vertical-align:middle;padding-top:5;font-size:24">N° <b>#Phase</p>
            </td>
            <td rowspan="4" style="width:8%;text-align:center;vertical-align:top"><b>Journée</b>
                <p style="text-align:left;vertical-align:middle;padding-top:5;font-size:24">N° <b>#Jour</p>
            </td>
        </tr>
        <tr>
            <td style="width:5%"><b>#NbRecl</td>
            <td style="width:10%">Réclamations</td>
        </tr>
        <tr>
            <td style="width:5%"><b>#NbCart</td>
            <td style="width:10%">Cartons</td>
            <td rowspan="2" style="width:22%;font-size:16"><b>Association <b>#ClubX</td>
            <td rowspan="2" style="width:4%;text-align:center;font-size:16"><b>#ScoreX</td>
        </tr>
        <tr>
            <td style="width:5%"><b>#RapportJA</td>
            <td style="width:10%">Rapport JA</td>
        </tr>
    </table>
    <table id="piedDePage" style="min-width:1500px">
        <tr>
            <td style="width:30%;text-align:center">
                <p>Abonnez vous à</p>
                <img src="pub.jpg" height="30px" width="50px">
            </td>
            <td style="width:30%;text-align:center">
                <p style="font-size:8px;padding-top:0;padding-bottom:0;margin-top:0;margin-bottom:0;">Toutes les informations</p>
                <p style="font-size:8px;padding-top:0;padding-bottom:0;margin-top:0;margin-bottom:0;">sont disponibles sur :</p>
                <p style="font-size:8px;padding-top:0;padding-bottom:0;margin-top:0;margin-bottom:0;">www.fftt.com</p>
            </td>
            <td style="width:10%;text-align:center">
                <p style="font-size:8px;padding-top:0;padding-bottom:0;margin-top:0;margin-bottom:0;">FFTT</p>
                <p style="font-size:8px;padding-top:0;padding-bottom:0;margin-top:0;margin-bottom:0;">3 Rue Dieudonné Costes</p>
                <p style="font-size:8px;padding-top:0;padding-bottom:0;margin-top:0;margin-bottom:0;">75013 Paris</p>
            </td>
            <td style="width:30%"></td>
        </tr>
    </table>
    </body>
    `;
    }


}
