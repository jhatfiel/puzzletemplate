import { Puzzle } from '../../lib/Puzzle.js';

export class c202410 extends Puzzle {
    grid: string[][];
    numGrids: number;
    numWide: number;
    numTall: number;

    sampleMode(): void { };

    _loadData(lines: string[]) {
        this.grid = lines.map(line => line.split(''));
        this.numWide = (this.grid[0].length-2)/6;
        this.numTall = (this.grid.length-2)/6;
        this.numGrids = this.numWide * this.numTall;
        this.log({numWide: this.numWide, numTall: this.numTall, numGrids: this.numGrids});
    }

    getOffsets(whichGrid: number): {ro: number, co: number} {
        let ro = Math.floor(whichGrid/this.numWide) * 6;
        let co = (whichGrid%this.numWide) * 6;
        return {ro, co};
    }

    calculatePower(whichGrid: number): number {
        let runes = this.getRunes(whichGrid);
        if (runes.indexOf('.') > -1) return 0;

        return runes.split('').reduce((sum,ch,i) => sum += (i+1)*(ch.charCodeAt(0)-'A'.charCodeAt(0)+1), 0);
    }

    getRunes(whichGrid: number): string {
        let result = '';
        if (whichGrid === undefined) return result;
        let grid = this.grid;
        let {ro, co} = this.getOffsets(whichGrid);
        for (let i=0; i<16; i++) {
            let r = 2+Math.floor(i/4);
            let c = 2+i%4;
            result += grid[ro+r][co+c];
        }
        return result;
    }

    getNeighbors(whichGrid: number): {aboveGrid, belowGrid, leftGrid, rightGrid} {
        let aboveGrid: number;
        let belowGrid: number;
        let leftGrid: number;
        let rightGrid: number;
        let row = Math.floor(whichGrid/this.numWide);
        let col = whichGrid%this.numWide;
        if (row > 0) aboveGrid = whichGrid - this.numWide;
        if (row < this.numTall-1) belowGrid = whichGrid + this.numWide;
        if (col > 0) leftGrid = whichGrid - 1;
        if (col < this.numWide-1) rightGrid = whichGrid + 1;

        return {aboveGrid, belowGrid, leftGrid, rightGrid};
    }

    outputGrid(whichGrid: number) {
        let grid = this.grid;
        let {ro, co} = this.getOffsets(whichGrid);
        for (let i=ro; i<ro+8; i++) {
            this.log(grid[i].slice(co, co+8).join(''));
        }
    }

    solve(whichGrid: number): boolean {
        let madeChange = false;
        let grid = this.grid;
        let {aboveGrid, belowGrid, leftGrid, rightGrid} = this.getNeighbors(whichGrid);
        //this.log({whichGrid, aboveGrid, belowGrid, leftGrid, rightGrid});
        //this.outputGrid(whichGrid);
        let {ro, co} = this.getOffsets(whichGrid);
        let runes = this.getRunes(whichGrid);

        if (runes.indexOf('.') !== -1) {
            // this one needs some work
            for (let i=0; i<16; i++) {
                let r = 2+Math.floor(i/4);
                let c = 2+i%4;
                let ch = grid[ro+r][co+c];
                if (ch === '.') {
                    let rArr = [grid[ro+r][co+0], grid[ro+r][co+1], grid[ro+r][co+6], grid[ro+r][co+7]];
                    let cArr = [grid[ro+0][co+c], grid[ro+1][co+c], grid[ro+6][co+c], grid[ro+7][co+c]];
                    let rSet = new Set<string>(rArr);
                    let cSet = new Set<string>(cArr);
                    // don't assign a value here if this square is invalid
                    if (rSet.size < 4 || cSet.size < 4) continue;
                    let ch = [...rSet].filter(c => cSet.has(c))[0];
                    if (ch !== '?' && ch !== undefined) {
                        grid[ro+r][co+c] = ch;
                        madeChange = true;
                        runes += ch;
                    } else {
                        // we need to see if we can figure out what goes here
                        let runeSet = new Set<string>(runes.split(''));
                        let rPossible = new Set<string>([...rSet].filter(c => !runeSet.has(c)));
                        let cPossible = new Set<string>([...cSet].filter(c => !runeSet.has(c)));
                        if (grid[ro+0][co+c] === '?') this.getRunes(aboveGrid).split('').forEach(c=>cPossible.delete(c));
                        if (grid[ro+7][co+c] === '?') this.getRunes(belowGrid).split('').forEach(c=>cPossible.delete(c));
                        if (grid[ro+r][co+0] === '?') this.getRunes(leftGrid).split('').forEach(c=>rPossible.delete(c));
                        if (grid[ro+r][co+7] === '?') this.getRunes(rightGrid).split('').forEach(c=>rPossible.delete(c));
                        //this.log(`${whichGrid}.(${r},${c}) [${ro+r},${co+c}] is unknown: ${[...rSet].join('')}/${[...cSet].join('')} ${runes} [${[...rPossible]}], [${[...cPossible]}]`);
                        //this.log(this.getRunes(aboveGrid));
                        //this.log(this.getRunes(belowGrid));
                        //this.log(this.getRunes(leftGrid));
                        //this.log(this.getRunes(rightGrid));

                        if (rPossible.size === 1 && !rPossible.has('?') && cArr.filter(c=>c==='?').length === 1) {
                            // we can set the column to the right value
                            ch = [...rPossible][0];
                            //this.log(`Set column to ${ch}`);
                            madeChange = true;
                            grid[ro+r][co+c] = ch;
                            if (grid[ro+0][co+c] === '?') grid[ro+0][co+c] = ch;
                            if (grid[ro+1][co+c] === '?') grid[ro+1][co+c] = ch;
                            if (grid[ro+6][co+c] === '?') grid[ro+6][co+c] = ch;
                            if (grid[ro+7][co+c] === '?') grid[ro+7][co+c] = ch;
                        }
                        else if (cPossible.size === 1 && !cPossible.has('?') && rArr.filter(c=>c==='?').length === 1) {
                            // we can set the row to the right value
                            ch = [...cPossible][0];
                            //this.log(`Set row to ${ch}`);
                            madeChange = true;
                            grid[ro+r][co+c] = ch;
                            if (grid[ro+r][co+0] === '?') grid[ro+r][co+0] = ch;
                            if (grid[ro+r][co+1] === '?') grid[ro+r][co+1] = ch;
                            if (grid[ro+r][co+6] === '?') grid[ro+r][co+6] = ch;
                            if (grid[ro+r][co+7] === '?') grid[ro+r][co+7] = ch;
                        }
                    }
                }
            }
        }

        return madeChange;
    }

    _runStep(): boolean {
        let madeChanges = false;
        this.log(`Step: ${this.stepNumber}`);
        this.log(this.grid.map(line => line.join('')).join('\n'));

        for (let i=0; i<this.numGrids; i++) {
            if (this.solve(i)) {
                madeChanges = true;
            }
        }

        if (!madeChanges) {
            // calculate total power here
            let totalPower = 0;
            for (let i=0; i<this.numGrids; i++) {
                let power = this.calculatePower(i);
                this.log(`Grid: ${i} = ${power}`);
                totalPower += power;
            }
            this.result = totalPower.toString();
        }
        return madeChanges;
    }
}