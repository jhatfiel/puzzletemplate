import { Puzzle } from '../../lib/Puzzle.js';

export class b202411 extends Puzzle {
    termites = ['Z'];
    production: Map<string, string[]>;
    sampleMode(): void { };

    _loadData(lines: string[]) {
        this.production = new Map(lines.map(line => line.split(':')).map(([a, str]) => ([a, str.split(',')])));
    }

    _runStep(): boolean {
        let moreToDo = this.stepNumber < 10;
        this.termites = this.termites.flatMap(c => this.production.get(c));
        //this.log(`${this.stepNumber} ${this.termites.length} (${this.termites.join(',')})`);
        if (!moreToDo) {
            this.result = this.termites.length.toString();
        }
        return moreToDo;
    }
}