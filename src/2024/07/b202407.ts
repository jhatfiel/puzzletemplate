import { Puzzle } from '../../lib/Puzzle';

interface Result {name: string, score: number};

export class b202407 extends Puzzle {
    scores: Result[] = [];
    track: string[] = ('-=++=-==++=++=-=+=-=+=+=--=-=++=-==++=-+=-=+=-=+=+=++=-+==++=++=-=-=---=++==-' + 
                       '--==++++==+=+++-=+=-=+=-+-=+-=+-=+=-=+=--=+++=++=+++==++==--=+=++==+++-'.split('').reverse().join('') +
                       '-=+=+=-S').split('');

    sampleMode(): void {
        this.track = '+===++-=+=-S'.split('');
    };

    simulate(line: string): Result {
        let [name, rest] = line.split(':');
        let ops = rest.split(',');
        let s = 10;
        let score = 0;
        for (let i=0; i<10*this.track.length; i++) {
            let op = ops[i%ops.length];
            let delta = 0;
            switch (op) {
                case '+': delta = 1; break;
                case '-': delta = -1; break;
            }
            op = this.track[i%this.track.length];
            switch (op) {
                case '+': delta = 1; break;
                case '-': delta = -1; break;
            }
            s = Math.max(0, s + delta);
            score += s;
            //this.log({name, i, score, s});
        }
        this.log({name, score});
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