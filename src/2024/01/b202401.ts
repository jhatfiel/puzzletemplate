import { Puzzle } from '../../lib/Puzzle';

export class b202401 extends Puzzle {
    potionsNeeded = new Map<string, number>([['A', 0], ['B', 1], ['C', 3], ['D', 5], ['x', 0]]);
    sampleMode(): void { };

    _loadData(lines: string[]) { }

    _runStep(): boolean {
        let moreToDo = false;
        let enemies = this.lines[0].split('');
        let cost = 0;
        for (let i=0; i<enemies.length; i+=2) {
            let a = enemies[i];
            let b = enemies[i+1];
            if (a === 'x') cost += this.potionsNeeded.get(b);
            else if (b === 'x') cost += this.potionsNeeded.get(a);
            else {
                cost += 2;
                cost += this.potionsNeeded.get(a);
                cost += this.potionsNeeded.get(b);
            }
        }
        this.result = cost.toString();
        return moreToDo;
    }
}