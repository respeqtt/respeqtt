
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "@nativescript/angular";

import { AppComponent } from "./app.component";
import { ActionsComponent } from "./actions/actions.component";
import { RencontreComponent } from "./rencontre/rencontre.component";
import { PreparationComponent } from "./preparation/preparation.component";
import { TNSCheckBoxModule } from '@nstudio/nativescript-checkbox/angular';

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
//        RouterModule
    ],
    declarations: [
        AppComponent,
        ActionsComponent,
        PreparationComponent,
        RencontreComponent
    ],
    providers: [],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }

