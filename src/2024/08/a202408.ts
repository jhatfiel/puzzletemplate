import { Puzzle } from '../../lib/Puzzle.js';

export class a202408 extends Puzzle {
    sampleMode(): void { };

    _loadData(lines: string[]) {
        
    }

    _runStep(): boolean {
        let moreToDo = this.stepNumber < this.lines.length;
        let avail = Number(this.lines[0]);
        let sqrt = Math.ceil(Math.sqrt(avail));
        let nextSquare = sqrt**2;
        let diff = nextSquare - avail;
        let width = sqrt*2 -1;
        this.log({avail, sqrt, nextSquare, diff, width});
        if (!moreToDo) {
            this.result = (width * diff).toString();
        }
        return moreToDo;
    }
}