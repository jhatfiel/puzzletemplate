import { Puzzle } from '../../lib/Puzzle';

export class c202404 extends Puzzle {
    heights: number[];
    median: number;
    minHeight: number;
    hits = 0;

    sampleMode(): void { };

    _loadData(lines: string[]) {
        this.heights = this.lines.map(Number).sort();
        this.median = this.heights[Math.floor(this.heights.length/2)];
        this.minHeight = this.heights.reduce((min, h) => Math.min(h, min), Infinity);
        console.log(this.median);
    }

    _runStep(): boolean {
        let moreToDo = this.stepNumber < this.lines.length;
        this.hits += Math.abs(this.heights[this.stepNumber-1] - this.median);
        if (!moreToDo) {
            this.result = this.hits.toString();
        }
        return moreToDo;
    }
}