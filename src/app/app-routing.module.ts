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

import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";

import { ActionsComponent } from "./actions/actions.component";
import { RencontreComponent } from "./rencontre/rencontre.component";
import { ChoixRencontreComponent } from "./choixrencontre/choixrencontre.component";
import { JoueursComponent } from "./joueurs/joueurs.component";
import { ClubComponent } from "./club/club.component";
import { PreparationComponent } from "./preparation/preparation.component";
import { CompoComponent } from "./compo/compo.component";
import { CompoDoubleComponent } from "./compodouble/compodouble.component";
import { PlacerComponent } from "./placer/placer.component";
import { LancementComponent } from "./lancement/lancement.component";
import { EnvoiComponent } from "./envoi/envoi.component";
import { ResultatComponent } from "./resultat/resultat.component";
import { QRMontrerComponent } from "./qrmontrer/qrmontrer.component";
import { QRScanComponent } from "./qrscan/qrscan.component";
import { SaisieCommentaireComponent, } from "./saisiecommentaire/saisiecommentaire.component";
import { ValiderComponent } from "./valider/valider.component";
import { JugeArbitreComponent } from "./jugearbitre/jugearbitre.component";
import { FeuilleComponent } from "./feuille/feuille.component";

const routes: Routes = [
    { path: "", redirectTo: "/actions", pathMatch: "full" },
    { path: "actions", component: ActionsComponent },
    { path: "rencontre", component: RencontreComponent },
    { path: "choixrencontre", component: ChoixRencontreComponent },
    { path: "joueurs", component: JoueursComponent },
    { path: "clubs", component: ClubComponent },
    { path: "preparation", component: PreparationComponent },
    { path: "compo/:cote", component: CompoComponent },
    { path: "compoDouble/:cote/:numDouble/:nbDoubles", component: CompoDoubleComponent },  // coté = A ou X ; numDouble = numéro du double à composer ; nbDoubles = nb de doubles
    { path: "placer/:cote", component: PlacerComponent },
    { path: "lancement", component: LancementComponent },
    { path: "envoi", component: EnvoiComponent },
    { path: "resultat/:partie", component: ResultatComponent },
    { path: "qrmontrer/:quoi/:dim/:titre", component: QRMontrerComponent }, // dim = dimension du QRCode en pixels écran
    { path: "qrscan/:quoi/:param", component: QRScanComponent },    // quoi = COMPO ou PARTIE ; param = numPartie
    { path: "saisiecommentaire/:quoi/:auteur", component: SaisieCommentaireComponent },    // quoi = RESERVE ou RECLAMATION ou RAPPORT ; auteur = club ou JA
    { path: "valider/:scoreA/:scoreX", component: ValiderComponent },    // scoreA = score du club A ; scoreX = score du club X
    { path: "jugearbitre", component: JugeArbitreComponent },
    { path: "feuille", component: FeuilleComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
