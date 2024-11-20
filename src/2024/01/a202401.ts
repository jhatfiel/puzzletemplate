import { Puzzle } from '../../lib/Puzzle';

export class a202401 extends Puzzle {
    potionsNeeded = new Map<string, number>([['A', 0], ['B', 1], ['C', 3]]);
    sampleMode(): void { };

    _loadData(lines: string[]) { }

    _runStep(): boolean {
        let moreToDo = false;
        this.result = (this.lines[0].split('').map(enemy => this.potionsNeeded.get(enemy)).reduce((total, num)=>total+num,0)).toString();
        return moreToDo;
    }
}