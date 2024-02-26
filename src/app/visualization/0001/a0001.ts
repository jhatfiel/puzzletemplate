import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { PuzzleVisualizationComponent } from "../PuzzleVisualization.component";
import { a0001 } from "../../../0001/a0001";
import { Router } from "@angular/router";
import { NavService } from "../../nav.service";

@Component({
    selector: 'a0001',
    templateUrl: './a0001.html',
    styleUrls: ['./a0001.css']
})
export class a0001Component extends PuzzleVisualizationComponent implements OnInit, AfterViewChecked {
    @ViewChild('scrollOutput') private scrollOutput: ElementRef
    output: string = '';
    puzzle: a0001;
    sceneType: Phaser.Types.Scenes.SceneType;

    constructor(public router: Router, public navService: NavService) {
        super(navService);
    }

    ngOnInit() { }

    ngAfterViewChecked(): void {
        this.scrollOutput.nativeElement.scrollTop = this.scrollOutput.nativeElement.scrollHeight;
    }

    reset() {
        this.navService.maxSteps = undefined;
        this.navService.maxTimeMS = 100;
        this.output = '';
        this.puzzle = this.navService.puzzle as a0001;
    }

    log(msg) {
        this.output += msg + "\n";
    }

    step() {
    }
}