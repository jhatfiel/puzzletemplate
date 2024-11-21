import { Puzzle } from '../../lib/Puzzle';

export class a202402 extends Puzzle {
    sampleMode(): void { };

    _loadData(lines: string[]) { }

    _runStep(): boolean {
        let moreToDo = false;
        let count = 0;

        for (let word of this.lines[0].split(':')[1].split(',')) {
            count += [...this.lines[2].matchAll(new RegExp(word, 'g'))].length;
        }

        this.result = count.toString();
        return moreToDo;
    }
}