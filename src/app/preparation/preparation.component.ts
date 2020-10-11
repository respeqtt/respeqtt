
import { Component, OnInit } from "@angular/core";
import { GridLayout, Label, Button, EventData } from "@nativescript/core";


@Component({
    templateUrl: "./preparation.component.html",
    moduleId:module.id
})
export class PreparationComponent{
    onTap(args: EventData) {
        let button = args.object as Button;
        // execute your custom logic here...
        // >> (hide)
        alert("Tapped ");
        // << (hide)
    }
}
