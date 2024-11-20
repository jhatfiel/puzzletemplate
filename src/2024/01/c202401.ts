import { Puzzle } from '../../lib/Puzzle';

export class c202401 extends Puzzle {
    potionsNeeded = new Map<string, number>([['A', 0], ['B', 1], ['C', 3], ['D', 5]]);
    extraNeeded = new Map<number, number>([[0, 0], [1, 0], [2, 2], [3, 6]]);
    sampleMode(): void { };

    _loadData(lines: string[]) { }

    _runStep(): boolean {
        let moreToDo = false;
        let enemies = this.lines[0].split('');
        let cost = 0;
        for (let i=0; i<enemies.length; i+=3) {
            let a = this.potionsNeeded.get(enemies[i]);
            let b = this.potionsNeeded.get(enemies[i+1]);
            let c = this.potionsNeeded.get(enemies[i+2]);
            let numEnemies = 0;
            let thisCost = 0;
            if (a !== undefined) { numEnemies++; thisCost += a; }
            if (b !== undefined) { numEnemies++; thisCost += b; }
            if (c !== undefined) { numEnemies++; thisCost += c; }
            thisCost += this.extraNeeded.get(numEnemies);
            cost += thisCost;
        }
        this.result = cost.toString();
        return moreToDo;
    }
}