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


import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule, NativeScriptFormsModule } from "@nativescript/angular";


import { AppComponent } from "./app.component";
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
import { ResultatComponent } from "./resultat/resultat.component";
import { TNSCheckBoxModule } from '@nstudio/nativescript-checkbox/angular';
import { QRMontrerComponent } from "./qrmontrer/qrmontrer.component";
import { QRScanComponent } from "./qrscan/qrscan.component";
import { SaisieCommentaireComponent } from "./saisiecommentaire/saisiecommentaire.component";
import { ValiderComponent } from "./valider/valider.component";
import { JugeArbitreComponent } from "./jugearbitre/jugearbitre.component";
import { FeuilleComponent } from "./feuille/feuille.component";
import { AttenteComponent } from "./attente/attente.component";




// import { RouterModule } from "@angular/router";
import { AppRoutingModule } from "./app-routing.module";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        TNSCheckBoxModule,
        NativeScriptFormsModule
    ],
    declarations: [
        AppComponent,
        ActionsComponent,
        PreparationComponent,
        CompoComponent,
        CompoDoubleComponent,
        PlacerComponent,
        RencontreComponent,
        ChoixRencontreComponent,
        JoueursComponent,
        ClubComponent,
        LancementComponent,
        ResultatComponent,
        QRMontrerComponent,
        QRScanComponent,
        SaisieCommentaireComponent,
        ValiderComponent,
        JugeArbitreComponent,
        FeuilleComponent,
        AttenteComponent
    ],
    providers: [],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }

