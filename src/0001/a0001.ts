import { Puzzle } from '../lib/Puzzle';

export class a0001 extends Puzzle {
    sampleMode(): void { };

    _loadData(lines: string[]) { }

    _runStep(): boolean {
        let moreToDo = false;
        this.result = this.lines[0];
        this.log(this.result);
        return moreToDo;
    }
}