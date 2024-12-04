import { Puzzle } from '../../lib/Puzzle.js';

export class b202408 extends Puzzle {
    numP: number;
    numA = 1111;
    blocks = 20240000;
    thickness = 1;

    sampleMode(): void {
        this.numA = 5;
        this.blocks = 50;
    };

    _loadData(lines: string[]) {
        this.numP = Number(lines[0]);
    }

    _runStep(): boolean {
        if (this.stepNumber === 1) {
            this.blocks--;
        } else {
            this.thickness = (this.thickness * this.numP) % this.numA;
            this.blocks -= this.thickness * (this.stepNumber*2 - 1);
        }
        this.log(`[${this.stepNumber.toString().padStart(6)}]: Thickness: ${this.thickness} Remaining blocks: ${this.blocks}`);
        let moreToDo = this.blocks > 0;
        if (!moreToDo) {
            this.result = (-1*this.blocks*(this.stepNumber*2 - 1)).toString();
        }
        return moreToDo;
    }
}