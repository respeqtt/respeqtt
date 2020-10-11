import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "@nativescript/angular";

import { ActionsComponent } from "./actions/actions.component";
import { RencontreComponent } from "./rencontre/rencontre.component";
import { PreparationComponent } from "./preparation/preparation.component";
import { LancementComponent } from "./lancement/lancement.component";
import { FinComponent } from "./fin/fin.component";
import { EnvoiComponent } from "./envoi/envoi.component";

const routes: Routes = [
    { path: "", redirectTo: "/actions", pathMatch: "full" },
    { path: "actions", component: ActionsComponent },
    { path: "rencontre", component: RencontreComponent },
    { path: "preparation", component: PreparationComponent },
    { path: "lancement", component: LancementComponent },
    { path: "fin", component: FinComponent },
    { path: "envoi", component: EnvoiComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
