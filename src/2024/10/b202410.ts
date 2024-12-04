import { Puzzle } from '../../lib/Puzzle.js';

export class b202410 extends Puzzle {
    grid: string[][];
    numGrids: number;
    numWide: number;
    numTall: number;

    sampleMode(): void { };
    totalPower = 0;

    _loadData(lines: string[]) {
        this.grid = lines.map(line => line.split(''));
        this.numWide = (this.grid[0].length+1)/9;
        this.numTall = (this.grid.length+1)/9;
        this.numGrids = this.numWide * this.numTall;
        this.log(this.numGrids);
    }

    calculatePower(whichGrid: number): number {
        let power = 0;
        let grid = this.grid;
        let ro = Math.floor(whichGrid/this.numWide) * 9;
        let co = (whichGrid%this.numWide) * 9;

        for (let i=0; i<16; i++) {
            let r = 2+Math.floor(i/4);
            let c = 2+i%4;
            let rSet = new Set<string>([grid[ro+r][co+0], grid[ro+r][co+1], grid[ro+r][co+6], grid[ro+r][co+7]]);
            let cSet = new Set<string>([grid[ro+0][co+c], grid[ro+1][co+c], grid[ro+6][co+c], grid[ro+7][co+c]]);
            power += (i+1) * ([...rSet.keys()].filter(c => cSet.has(c))[0].charCodeAt(0) - 'A'.charCodeAt(0) + 1);
        }

        return power;
    }

    _runStep(): boolean {
        let moreToDo = this.stepNumber < this.numGrids;

        let power = this.calculatePower(this.stepNumber-1);
        this.log(`Grid: ${this.stepNumber-1} power=${power}`);
        this.totalPower += power;
        
        if (!moreToDo) {
            this.result = this.totalPower.toString();
        }
        return moreToDo;
    }
}