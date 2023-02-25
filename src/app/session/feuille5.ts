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

export class Feuille5 {

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
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACx
                        jwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAXASURBVGhD7ZlZbFRVGMfbUlAR1LqhYmwARY27
                        VgVMQEl8cHkwaiKCVE0MIkQN8uiCViJGjcuDUXlQCQaMhLgFY9wI1iBIVVwrKsUSRQS12CjWlnb8
                        /WbulJnpdHpn2pkumX/yyzf39pxzz3fW75yWFFVUUUNPlbNXlMEJwWNUZYEdNMKBgzH3x572a9A5
                        gl6ATxqXz9wee4xpMDoSgdGxn/tVGtgBrY+rTtU4pI5pKRsxoa20vHJ0+95/ef4NGmDbgHWEyo/C
                        TA2YBO3wJWyETXMmLpzWPGzkGoaYzgycHgla/Vi4Aq6FKvgMXoc3YfvkunpMdMIPw2yCZTjylO/6
                        3REcsA6TYT7ohJP4eXjV31TeOZEkHDkXczMswJF9vus3R3CgHHMp3A22/tvwONSmq3yicORETANO
                        dMTe9JMjOHEW5lG4BN6AxbC5JwcyqaCOBBP4HlgAjv+FsD4+9nujgjmCE87m5XAy3AvP4kALtk+U
                        d0eCyXwVuCP/ANU40PsuSFEhdvZbYSU4F6bnwwmVtx4JesK58DAsgQdwonOV6Wvls0eqQSfug7w6
                        oUL1COv24RiHho4/DatZw7udqPSGy+oaeAwW4UTOy2pYhe2RZrgTvgUn7TqcOwPbRThhmPEi6HhN
                        IZxQWc8RHDgPsxTcXWeCgRsm6oQNsxpOgUk48ZfvC6Gs5wiV/hRzMayCFaBjcV0Nl8MdhXRC5bxq
                        0TM2gsPtBpj6cv2DPn8OdTXNrTO27OvIupGQwzCXOkVydkThjGYWlOPIodgnoWrWny069AjYQ2H1
                        NdwENWCvhpWhzo29ciQuHBq3sn7x2NKSiAegJxhW7ePHjzuI38ZVFaYJZHgyHdaBC0dcroBLGhq2
                        7SafJ8FFYFwW12ngAesD2OKLQP/AQ+RrijpCZs0ECDMcPKk1ktnKHsjv4yFMg1hZl+VlMJf8z/ky
                        jPjOXMwzUE0+47UuKiORB3mX1B/h+x5wok8BndB7W9b4KV3aRDxrjIG8yR6YAY5Nw4iJcFIGXFZf
                        olUw0TPEmeDamy5tIlXkqcPmTToyPPazxBY2NrorDb4fQ2V2BE6oEeAx06U4XR6ZB63kacLmVYlz
                        wq53vKfD4bEBUuUlwFhIl+c4eAeSLtJ6qe7jNcb6PIiAwya0SL8KGsGeCSXSVoPfMrQPLdLPD/Jd
                        H7zqolw2rf5Qj/U0gfdGLovZDgEvkq+D6HVMSL0F7jVe9WSjV8B8DtWhrS4bGePQ+6ZDwIm1B4az
                        6rTx3t4zfTQe4p0bY2iR/wCMu7ar2N/Rl32odI5cgDGM+AisrLv3F+AlmulHgufueGWOgh3gBYMX
                        yqZ11foO3EN+p+K/UK77jWGLV502kkvyEbAVDF0ag2e/6fnH1XAvOHRt2Fbw4noU5X2FTZLLZ5Iq
                        KioqMeeAH7gFTgfDl1/hfDBs91Dlx3+GK0EnjRDsTRvCirjRuqJNa2raU0u55rWiOuAFnadOA07L
                        3wkGmF4ZudS70Tr/DgPz2EiODuszhbI2UKZxVqfSrQa2gJPLlrNC68GP+xFb/j94H3aDTruh7gLV
                        BraaQZ4fNsAznfLD3un+BLa+lTX+Mt034PnFCNoD29lgWf7tDzC9Dvu8OXiXpB6DPecGXdm5EfFs
                        L9rSEd5ndcFGXk1qeTam88e5ZwNY9kbTpH47k7p1hEIs0N35IlgLbRRqmG1LenPuCdFA095wDFsR
                        582RoINHgy3ncHMI2gD+A9Og813ooLxdlGdP3w4uyQ4re8Zh+Rq45NaCw3Yn6bttuEyOzMY4tOxm
                        54Ot4wf8mydDh8yF4IT0A07k+DCwwjp4Gawl31LyOOadyJZlY5Tz/hqs5d2GMUKeAw4pG9G6eWZx
                        0juftpLeUD6tMu2YFuiNiK3svEjdjHxnmvfAnjGa1KEPwXnjkPA/TPHblnh5zhXnkb2SKNO5Qvo3
                        e8+GUX7HxvLIUFRRRRU1JFRS8j/wjeYQkyRkkAAAAABJRU5ErkJggg==" 
                        alt="logo FFTT" width="50px" height="50px"></img>
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
                        <td><b>#NomJA</b></td>
                        <td> </td>
                        <td>Date : <b>#Date</b></td>
                        <td>Heure : <b>#Heure</b></td>
                        <td>Division : <b>#Division</b></td>
                        <td>Poule : <b>#Poule</b></td>
                    </tr>
                    <tr>
                        <td>#LicJA</td>
                        <td> </td>
                        <td style="text-align:center">#National</td>
                        <td style="text-align:center">#Régional</td>
                        <td colspan="2" style="text-align:center">#Départemental</td>
                    </tr>
                    <tr>
                        <td>#AdresseJA</td>
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
                        <td style="width:15%">X   <b>#IdX</b></td>
                        <td style="width:19%"><b>#NomPrenomX</b></td>
                        <td style="width:5%"><b>#PtsX</b></td>
                        <td style="width:5%"><b>#MutEtrX</b></td>
                        <td style="width:5%"><b>#NbCartX</b></td>
                    </tr>
                    <tr>
                        <td style="width:15%">B   <b>#IdB</b></td>
                        <td style="width:19%"><b>#NomPrenomB</b></td>
                        <td style="width:5%"><b>#PtsB</b></td>
                        <td style="width:5%"><b>#MutEtrB</b></td>
                        <td style="width:5%"><b>#NbCartB</b></td>
                        <td style="width:2%"></td>
                        <td style="width:15%">Y   <b>#IdX</b></td>
                        <td style="width:19%"><b>#NomPrenomY</b></td>
                        <td style="width:5%"><b>#PtsY</b></td>
                        <td style="width:5%"><b>#MutEtrY</b></td>
                        <td style="width:5%"><b>#NbCartY</b></td>
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
                        <td style="width:8%;text-align:center"><b>AB</b></td>
                        <td style="width:8%;text-align:center"><b>XY</b></td>
                    </tr>
                    <tr id="AvsX">
                        <td style="width:5%;text-align:center"><b>#P1S1</b></td>
                        <td style="width:5%;text-align:center"><b>#P1S2</b></td>
                        <td style="width:5%;text-align:center"><b>#P1S3</b></td>
                        <td style="width:5%;text-align:center"><b>#P1S4</b></td>
                        <td style="width:5%;text-align:center"><b>#P1S5</b></td>
                        <td style="width:27%">A   <b>#NomPrenomA</b></td>
                        <td style="width:5%;text-align:center">contre</td>
                        <td style="width:27%">X  <b>#NomPrenomX</b></td>
                        <td style="width:8%;text-align:center"><b>#P1SA</b></td>
                        <td style="width:8%;text-align:center"><b>#P1SX</b></td>
                    </tr>
                    <tr id="BvsY">
                        <td style="width:5%;text-align:center"><b>#P2S1</b></td>
                        <td style="width:5%;text-align:center"><b>#P2S2</b></td>
                        <td style="width:5%;text-align:center"><b>#P2S3</b></td>
                        <td style="width:5%;text-align:center"><b>#P2S4</b></td>
                        <td style="width:5%;text-align:center"><b>#P2S5</b></td>
                        <td style="width:27%">B   <b>#NomPrenomB</b></td>
                        <td style="width:5%;text-align:center">"</td>
                        <td style="width:27%">Y   <b>#NomPrenomY</b></td>
                        <td style="width:8%;text-align:center"><b>#P2SA</b></td>
                        <td style="width:8%;text-align:center"><b>#P2SX</b></td>
                    </tr>
                    <tr id="Double1">
                        <td style="width:5%;text-align:center"><b>#P3S1</b></td>
                        <td style="width:5%;text-align:center"><b>#P3S2</b></td>
                        <td style="width:5%;text-align:center"><b>#P3S3</b></td>
                        <td style="width:5%;text-align:center"><b>#P3S4</b></td>
                        <td style="width:5%;text-align:center"><b>#P3S5</b></td>
                        <td style="width:27%">Double 1     <b>#Double1A</b></td>
                        <td style="width:5%;text-align:center">"</td>
                        <td style="width:27%">Double 1     <b>#Double1X</b></td>
                        <td style="width:8%;text-align:center"><b>#P3SA</b></td>
                        <td style="width:8%;text-align:center"><b>#P3SX</b></td>
                    </tr>
                    <tr id="AvsY">
                        <td style="width:5%;text-align:center"><b>#P4S1</b></td>
                        <td style="width:5%;text-align:center"><b>#P4S2</b></td>
                        <td style="width:5%;text-align:center"><b>#P4S3</b></td>
                        <td style="width:5%;text-align:center"><b>#P4S4</b></td>
                        <td style="width:5%;text-align:center"><b>#P4S5</b></td>
                        <td style="width:27%">A  <b>#NomPrenomA</b></td>
                        <td style="width:5%;text-align:center">"</td>
                        <td style="width:27%">Y  <b>#NomPrenomY</b></td>
                        <td style="width:8%;text-align:center"><b>#P4SA</b></td>
                        <td style="width:8%;text-align:center"><b>#P4SX</b></td>
                    </tr>
                    <tr id="BvsX">
                        <td style="width:5%;text-align:center"><b>#P5S1</b></td>
                        <td style="width:5%;text-align:center"><b>#P5S2</b></td>
                        <td style="width:5%;text-align:center"><b>#P5S3</b></td>
                        <td style="width:5%;text-align:center"><b>#P5S4</b></td>
                        <td style="width:5%;text-align:center"><b>#P5S5</b></td>
                        <td style="width:27%">B  <b>#NomPrenomB</b></td>
                        <td style="width:5%;text-align:center">"</td>
                        <td style="width:27%">X  <b>#NomPrenomX</b></td>
                        <td style="width:8%;text-align:center"><b>#P5SA</b></td>
                        <td style="width:8%;text-align:center"><b>#P5SX</b></td>
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
                            <p style="text-align:center">#SignatureA</p>
                        </td>
                        <td rowspan="4" style="width:15%;text-align:center;vertical-align:top"><b>Capitaine équipe X</b>
                            <p style="text-align:left"> Nom <b>#CapitaineX</b></p>
                            <p style="text-align:left"> N° licence <b>#LicCapitaineX</b></p>
                            <p style="text-align:center;vertical-align:bottom">#SignatureX</p>
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
                            <img src="data:image/png;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QBoRXhpZgAATU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUA
                            AAABAAAARgEoAAMAAAABAAIAAAExAAIAAAARAAAATgAAAAAAAABgAAAAAQAAAGAAAAABcGFpbnQu
                            bmV0IDQuMi4xNQAA/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0O
                            EQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQU
                            FBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgAHgAyAwEhAAIRAQMRAf/E
                            AB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAE
                            EQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZH
                            SElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1
                            tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEB
                            AQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXET
                            IjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFla
                            Y2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXG
                            x8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A5n/gm54M0zwz8F9e
                            8cX1pCt7eX0wF6yAutpDGuQG6gb/ADc464Geldbp/wC3VY6p4Z1jxBB4Kvv7M0qWCG4ke9iVt0xY
                            IFGOT8jE46AV/MOZ5DW4ozvH13X5I05wpq6b1b5UlbazWvrc/SMNjYZbg6EOS7knL7tS4f24dGkm
                            8I29v4V1Ka78RIrxQ+fGDEWuZIFB9ctGT24Ip3h/9ujwprmta7YPpN3Zx6dZ3d3BcSTIRd+QpbYo
                            7M6qSM+lcM/DfGKnOca8W43drPpJx/GzZus/pOSTg1f/ACuULj9vfQLXwlYa1J4W1IPe3c9tDaie
                            PO2JYy0hb0JlCgY/hb0r0Dwz8f8AV9b+IVp4VvfhzrmmGY4fUtyzWsX7vflpFG3j7pweDx14rkx3
                            AksvoTq18XBNKbSaa5vZuzSfdvZGtHOlXmowpN7X8uY9kwPSivyy7PpD5k8D6bp/wz/YN0y11W/k
                            0S1utAzPdxW/nyRNesWyI9y7mzPjGRj8K8q+EepfA74X+DYD4rtbvxVbazeySWurah4dUJsjCI6o
                            pkfOwkknP8WK/fMtjm2YUsdHLWoOtiJe/wA/K9PeaStrpruup8TXeGoSovEa8lNaWutdL/efX3xa
                            /Yo+F99pyfEnQ9a1DRtS0TThf2sUSRm0EUMBaNVt9qFCCAwAYc5B68fBth8P/hPJ8EdWvT42vWuY
                            dct4/wC0f7D2zx7oZNsXk+d8yMBI27cOU6cc/puYU8yyiNCngKftY/u4tynZ6Se+jvzX1fR9GfOY
                            eVDFOcq8uV+87JabdNeltibUvAPgO6vPAOgab4z1a81e3sY5Y7GHw005uGmke5RmTz12kxyRgqC3
                            yqDkdB6p+yp4V8L+Kfjdr3jbT/FFxrOqxJNcS2b6EbCKN52ILIfNcYA3Lt689eDXx+d5hmUcoxNS
                            thoxvCV7VbtRqzdny8uvZa9H6Hr4Ohh3iqcYVG9V9nrFd7nWeL/23vD3hPxZreiTeT52m309k+WP
                            3o5GQ9/VaK+IoeH2IrUoVF9pJ/ej1555TjJx7Hc/tFfBvW/iZ8JtP8G+FLjT7BILiDzDqEjohgiR
                            gqjYjc7th6fw1g+CP2RPBP8AwhHhuy8S2x8RanpMJVtup3BtBKzeZII03ABSx5+UZ7ivHwfFtXLc
                            ohhsDeNZVJTlJxi0uZNaXvrbyWlzrq5XHEYp1K2sOVJK76a6+R6B8VPhv8Rvih4B1zw34Q1GOG9v
                            YvLka4umCLbEgSrlYieV+X6Ma+b9e/4Jt+PrrQ/CtroV1psVzc2e7UI7ieZY7m4R5GEseIzkCOUL
                            lgvT/aNfrGV8bYzHUKNavhZTTlq4RVmtIq15b+0a7b6bHy2IyijQnOEKqVl1bv36LblTOif9hX4p
                            aP8AFnWdf0waHcRQWk0FnHc3txbSWsT2zW8LsUiIBRMHhudvUdvS/gV8HfG3wA0fxNJ8SdebVLyY
                            JcJ/ps1ykEEaOSQZQMEktnA/hFfN8TY+OMyiUJ4ScajVOnzSjC0XCTvZqTlq01tbQ9HLqXs8Umqq
                            a96Vk3qmlbS1tNGfj74m1ybxN4k1XWLj/j41C7lu5P8Aekcuf1NFf0RTgqUI01slb7j4GUnKTk+p
                            +62saK2tIEa/uraEjDRwbAG9ckqTyOMZxirVjZCxjZBLLKGII81yxGFAwM/TP1Jr+A5Yi9FUVBK3
                            Xr/XofuKh73Nc6Pw34qu/C/2w2aRmW4QR+Y4JKD25/ziteT4oalIozbWvnC2+zLLtYlVP3iOcZOB
                            +Qr7TLOMsbleChgaVOLhG9r33bcr77ptW9EePicno4qs68pO7/ytb+u4svxPvZ3umexsyblI45MB
                            xkITj+L3NfNf7dHxoHg34LeKNQksyl5rVq+k2y2ahY4WljMe85OQACx4yc4+texR4gxPFONwuX1a
                            UIXqRd1e/wAUpNat78z9XY5JYCnllGpiIybtFq2nZL9D8ZqK/rQ/Lz//2Q==" 
                            alt="pub" width="50px" height="30px"></img>
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
