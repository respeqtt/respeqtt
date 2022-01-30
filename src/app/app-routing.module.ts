import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from '@nativescript/angular'

import { ActionsComponent } from "./actions/actions.component";
import { RencontreComponent } from "./rencontre/rencontre.component";
import { ChoixRencontreComponent } from "./choixrencontre/choixrencontre.component";
import { JoueursComponent } from "./joueurs/joueurs.component";
import { AjouterJoueursComponent } from "./ajouterJoueurs/ajouterJoueurs.component";
import { ClubComponent } from "./club/club.component";
import { AjouterClubComponent } from "./ajouterClub/ajouterClub.component";
import { PreparationComponent } from "./preparation/preparation.component";
import { CompoComponent } from "./compo/compo.component";
import { CompoDoubleComponent } from "./compodouble/compodouble.component";
import { CompoDoubleExtComponent } from "./compodoubleext/compodoubleext.component";
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
import { AttenteComponent } from "./attente/attente.component";
import { DownloadComponent } from "./download/download.component";
import { AjouterRencontreComponent } from "./ajouterRencontre/ajouterRencontre.component";
import { DetailsRencontreComponent } from "./detailsRencontre/detailsRencontre.component";


const routes: Routes = [
  { path: '', redirectTo: '/actions', pathMatch: 'full' },
  { path: "actions", component: ActionsComponent }, 
  { path: "ajouterClub", component: AjouterClubComponent },
  { path: "ajouterJoueurs/:club", component: AjouterJoueursComponent },       // description du club qui va recevoir les nouveaux joueurs
  { path: "ajouterRencontre", component: AjouterRencontreComponent },
  { path: "attente/:quoi/:dim/:titre/:retour/:param", component: AttenteComponent },  // quoi, dim, titre -> cf qrmontrer, retour = page appelante, param = paramètre de la page appelante
  { path: "choixrencontre", component: ChoixRencontreComponent },
  { path: "clubs/:retour", component: ClubComponent },
  { path: "compo/:cote", component: CompoComponent },
  { path: "compoDouble/:cote/:numDouble/:nbDoubles", component: CompoDoubleComponent },  // coté = A ou X ; numDouble = numéro du double à composer ; nbDoubles = nb de doubles
  { path: "compoDoubleExt/:cote/:numDouble/:nbDoubles", component: CompoDoubleExtComponent },  // coté = A ou X ; numDouble = numéro du double à composer ; nbDoubles = nb de doubles
  { path: "detailsRencontre/:club1/:club2", component: DetailsRencontreComponent },           // club1 = domicile, club2 = visiteur
  { path: "download/:dim", component: DownloadComponent },
  { path: "envoi", component: EnvoiComponent },
  { path: "feuille", component: FeuilleComponent },
  { path: "joueurs", component: JoueursComponent },
  { path: "jugearbitre", component: JugeArbitreComponent },
  { path: "lancement", component: LancementComponent },
  { path: "placer/:cote", component: PlacerComponent },
  { path: "preparation", component: PreparationComponent },
  { path: "qrmontrer/:quoi/:dim/:titre/:retour/:param", component: QRMontrerComponent }, // dim = dimension du QRCode en pixels écran
  { path: "qrscan/:quoi/:param", component: QRScanComponent },    // quoi = COMPO ou PARTIE ; param = numPartie
  { path: "rencontre", component: RencontreComponent },
  { path: "resultat/:partie", component: ResultatComponent },
  { path: "saisiecommentaire/:quoi/:auteur/:retour", component: SaisieCommentaireComponent },    // quoi = RESERVE ou RECLAMATION ou RAPPORT ; auteur = club ou JA ; retour = page d'appel
  { path: "valider/:scoreA/:scoreX", component: ValiderComponent }    // scoreA = score du club A ; scoreX = score du club X
]

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
