import { Component, OnInit } from "@angular/core";
import { Label, Button, EventData } from "@nativescript/core";


@Component({
    templateUrl: "./lancement.component.html",
    moduleId:module.id
})
export class LancementComponent{
    onTap(args: EventData) {
        let button = args.object as Button;
        // execute your custom logic here...
        // >> (hide)
        alert("Tapped ");
        // << (hide)
    }
}
