import { Puzzle } from '../../lib/Puzzle.js';

export class c202408 extends Puzzle {
    numP: number;
    numA = 10;
    blocks = 202400000;
    heights: number[] = [0]; // 0 is unused
    thickness = 1;

    sampleMode(): void {
        this.numA = 5;
        this.blocks = 160;
    };

    _loadData(lines: string[]) {
        this.numP = Number(lines[0]);
    }

    _runStep(): boolean {
        let width = this.stepNumber*2 - 1;
        if (this.stepNumber !== 1) {
            this.thickness = (this.thickness * this.numP) % this.numA + this.numA;
            for (let i=1; i<this.stepNumber; i++) {
                this.heights[i] += this.thickness;
            }
        }
        this.heights.push(this.thickness);
        //this.log(`[${this.stepNumber.toString().padStart(6)}]: Thickness: ${this.thickness} heights: ${this.heights.map(h=>`[${h}]`).join('')}`);
        let heights = this.heights.map(h=>`[${h}]`);
        let removes = new Array(this.heights.length).fill(0);
        //this.log(`[${this.stepNumber.toString().padStart(6)}]: Width: ${width} Thickness: ${this.thickness} heights: ${[...heights.slice(1).reverse(), ...heights.slice(2)].join('')}`);

        // find out how much can be removed from each column
        // first/last column can't be touched (length-2)
        for (let i=this.heights.length-2; i>0; i--) {
            let height = this.heights[i];
            let prev = this.heights[i+1];
            let remove = (this.numP * width * height) % this.numA;
            removes[i] = remove;

            //this.log(`COL ${i}, remove: ${remove}`);
        }

        let totalBlocks = this.heights[1] - removes[1] + this.heights.slice(2).reduce((sum, h, i) => sum+2*(h-removes[i+2]), 0);
        let needed = this.blocks - totalBlocks;
        this.log(`${this.stepNumber} ${needed}`);

        let moreToDo = needed > 0;
        if (!moreToDo) {
            this.result = (-1*needed).toString();
        }
        return moreToDo;
    }
}