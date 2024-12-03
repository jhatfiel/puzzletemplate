import { Puzzle } from '../../lib/Puzzle';

interface Result {name: string, score: number};

export class a202407 extends Puzzle {
    scores: Result[] = [];

    sampleMode(): void { };

    simulate(line: string): Result {
        let [name, rest] = line.split(':');
        let ops = rest.split(',');
        let s = 10;
        let score = 0;
        for (let i=0; i<10; i++) {
            let op = ops[i%ops.length];
            switch (op) {
                case '+': s++; break;
                case '-': s--; break;
            }
            s = Math.max(0, s);
            score += s;
        }
        return {name, score};
    }

    _loadData(lines: string[]) { }

    _runStep(): boolean {
        let moreToDo = this.stepNumber < this.lines.length;
        this.scores.push(this.simulate(this.lines[this.stepNumber-1]));
        if (!moreToDo) {
            this.result = this.scores.sort((a,b) => b.score-a.score).map(r => r.name).join('');
        }
        return moreToDo;
    }
}