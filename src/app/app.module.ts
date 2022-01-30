import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptModule } from '@nativescript/angular'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'

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
import { ResultatComponent } from "./resultat/resultat.component";
import { QRMontrerComponent } from "./qrmontrer/qrmontrer.component";
import { QRScanComponent } from "./qrscan/qrscan.component";
import { SaisieCommentaireComponent } from "./saisiecommentaire/saisiecommentaire.component";
import { ValiderComponent } from "./valider/valider.component";
import { JugeArbitreComponent } from "./jugearbitre/jugearbitre.component";
import { FeuilleComponent } from "./feuille/feuille.component";
import { AttenteComponent } from "./attente/attente.component";
import { DownloadComponent } from "./download/download.component";
import { AjouterRencontreComponent } from "./ajouterRencontre/ajouterRencontre.component";
import { DetailsRencontreComponent } from "./detailsRencontre/detailsRencontre.component";


@NgModule({
  bootstrap: [AppComponent],
  imports: [NativeScriptModule, AppRoutingModule],
  declarations: [AppComponent, 
                ActionsComponent,
                AjouterClubComponent,
                AjouterJoueursComponent,
                AjouterRencontreComponent,
                AttenteComponent,
                ChoixRencontreComponent,
                ClubComponent,
                CompoComponent,
                CompoDoubleComponent,
                CompoDoubleExtComponent,
                DetailsRencontreComponent,
                DownloadComponent,
                FeuilleComponent,
                JoueursComponent,
                JugeArbitreComponent,
                LancementComponent,
                PlacerComponent,
                PreparationComponent,
                QRMontrerComponent,
                QRScanComponent,
                RencontreComponent,
                ResultatComponent,
                SaisieCommentaireComponent,
                ValiderComponent, 
              ],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
