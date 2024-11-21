import { Puzzle } from '../../lib/Puzzle';

export class a202403 extends Puzzle {
    grid: boolean[][];
    totalCleared = 0;
    sampleMode(): void { };

    _loadData(lines: string[]) {
        this.grid = lines.map(line => line.split('').map(ch => ch==='#'));
    }

    openAround(_x: number, _y: number): boolean {
        let clear = false;
        [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dx, dy]) => {
            let [x, y] = [_x + dx, _y + dy];
            if (x >= 0 && y >= 0 && x < this.grid[0].length && y < this.grid.length && this.grid[y][x] === false) clear = true;
        });
        return clear;
    }

    _runStep(): boolean {
        let moreToDo = false;
        let dig = new Set<string>();
        for (let y=0; y<this.grid.length; y++) {
            for (let x=0; x<this.grid[y].length; x++) {
                if (this.grid[y][x] && this.openAround(x, y)) {
                    dig.add(`${x},${y}`);
                }
            }
        }

        dig.forEach(key => {
            let [x, y] = key.split(',');
            this.grid[y][x] = false;
        })

        console.error(`${this.stepNumber} cleared ${dig.size}`);
        this.totalCleared += this.stepNumber * dig.size;

        moreToDo = dig.size > 0;

        if (!moreToDo) {
            this.result = this.totalCleared.toString();
        }
        return moreToDo;
    }
}