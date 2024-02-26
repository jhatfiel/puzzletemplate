import { Injectable } from "@angular/core";
import { Event, NavigationEnd, Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { PuzzleVisualizationComponent } from "./visualization/PuzzleVisualization.component";
import { Puzzle } from "../lib/Puzzle";
import { HttpParams } from "@angular/common/http";

export enum PUZZLE_STATE {
    DISABLED, // not created or no data
    PAUSED,
    PLAYING,
    DONE
}

@Injectable()
export class NavService {
    private static DEFAULT_MAX_STEPS=1;
    public appComponent: any;
    public currentUrl = new BehaviorSubject<string>(undefined);
    public stateBehavior = new BehaviorSubject<PUZZLE_STATE>(PUZZLE_STATE.DISABLED);
    public currentPuzzleComponent: PuzzleVisualizationComponent;
    public puzzle: Puzzle;
    public auto = localStorage.getItem('autoPlay') === 'true';
    public stepDelay = Number(localStorage.getItem('stepDelay') ?? '0');
    public inputFileBehavior = new BehaviorSubject<string>('');
    public lines: string[];
    public classname: string;
    public id: string;
    public part: string;
    public clazzModule: any;
    public files = ['sample', 'input'];
    public maxSteps: number;
    public maxTimeMS: number;
    public lastTimeout: number;
    public lastStep: number;

    constructor(private router: Router) {
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                this.stateBehavior.next(PUZZLE_STATE.DISABLED);
                this.currentUrl.next(event.urlAfterRedirects);
                this.puzzle = undefined;

                let arr = this.currentUrl.value.split('/');
                if (arr.length > 1) {
                    this.id = arr[1];
                    this.maxSteps = NavService.DEFAULT_MAX_STEPS;
                    this.maxTimeMS = undefined;
                    this.lastTimeout = performance.now();
                    this.lastStep = 0;
                    arr = arr[2].split('?');
                    this.part = arr[0];
                    const httpParams = new HttpParams({fromString: arr[1]});
                    this.classname = `${this.part}${this.id}`;
                    if (httpParams.getAll('files')) {
                        this.files = httpParams.getAll('files');
                    } else {
                        this.files = ['sample', 'input'];
                    }
                    import(
                        /* webpackInclude: /src[\/\\]\d+[\/\\][a-z]\d+.ts$/ */
                        `src/${this.id}/${this.classname}`
                    ).then(clazzModule => {
                        this.clazzModule = clazzModule;
                        if (httpParams.get('inputFile')) {
                            this.loadFile(httpParams.get('inputFile'));
                        }
                    });
                } else {
                    this.id = undefined;
                    this.part = undefined;
                }
            }
        });
    }

    public getPuzzleLink() {
        let link = 'https://example.com/';
        if (this.id) link += `${this.id}`;
        return link;
    }

    public closeNav() {
        this.appComponent.sidebarVisible = false;
    }

    public openNav() {
        this.appComponent.sidebarVisible = true;
    }

    public getPuzzleDescription() {
        if (this.id) return `${this.id} Part ${this.part}`;
        else return 'Select Puzzle';
    }

    public getPuzzleStepNumber() {
        if (this.puzzle) return `${this.puzzle.stepNumber}`;
        else return '';
    }

    public selectFile(inputFile: string) {
        this.router.navigate([], {queryParams: { inputFile }, queryParamsHandling: 'merge'})
    }

    public loadFile(inputFile: string) {
        this.puzzle = null;
        this.inputFileBehavior.next(inputFile);
        const datafile = `${this.id}/${inputFile}`;
        import(
            `data/${datafile}.txt`
        ).then((valueModule) => {
            this.lines = valueModule['default'].trimRight().split(/\r?\n/);
            this.stateBehavior.next(PUZZLE_STATE.PAUSED);
            this.init();

            if (this.auto) {
                this.stateBehavior.next(PUZZLE_STATE.PLAYING);
                this.play();
            }
        })
    }

    public init() {
        console.log(`Viz parameters: maxTimeMS=${this.maxTimeMS}, maxSteps=${this.maxSteps}`)
        if (!this.puzzle || this.stateBehavior.value === PUZZLE_STATE.DONE) {
            this.puzzle = new this.clazzModule[this.classname](this.inputFileBehavior.value, msg => {
                if (this.currentPuzzleComponent) this.currentPuzzleComponent.log(msg);
            });
            this.puzzle.loadData(this.lines);
            this.currentPuzzleComponent.reset();
            this.stateBehavior.next(PUZZLE_STATE.PAUSED);
            return true;
        }
        return false;
    }

    public step() {
        let hasMore = this.puzzle.runStep();
        this.currentPuzzleComponent.step();
        if (!hasMore) this.stateBehavior.next(PUZZLE_STATE.DONE);
    }

    public play() {
        if (!this.puzzle || this.stateBehavior.value === PUZZLE_STATE.DONE) return;
        let hasMore = this.puzzle.runStep();
        this.currentPuzzleComponent.step();
        if (!hasMore) this.stateBehavior.next(PUZZLE_STATE.DONE);
        else if (this.stateBehavior.value !== PUZZLE_STATE.PAUSED) {
            if (this.stepDelay) {
                setTimeout(this.play.bind(this), this.stepDelay);
            } else if (this.lastTimeout === undefined || (this.maxTimeMS && performance.now()-this.lastTimeout > this.maxTimeMS) || (this.maxSteps && this.puzzle.stepNumber - this.lastStep > this.maxSteps)) {
                this.lastTimeout = performance.now();
                this.lastStep = this.puzzle.stepNumber;
                setTimeout(this.play.bind(this));
            } else {
                queueMicrotask(() => this.play())
            }
        }
    }
}