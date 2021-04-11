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

export class Feuille14 {

    public static FeuilleVide():string {
        return `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" ></meta>
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
                            <img src="fftt.png" width="50px" height="50px"></img>
                        </td>
                        <td style="width:90%;font-size:30px;padding-top:10;padding-bottom:0;margin-top:0;margin-bottom:0;text-align:center;vertical-align:middle">
                            <b>FEDERATION FRANÇAISE DE TENNIS DE TABLE</b>
                        </td>
                        <td rowspan="2" style="width:5%;vertical-align:bottom;font-size:8px">C.S.F. 11.2.0.4</td>
                    </tr>
                    <tr>
                        <td style="width:70%;font-size:20px;padding-top:0;padding-bottom:10;margin-top:0;margin-bottom:0;text-align:center;vertical-align:middle">
                            <b>Championnat par Equipes</b>
                        </td>
                    </tr>
                </table>
                <table id="tabRencontre" style="min-width:1500px">
                    <tr>
                        <td style="width:49%">Nom, Prénom, Adresse du juge arbitre : </td>
                        <td style="width:2%"> </td>
                        <td colspan="2" style="width:25%">Lieu de rencontre : <b>#Lieu</b></td>
                        <td colspan="2" style="width:25%">Ligue : <b>#Ligue</b> </td>
                    </tr>
                    <tr>
                        <td><b>#JA</b></td>
                        <td> </td>
                        <td>Date : <b>#Date</b></td>
                        <td>Heure : <b>#Heure</b></td>
                        <td>Division : <b>#Division</b></td>
                        <td>Poule : <b>#Poule</b></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td> </td>
                        <td style="text-align:center">#National</td>
                        <td style="text-align:center">#Régional</td>
                        <td colspan="2" style="text-align:center">#Départemental</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td> </td>
                        <td style="text-align:center">#Masculin</td>
                        <td style="text-align:center">#Féminin</td>
                        <td colspan="2"> </td>
                    </tr>
                    <tr>
                        <td colspan="6" style="width:100%"> </td>
                    </tr>
                </table>
                <table id="tabEquipes" style="min-width:1500px">
                    <tr>
                        <td style="width:15%">N°<b>#IdClubA</b></td>
                        <td colspan="4" style="width:34%">Association <b>#NomClubA</b></td>
                        <td style="width:2%"></td>
                        <td style="width:15%">N°<b>#IdClubX</b></td>
                        <td colspan="4" style="width:34%">Association <b>#NomClubX</b></td>
                    </tr>
                    <tr>
                        <td style="width:15%"><b>N° Licence</b></td>
                        <td style="width:19%"><b>NOM-PRENOM</b></td>
                        <td style="width:5%"><b>Points</b></td>
                        <td style="width:5%"><b></b>
                            <p style="padding-top:0;padding-bottom:0;margin-top:0;margin-bottom:0;">Muté</p>
                            <p style="padding-top:0;padding-bottom:0;margin-top:0;margin-bottom:0;">Etranger</p>
                        </td>
                        <td style="width:5%"><b>Cartons</b></td>
                        <td style="width:2%"></td>
                        <td style="width:15%"><b>N° Licence</b></td>
                        <td style="width:19%"><b>NOM-PRENOM</b></td>
                        <td style="width:5%"><b>Points</b></td>
                        <td style="width:5%"><b></b>
                            <p style="padding-top:0;padding-bottom:0;margin-top:0;margin-bottom:0;">Muté</p>
                            <p style="padding-top:0;padding-bottom:0;margin-top:0;margin-bottom:0;">Etranger</p>
                        </td>
                        <td style="width:5%"><b>Cartons</b></td>
                    </tr>
                    <tr>
                        <td style="width:15%">A   <b>#IdA</b></td>
                        <td style="width:19%"><b>#NomPrenomA</b></td>
                        <td style="width:5%"><b>#PtsA</b></td>
                        <td style="width:5%"><b>#MutEtrA</b></td>
                        <td style="width:5%"><b>#NbCartA</b></td>
                        <td style="width:2%"></td>
                        <td style="width:15%">W   <b>#IdW</b></td>
                        <td style="width:19%"><b>#NomPrenomW</b></td>
                        <td style="width:5%"><b>#PtsW</b></td>
                        <td style="width:5%"><b>#MutEtrW</b></td>
                        <td style="width:5%"><b>#NbCartW</b></td>
                    </tr>
                    <tr>
                        <td style="width:15%">B   <b>#IdB</b></td>
                        <td style="width:19%"><b>#NomPrenomB</b></td>
                        <td style="width:5%"><b>#PtsB</b></td>
                        <td style="width:5%"><b>#MutEtrB</b></td>
                        <td style="width:5%"><b>#NbCartB</b></td>
                        <td style="width:2%"></td>
                        <td style="width:15%">X   <b>#IdX</b></td>
                        <td style="width:19%"><b>#NomPrenomX</b></td>
                        <td style="width:5%"><b>#PtsX</b></td>
                        <td style="width:5%"><b>#MutEtrX</b></td>
                        <td style="width:5%"><b>#NbCartX</b></td>
                    </tr>
                    <tr>
                        <td style="width:15%">C   <b>#IdC</b></td>
                        <td style="width:19%"><b>#NomPrenomC</b></td>
                        <td style="width:5%"><b>#PtsC</b></td>
                        <td style="width:5%"><b>#MutEtrC</b></td>
                        <td style="width:5%"><b>#NbCartC</b></td>
                        <td style="width:2%"></td>
                        <td style="width:15%">Y   <b>#IdY</b></td>
                        <td style="width:19%"><b>#NomPrenomY</b></td>
                        <td style="width:5%"><b>#PtsY</b></td>
                        <td style="width:5%"><b>#MutEtrY</b></td>
                        <td style="width:5%"><b>#NbCartY</b></td>
                    </tr>
                    <tr>
                        <td style="width:15%">D   <b>#IdD</b></td>
                        <td style="width:19%"><b>#NomPrenomD</b></td>
                        <td style="width:5%"><b>#PtsD</b></td>
                        <td style="width:5%"><b>#MutEtrD</b></td>
                        <td style="width:5%"><b>#NbCartD</b></td>
                        <td style="width:2%"></td>
                        <td style="width:15%">Z   <b>#IdZ</b></td>
                        <td style="width:19%"><b>#NomPrenomZ</b></td>
                        <td style="width:5%"><b>#PtsZ</b></td>
                        <td style="width:5%"><b>#MutEtrZ</b></td>
                        <td style="width:5%"><b>#NbCartZ</b></td>
                    </tr>
                    <tr>
                        <td colspan="11" style="width:100%"> </td>
                    </tr>
                </table>
                <table id="tabParties" style="min-width:1500px">
                    <tr>
                        <td colspan="5" style="width:25%;text-align:center"><b>SCORES</b></td>
                        <td colspan="3" rowspan="2" style="width:59%;text-align:center"><b>ORDRE DES PARTIES</b></td>
                        <td colspan="2" style="width:16%;text-align:center"><b>POINTS</b></td>
                    </tr>
                    <tr>
                        <td style="width:5%;text-align:center"><b>1</b></td>
                        <td style="width:5%;text-align:center"><b>2</b></td>
                        <td style="width:5%;text-align:center"><b>3</b></td>
                        <td style="width:5%;text-align:center"><b>4</b></td>
                        <td style="width:5%;text-align:center"><b>5</b></td>
                        <td style="width:8%;text-align:center"><b>ABCD</b></td>
                        <td style="width:8%;text-align:center"><b>WXYZ</b></td>
                    </tr>
                    <tr id="AvsW">
                        <td style="width:5%;text-align:center"><b>#P1S1</b></td>
                        <td style="width:5%;text-align:center"><b>#P1S2</b></td>
                        <td style="width:5%;text-align:center"><b>#P1S3</b></td>
                        <td style="width:5%;text-align:center"><b>#P1S4</b></td>
                        <td style="width:5%;text-align:center"><b>#P1S5</b></td>
                        <td style="width:27%">A   <b>#NomPrenomA</b></td>
                        <td style="width:5%;text-align:center">contre</td>
                        <td style="width:27%">W  <b>#NomPrenomW</b></td>
                        <td style="width:8%;text-align:center"><b>#P1SA</b></td>
                        <td style="width:8%;text-align:center"><b>#P1SX</b></td>
                    </tr>
                    <tr id="BvsX">
                        <td style="width:5%;text-align:center"><b>#P2S1</b></td>
                        <td style="width:5%;text-align:center"><b>#P2S2</b></td>
                        <td style="width:5%;text-align:center"><b>#P2S3</b></td>
                        <td style="width:5%;text-align:center"><b>#P2S4</b></td>
                        <td style="width:5%;text-align:center"><b>#P2S5</b></td>
                        <td style="width:27%">B   <b>#NomPrenomB</b></td>
                        <td style="width:5%;text-align:center">"</td>
                        <td style="width:27%">X   <b>#NomPrenomX</b></td>
                        <td style="width:8%;text-align:center"><b>#P2SA</b></td>
                        <td style="width:8%;text-align:center"><b>#P2SX</b></td>
                    </tr>
                    <tr id="CvsY">
                        <td style="width:5%;text-align:center"><b>#P3S1</b></td>
                        <td style="width:5%;text-align:center"><b>#P3S2</b></td>
                        <td style="width:5%;text-align:center"><b>#P3S3</b></td>
                        <td style="width:5%;text-align:center"><b>#P3S4</b></td>
                        <td style="width:5%;text-align:center"><b>#P3S5</b></td>
                        <td style="width:27%">C  <b>#NomPrenomC</b></td>
                        <td style="width:5%;text-align:center">"</td>
                        <td style="width:27%">Y  <b>#NomPrenomY</b></td>
                        <td style="width:8%;text-align:center"><b>#P3SA</b></td>
                        <td style="width:8%;text-align:center"><b>#P3SX</b></td>
                    </tr>
                    <tr id="DvsZ">
                        <td style="width:5%;text-align:center"><b>#P4S1</b></td>
                        <td style="width:5%;text-align:center"><b>#P4S2</b></td>
                        <td style="width:5%;text-align:center"><b>#P4S3</b></td>
                        <td style="width:5%;text-align:center"><b>#P4S4</b></td>
                        <td style="width:5%;text-align:center"><b>#P4S5</b></td>
                        <td style="width:27%">D  <b>#NomPrenomD</b></td>
                        <td style="width:5%;text-align:center">"</td>
                        <td style="width:27%">Z  <b>#NomPrenomZ</b></td>
                        <td style="width:8%;text-align:center"><b>#P4SA</b></td>
                        <td style="width:8%;text-align:center"><b>#P4SX</b></td>
                    </tr>
                    <tr id="AvsX">
                        <td style="width:5%;text-align:center"><b>#P5S1</b></td>
                        <td style="width:5%;text-align:center"><b>#P5S2</b></td>
                        <td style="width:5%;text-align:center"><b>#P5S3</b></td>
                        <td style="width:5%;text-align:center"><b>#P5S4</b></td>
                        <td style="width:5%;text-align:center"><b>#P5S5</b></td>
                        <td style="width:27%">A  <b>#NomPrenomA</b></td>
                        <td style="width:5%;text-align:center">"</td>
                        <td style="width:27%">X  <b>#NomPrenomX</b></td>
                        <td style="width:8%;text-align:center"><b>#P5SA</b></td>
                        <td style="width:8%;text-align:center"><b>#P5SX</b></td>
                    </tr>
                    <tr id="BvsW">
                        <td style="width:5%;text-align:center"><b>#P6S1</b></td>
                        <td style="width:5%;text-align:center"><b>#P6S2</b></td>
                        <td style="width:5%;text-align:center"><b>#P6S3</b></td>
                        <td style="width:5%;text-align:center"><b>#P6S4</b></td>
                        <td style="width:5%;text-align:center"><b>#P6S5</b></td>
                        <td style="width:27%">B  <b>#NomPrenomB</b></td>
                        <td style="width:5%;text-align:center">"</td>
                        <td style="width:27%">W  <b>#NomPrenomW</b></td>
                        <td style="width:8%;text-align:center"><b>#P6SA</b></td>
                        <td style="width:8%;text-align:center"><b>#P6SX</b></td>
                    </tr>
                    <tr id="DvsY">
                        <td style="width:5%;text-align:center"><b>#P7S1</b></td>
                        <td style="width:5%;text-align:center"><b>#P7S2</b></td>
                        <td style="width:5%;text-align:center"><b>#P7S3</b></td>
                        <td style="width:5%;text-align:center"><b>#P7S4</b></td>
                        <td style="width:5%;text-align:center"><b>#P7S5</b></td>
                        <td style="width:27%">D  <b>#NomPrenomD</b></td>
                        <td style="width:5%;text-align:center">"</td>
                        <td style="width:27%">Y  <b>#NomPrenomY</b></td>
                        <td style="width:8%;text-align:center"><b>#P7SA</b></td>
                        <td style="width:8%;text-align:center"><b>#P7SX</b></td>
                    </tr>
                    <tr id="CvsZ">
                        <td style="width:5%;text-align:center"><b>#P8S1</b></td>
                        <td style="width:5%;text-align:center"><b>#P8S2</b></td>
                        <td style="width:5%;text-align:center"><b>#P8S3</b></td>
                        <td style="width:5%;text-align:center"><b>#P8S4</b></td>
                        <td style="width:5%;text-align:center"><b>#P8S5</b></td>
                        <td style="width:27%">C  <b>#NomPrenomC</b></td>
                        <td style="width:5%;text-align:center">"</td>
                        <td style="width:27%">Z  <b>#NomPrenomZ</b></td>
                        <td style="width:8%;text-align:center"><b>#P8SA</b></td>
                        <td style="width:8%;text-align:center"><b>#P8SX</b></td>
                    </tr>
                    <tr id="Double1">
                        <td style="width:5%;text-align:center"><b>#P9S1</b></td>
                        <td style="width:5%;text-align:center"><b>#P9S2</b></td>
                        <td style="width:5%;text-align:center"><b>#P9S3</b></td>
                        <td style="width:5%;text-align:center"><b>#P9S4</b></td>
                        <td style="width:5%;text-align:center"><b>#P9S5</b></td>
                        <td style="width:27%">Double 1     <b>#Double1A</b></td>
                        <td style="width:5%;text-align:center">"</td>
                        <td style="width:27%">Double 1     <b>#Double1X</b></td>
                        <td style="width:8%;text-align:center"><b>#P9SA</b></td>
                        <td style="width:8%;text-align:center"><b>#P9SX</b></td>
                    </tr>
                    <tr id="Double2">
                        <td style="width:5%;text-align:center"><b>#P10S1</b></td>
                        <td style="width:5%;text-align:center"><b>#P10S2</b></td>
                        <td style="width:5%;text-align:center"><b>#P10S3</b></td>
                        <td style="width:5%;text-align:center"><b>#P10S4</b></td>
                        <td style="width:5%;text-align:center"><b>#P10S5</b></td>
                        <td style="width:27%">Double 2     <b>#Double2A</b></td>
                        <td style="width:5%;text-align:center">"</td>
                        <td style="width:27%">Double 2     <b>#Double2X</b></td>
                        <td style="width:8%;text-align:center"><b>#P10SA</b></td>
                        <td style="width:8%;text-align:center"><b>#P10SX</b></td>
                    </tr>
                    <tr id="AvsY">
                        <td style="width:5%;text-align:center"><b>#P11S1</b></td>
                        <td style="width:5%;text-align:center"><b>#P11S2</b></td>
                        <td style="width:5%;text-align:center"><b>#P11S3</b></td>
                        <td style="width:5%;text-align:center"><b>#P11S4</b></td>
                        <td style="width:5%;text-align:center"><b>#P11S5</b></td>
                        <td style="width:27%">A  <b>#NomPrenomA</b></td>
                        <td style="width:5%;text-align:center">"</td>
                        <td style="width:27%">Y  <b>#NomPrenomY</b></td>
                        <td style="width:8%;text-align:center"><b>#P11SA</b></td>
                        <td style="width:8%;text-align:center"><b>#P11SX</b></td>
                    </tr>
                    <tr id="CvsW">
                        <td style="width:5%;text-align:center"><b>#P12S1</b></td>
                        <td style="width:5%;text-align:center"><b>#P12S2</b></td>
                        <td style="width:5%;text-align:center"><b>#P12S3</b></td>
                        <td style="width:5%;text-align:center"><b>#P12S4</b></td>
                        <td style="width:5%;text-align:center"><b>#P12S5</b></td>
                        <td style="width:27%">C  <b>#NomPrenomC</b></td>
                        <td style="width:5%;text-align:center">"</td>
                        <td style="width:27%">W  <b>#NomPrenomW</b></td>
                        <td style="width:8%;text-align:center"><b>#P12SA</b></td>
                        <td style="width:8%;text-align:center"><b>#P12SX</b></td>
                    </tr>
                    <tr id="DvsX">
                        <td style="width:5%;text-align:center"><b>#P13S1</b></td>
                        <td style="width:5%;text-align:center"><b>#P13S2</b></td>
                        <td style="width:5%;text-align:center"><b>#P13S3</b></td>
                        <td style="width:5%;text-align:center"><b>#P13S4</b></td>
                        <td style="width:5%;text-align:center"><b>#P13S5</b></td>
                        <td style="width:27%">D  <b>#NomPrenomD</b></td>
                        <td style="width:5%;text-align:center">"</td>
                        <td style="width:27%">X  <b>#NomPrenomX</b></td>
                        <td style="width:8%;text-align:center"><b>#P13SA</b></td>
                        <td style="width:8%;text-align:center"><b>#P13SX</b></td>
                    </tr>
                    <tr id="BvsZ">
                        <td style="width:5%;text-align:center"><b>#P14S1</b></td>
                        <td style="width:5%;text-align:center"><b>#P14S2</b></td>
                        <td style="width:5%;text-align:center"><b>#P14S3</b></td>
                        <td style="width:5%;text-align:center"><b>#P14S4</b></td>
                        <td style="width:5%;text-align:center"><b>#P14S5</b></td>
                        <td style="width:27%">B  <b>#NomPrenomB</b></td>
                        <td style="width:5%;text-align:center">"</td>
                        <td style="width:27%">Z  <b>#NomPrenomZ</b></td>
                        <td style="width:8%;text-align:center"><b>#P14SA</b></td>
                        <td style="width:8%;text-align:center"><b>#P14SX</b></td>
                    </tr>
                    <tr>
                        <td colspan="8" style="width:100%;text-align:right">TOTAL DES POINTS DE CHAQUE EQUIPE</td>
                        <td style="width:8%;text-align:center"><b>#ScoreA</b></td>
                        <td style="width:8%;text-align:center"><b>#ScoreX</b></td>
                    </tr>
                    <tr>
                        <td colspan="10" style="width:100%"> </td>
                    </tr>
                </table>
                <table id="tabRecap" style="min-width:1500px">
                    <tr>
                        <td style="width:5%"><b>#NbRes</b></td>
                        <td style="width:10%">Réserves</td>
                        <td rowspan="4" style="width:15%;text-align:center;vertical-align:top"><b>Capitaine équipe A</b>
                            <p style="text-align:left;vertical-align:middle"> Nom <b>#CapitaineA</b></p>
                            <p style="text-align:left"> N° licence <b>#LicCapitaineA</b></p>
                            <p style="text-align:center"> Signature à la fin de la rencontre </p>
                        </td>
                        <td rowspan="4" style="width:15%;text-align:center;vertical-align:top"><b>Capitaine équipe X</b>
                            <p style="text-align:left"> Nom <b>#CapitaineX</b></p>
                            <p style="text-align:left"> N° licence <b>#LicCapitaineX</b></p>
                            <p style="text-align:center;vertical-align:bottom"> Signature à la fin de la rencontre </p>
                        </td>
                        <td rowspan="2" style="width:22%;font-size:16"><b>Association</b> <b>#NomClubA</b></td>
                        <td rowspan="2" style="width:4%;text-align:center;font-size:16"><b>#ScoreA</b></td>
                        <td rowspan="4" style="width:13%;text-align:center;vertical-align:top"><b>Signature du Juge Arbitre</b></td>
                        <td rowspan="4" style="width:8%;text-align:center;vertical-align:top"><b>Phase</b>
                            <p style="text-align:left;vertical-align:middle;padding-top:5;font-size:24">N° <b>#Phase</b></p>
                        </td>
                        <td rowspan="4" style="width:8%;text-align:center;vertical-align:top"><b>Journée</b>
                            <p style="text-align:left;vertical-align:middle;padding-top:5;font-size:24">N° <b>#Journée</b></p>
                        </td>
                    </tr>
                    <tr>
                        <td style="width:5%"><b>#NbRecl</b></td>
                        <td style="width:10%">Réclamations</td>
                    </tr>
                    <tr>
                        <td style="width:5%"><b>#NbCart</b></td>
                        <td style="width:10%">Cartons</td>
                        <td rowspan="2" style="width:22%;font-size:16"><b>Association</b><b>#NomClubX</b></td>
                        <td rowspan="2" style="width:4%;text-align:center;font-size:16"><b>#ScoreX</b></td>
                    </tr>
                    <tr>
                        <td style="width:5%"><b>#RapportJA</b></td>
                        <td style="width:10%">Rapport JA</td>
                    </tr>
                </table>
                <table id="piedDePage" style="min-width:1500px">
                    <tr>
                        <td style="width:30%;text-align:center">
                            <p>Abonnez vous à</p>
                            <img src="pub.jpg" height="30px" width="50px"></img>
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
        </html>
                    `;
    }


}
