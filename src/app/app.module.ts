import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptModule } from '@nativescript/angular'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'

import { ActionsComponent } from "./actions/actions.component";
import { AideComponent } from "./aide/aide.component";
import { AjouterClubComponent } from "./ajouterClub/ajouterClub.component";
import { AjouterJoueursComponent } from "./ajouterJoueurs/ajouterJoueurs.component";
import { AjouterRencontreComponent } from "./ajouterRencontre/ajouterRencontre.component";
import { AttenteComponent } from "./attente/attente.component";
import { ChoixRencontreComponent } from "./choixrencontre/choixrencontre.component";
import { ClubComponent } from "./club/club.component";
import { CompoComponent } from "./compo/compo.component";
import { CompoDoubleComponent } from "./compodouble/compodouble.component";
import { CompoDoubleExtComponent } from "./compodoubleext/compodoubleext.component";
import { DetailsRencontreComponent } from "./detailsRencontre/detailsRencontre.component";
import { EnvoiComponent } from "./envoi/envoi.component";
import { FeuilleComponent } from "./feuille/feuille.component";
import { InitComponent } from "./init/init.component";
import { JoueursComponent } from "./joueurs/joueurs.component";
import { JugeArbitreComponent } from "./jugearbitre/jugearbitre.component";
import { LancementComponent } from "./lancement/lancement.component";
import { PlacerComponent } from "./placer/placer.component";
import { PreparationComponent } from "./preparation/preparation.component";
import { RencontreComponent } from "./rencontre/rencontre.component";
import { ResultatComponent } from "./resultat/resultat.component";
import { QRMontrerComponent } from "./qrmontrer/qrmontrer.component";
import { QRScanComponent } from "./qrscan/qrscan.component";
import { SaisieCommentaireComponent } from "./saisiecommentaire/saisiecommentaire.component";
import { SignerComponent } from "./signer/signer.component";
import { ValiderComponent } from "./valider/valider.component";

@NgModule({
  bootstrap: [AppComponent],
  imports: [NativeScriptModule, AppRoutingModule],
  declarations: [AppComponent, 
                AideComponent,
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
                EnvoiComponent,
                FeuilleComponent,
                JoueursComponent,
                JugeArbitreComponent,
                InitComponent,
                LancementComponent,
                PlacerComponent,
                PreparationComponent,
                QRMontrerComponent,
                QRScanComponent,
                RencontreComponent,
                ResultatComponent,
                SignerComponent,
                SaisieCommentaireComponent,
                ValiderComponent, 
              ],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
