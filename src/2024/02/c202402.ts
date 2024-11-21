import { Puzzle } from '../../lib/Puzzle';

export class c202402 extends Puzzle {
    sampleMode(): void { };

    _loadData(lines: string[]) { }

    _runStep(): boolean {
        let moreToDo = false;
        let words = this.lines[0].split(':')[1].split(',');
        words.forEach(word => words.push(word.split('').reverse().join('')));

        let grid = this.lines.slice(2).map(line => line.split(''));
        let found = new Set<string>();
        let largestWord = words.map(word => word.length).reduce((max, l) => Math.max(max, l), 0);

        for (let x=0; x<grid[0].length; x++) {
            for (let y=0; y<grid.length; y++) {
                // build word from here horizonatally, then vertically - test if it matches, if so, add positions to found set
                let _x = x;
                let _y = y;
                let hWord = '';
                let vWord = '';
                for (let i=0; i<largestWord; i++) {
                    hWord += grid[y][_x];
                    if (_y < grid.length) vWord += grid[_y][x];
                    _x++; if (_x === grid[0].length) _x = 0;
                    _y++;
                }
                for (let word of words) {
                    if (hWord.startsWith(word)) {
                        //console.log({x, y, word, hWord});
                        for (let i=0; i<word.length; i++) {
                            found.add(`${(x+i)%grid[0].length},${y}`);
                        }
                    }
                    if (vWord.startsWith(word)) {
                        //console.log({x, y, word, vWord});
                        for (let i=0; i<word.length; i++) {
                            found.add(`${x},${(y+i)}`);
                        }
                    }
                }
            }
        }
        //console.log(found);

        this.result = found.size.toString();
        return moreToDo;
    }
}