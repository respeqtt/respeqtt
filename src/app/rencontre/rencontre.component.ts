
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Page, GridLayout, Label, Button, EventData } from "@nativescript/core";



@Component({
    templateUrl: "./rencontre.component.html",
    moduleId:module.id
})
export class RencontreComponent{
    recoitA=true
    @ViewChild('CBRecoitA') CBRecoitA:ElementRef;

    constructor() {}

    onTap(args: EventData) {
        let button = args.object as Button;
        // execute your custom logic here...
        // >> (hide)
        alert("Tapped ");
        // << (hide)
    }
    public toggleCheck() {
        this.CBRecoitA.nativeElement.toggle();
    }
    public getCheckProp() {
        console.log(
          'checked prop value = ' + this.CBRecoitA.nativeElement.checked
        );
      }

    public onCheckBoxTap() {
        if(this.recoitA) {
            this.recoitA = false
        } else {
            this.recoitA = true
        }
        alert("Checked : " + this.recoitA);

    }
}
