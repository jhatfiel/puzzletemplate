import { Puzzle } from '../../lib/Puzzle.js';

export class a202410 extends Puzzle {
    grid: string[][];
    sampleMode(): void { };

    _loadData(lines: string[]) {
        this.grid = lines.map(line => line.split(''));
    }

    _runStep(): boolean {
        let i = this.stepNumber - 1;
        let moreToDo = i < 15;
        let r = 2 + (Math.floor(i/4));
        let c = 2 + (i%4);
        this.log({r,c});
        let rSet = new Set<string>([this.grid[r][0], this.grid[r][1], this.grid[r][6], this.grid[r][7]]);
        let cSet = new Set<string>([this.grid[0][c], this.grid[1][c], this.grid[6][c], this.grid[7][c]]);
        let same = [...rSet.keys()].filter(c => cSet.has(c));
        this.result += same[0];
        return moreToDo;
    }
}