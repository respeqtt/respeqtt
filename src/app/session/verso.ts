export class Verso {

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
					.fusionCol {
						border: none
					}
					.signature {
						border-top: none;
						border-bottom: none;
					}
					.libre {
						border: none
					}
					#tabHaut, #tabMilieu  {
						border: double black;
					}

					#tabBas {
						border: solid black;
					}
					.vide {
						padding: 10px 10px 10px 10px;
					}
                </style>
            </head>
            <body lang=FR>
                <table class="libre"  id="tabEntete" style="min-width:1500px">
                    <tr max-height="50px">
                        <td class="libre" style=font-size:30px;padding-top:10;padding-bottom:0;margin-top:0;margin-bottom:0;text-align:center;vertical-align:middle">
                            <b>CHAMPIONNAT DE FRANCE PAR EQUIPES</b>
                        </td>
					</tr>
					<tr>
                        <td class="libre" style=font-size:20px;padding-top:0;padding-bottom:0;margin-top:0;margin-bottom:0;text-align:center;vertical-align:middle">
							FEDERATION FRANCAISE DE TENNIS DE TABLE
                        </td>
                    </tr>
                </table>
                <table id="tabHaut" style="min-width:1500px">
                    <tr>
                        <td colspan="6" style="width:50%;text-align:center"><b>C A R T O N S</b></td>
                        <td class="fusionCol" style="width:50%;text-align:center"><b>MOTIF DES CARTONS</b></td>
                    </tr>
                    <tr>
                        <td colspan="2" style="width:30%"></td>
                        <td style="width:5%;text-align:center">Jaune</td>
                        <td colspan="2" style="width:10%;text-align:center">Jaune-Rouge</td>
                        <td style="width:5%;text-align:center">Rouge</td>
                        <td class="fusionCol" style="width:50%"></td>
                    </tr>
                    <tr>
                        <td style="width:15%;text-align:center">Nom Prénom</td>
                        <td style="width:15%;text-align:center">Association</td>
                        <td style="width:5%"></td>
                        <td style="width:5%;text-align:center">1 Pt</td>
                        <td style="width:5%;text-align:center">2 Pt</td>
                        <td style="width:5%;text-align:center">J.A.</td>
                        <td class="fusionCol" style="width:50%"></td>
                    </tr>
                    <tr>
                        <td class="vide" style="width:15%">#CJ1</td>
                        <td style="width:15%">#CClub1</td>
                        <td style="width:5%">#CJaune1</td>
                        <td style="width:5%">#CJR1.1</td>
                        <td style="width:5%">#CJR2.1</td>
                        <td style="width:5%">#CRouge1</td>
                        <td style="width:50%">#MotifC1</td>
                    </tr>
                    <tr>
                        <td class="vide" style="width:15%">#CJ2</td>
                        <td style="width:15%">#CClub2</td>
                        <td style="width:5%">#CJaune2</td>
                        <td style="width:5%">#CJR1.2</td>
                        <td style="width:5%">#CJR2.2</td>
                        <td style="width:5%">#CRouge2</td>
                        <td style="width:50%">#MotifC2</td>
                    </tr>
                    <tr>
                        <td class="vide" style="width:15%">#CJ3</td>
                        <td style="width:15%">#CClub3</td>
                        <td style="width:5%">#CJaune3</td>
                        <td style="width:5%">#CJR1.3</td>
                        <td style="width:5%">#CJR2.3</td>
                        <td style="width:5%">#CRouge3</td>
                        <td style="width:50%">#MotifC3</td>
                    </tr>
                    <tr>
                        <td class="vide" style="width:15%">#CJ4</td>
                        <td style="width:15%">#CClub4</td>
                        <td style="width:5%">#CJaune4</td>
                        <td style="width:5%">#CJR1.4</td>
                        <td style="width:5%">#CJR2.4</td>
                        <td style="width:5%">#CRouge4</td>
                        <td style="width:50%">#MotifC4</td>
                    </tr>
                    <tr>
                        <td class="vide" style="width:15%">#CJ5</td>
                        <td style="width:15%">#CClub5</td>
                        <td style="width:5%">#CJaune5</td>
                        <td style="width:5%">#CJR1.5</td>
                        <td style="width:5%">#CJR2.5</td>
                        <td style="width:5%">#CRouge5</td>
                        <td style="width:50%">#MotifC5</td>
                    </tr>
                    <tr>
                        <td class="vide" style="width:15%">#CJ6</td>
                        <td style="width:15%">#CClub6</td>
                        <td style="width:5%">#CJaune6</td>
                        <td style="width:5%">#CJR1.6</td>
                        <td style="width:5%">#CJR2.6</td>
                        <td style="width:5%">#CRouge6</td>
                        <td style="width:50%">#MotifC6</td>
                    </tr>
                    <tr>
                        <td class="vide" style="width:15%">#CJ7</td>
                        <td style="width:15%">#CClub7</td>
                        <td style="width:5%">#CJaune7</td>
                        <td style="width:5%">#CJR1.7</td>
                        <td style="width:5%">#CJR2.7</td>
                        <td style="width:5%">#CRouge7</td>
                        <td style="width:50%">#MotifC7</td>
                    </tr>
                    <tr>
                        <td class="vide" style="width:15%">#CJ8</td>
                        <td style="width:15%">#CClub8</td>
                        <td style="width:5%">#CJaune8</td>
                        <td style="width:5%">#CJR1.8</td>
                        <td style="width:5%">#CJR2.8</td>
                        <td style="width:5%">#CRouge8</td>
                        <td style="width:50%">#MotifC8</td>
                    </tr>
                    <tr>
                        <td class="vide" style="width:15%">#CJ9</td>
                        <td style="width:15%">#CClub9</td>
                        <td style="width:5%">#CJaune9</td>
                        <td style="width:5%">#CJR1.9</td>
                        <td style="width:5%">#CJR2.9</td>
                        <td style="width:5%">#CRouge9</td>
                        <td style="width:50%">#MotifC9</td>
                    </tr>
                    <tr>
                        <td colspan="6" style="width:50%"></td>
                        <td style="width:50%"></td>
                    </tr>
                </table>
                <table id="tabMilieu" style="min-width:1500px">
                    <tr>
                        <td style="width:17%;text-align:center;vertical-align:top"><b>Capitaine Equipe A</b><p>#CapitaineA</p></td>
                        <td style="width:16%;text-align:center;vertical-align:top"><b>Juge-Arbitre</b><p>#NomJA</p></td>
                        <td style="width:17%;text-align:center;vertical-align:top"><b>Capitaine Equipe X</b><p>#CapitaineX</p></td>
                        <td class="fusionCol" style="width:2%"></td>
                        <td colSpan="2" style="width:48%;text-align:center"><b>RESERVES OU RECLAMATIONS</b>
						<p>Pour chaque réserve ou réclamation, veuillez noter l'heure et la marque au moment de l'infraction</p>
						</td>
                    </tr>
                    <tr>
                        <td colspan="3" style="width:50%;text-align:center"></td>
                        <td class="fusionCol" style="width:2%"></td>
                        <td colspan="2" style="width:48%"></td>
                    </tr>
                    <tr>
                        <td colspan="3" style="width:50%;text-align:center">RAPPORT DU JUGE ARBITRE</td>
                        <td class="fusionCol" style="width:2%"></td>
                        <td style="width:30%">Heure :</td>
                        <td style="width:18%">Score</td>
                    </tr>
                    <tr>
                        <td class="vide" colspan="3" style="width:50%">#Rap1</td>
                        <td class="fusionCol" style="width:2%"></td>
                        <td colSpan="2" style="width:48%">#Re1</td>
                    </tr>
                    <tr>
                        <td class="vide" colspan="3" style="width:50%">#Rap2</td>
                        <td class="fusionCol" style="width:2%"></td>
                        <td colSpan="2" style="width:48%">#Re2</td>
                    </tr>
                    <tr>
                        <td class="vide" colspan="3" style="width:50%">#Rap3</td>
                        <td class="fusionCol" style="width:2%"></td>
                        <td colSpan="2" style="width:48%">#Re3</td>
                    </tr>
                    <tr>
                        <td class="vide" colspan="3" style="width:50%">#Rap4</td>
                        <td class="fusionCol" style="width:2%"></td>
                        <td colSpan="2" style="width:48%">#Re4</td>
                    </tr>
                    <tr>
                        <td class="vide" colspan="3" style="width:50%">#Rap5</td>
                        <td class="fusionCol" style="width:2%"></td>
                        <td colSpan="2" style="width:48%">#Re5</td>
                    </tr>
                    <tr>
                        <td class="vide" colspan="3" style="width:50%">#Rap6</td>
                        <td class="fusionCol" style="width:2%"></td>
                        <td colSpan="2" style="width:48%">#Re6</td>
                    </tr>
                    <tr>
                        <td class="vide" colspan="3" style="width:50%">#Rap7</td>
                        <td class="fusionCol" style="width:2%"></td>
                        <td colSpan="2" style="width:48%">#Re7</td>
                    </tr>
                    <tr>
                        <td class="vide" colspan="3" style="width:50%">#Rap8</td>
                        <td class="fusionCol" style="width:2%"></td>
                        <td colSpan="2" style="width:48%">#Re8</td>
                    </tr>
                    <tr>
                        <td class="vide" colspan="3" style="width:50%">#Rap9</td>
                        <td class="fusionCol" style="width:2%"></td>
                        <td colSpan="2" style="width:48%">#Re9</td>
                    </tr>
                </table>
                <table class="fusionCol" style="min-width:1500px">
                    <tr>
						<td style="width:100%"></td>
					</tr>
				</table>
                <table id="tabBas" style="min-width:1500px">
                    <tr>
                        <td colSpan="3" style="width:50%;text-align:center">ARBITRES</td>
                        <td class="fusionCol" style="width:2%"></td>
                        <td class="signature" style="width:16%;text-align:center"><b>Capitaine Equipe A</b></td>
                        <td class="signature" style="width:15%;text-align:center"><b>Juge-Arbitre</b></td>
                        <td class="signature" style="width:16%;text-align:center"><b>Capitaine Equipe X</b></td>
                    </tr>
                    <tr>
                        <td style="width:17%;text-align:center">NOM</td>
                        <td style="width:16%;text-align:center">PRENOM</td>
                        <td style="width:17%;text-align:center">N° Licence</td>
                        <td class="fusionCol" style="width:2%"></td>
                        <td class="signature" style="width:16%;text-align:left">Signature</td>
                        <td class="signature" style="width:16%;text-align:left">Signature</td>
                        <td class="signature" style="width:16%;text-align:left">Signature</td>
                    </tr>
                    <tr>
                        <td class="vide" style="width:17%;text-align:center"></td>
                        <td style="width:16%;text-align:center"></td>
                        <td style="width:17%;text-align:center"></td>
                        <td class="fusionCol" style="width:2%"></td>
                        <td class="signature" style="width:16%;text-align:center">#CapitaineA</td>
                        <td class="signature" style="width:16%;text-align:center">#NomJA</td>
                        <td class="signature" style="width:16%;text-align:center">#CapitaineX</td>
                    </tr>
                    <tr>
                        <td class="vide" style="width:17%;text-align:center"></td>
                        <td style="width:16%;text-align:center"></td>
                        <td style="width:17%;text-align:center"></td>
                        <td class="fusionCol" style="width:2%"></td>
                        <td class="signature" style="width:16%;text-align:center">#LicCapitaineA</td>
                        <td class="signature" style="width:16%;text-align:center">#LicJA</td>
                        <td class="signature" style="width:16%;text-align:center">#LicCapitaineX</td>
                    </tr>
                    <tr>
                        <td class="vide" style="width:17%;text-align:center"></td>
                        <td style="width:16%;text-align:center"></td>
                        <td style="width:17%;text-align:center"></td>
                        <td class="fusionCol" style="width:2%"></td>
                        <td class="signature" style="width:16%;text-align:center"></td>
                        <td class="signature" style="width:16%;text-align:center"></td>
                        <td class="signature" style="width:16%;text-align:center"></td>
                    </tr>
                    <tr>
                        <td style="width:17%;text-align:center">
                            <img src="fftt.jpg" height="30px" width="50px"></img>
                        </td>
                        <td style="width:16%;text-align:center">
                            <p style="font-size:8px;padding-top:0;padding-bottom:0;margin-top:0;margin-bottom:0;">Toutes les informations</p>
                            <p style="font-size:8px;padding-top:0;padding-bottom:0;margin-top:0;margin-bottom:0;">sont disponibles sur :</p>
                            <p style="font-size:8px;padding-top:0;padding-bottom:0;margin-top:0;margin-bottom:0;">www.fftt.com</p>
                        </td>
                        <td style="width:17%;text-align:center">
                            <p>Abonnez vous à</p>
                            <img src="pub.jpg" height="30px" width="50px"></img>
                        </td>
                        <td class="fusionCol" style="width:2%"></td>
                        <td colspan="3" style="width:48%;text-align:center">La signature n'atteste que la connaissance, et non la reconnaissance des faits</td>
                    </tr>
                </table>
            </body>
        </html>
        `;
    }


}
