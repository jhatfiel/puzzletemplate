import { Puzzle } from '../../lib/Puzzle.js';

export class c202409 extends Puzzle {
    stamps = [1, 3, 5, 10, 15, 16, 20, 24, 25, 30, 37, 38, 49, 50, 74, 75, 100, 101];
    amounts: number[];
    max: number;
    matrix: number[][];
    sum = 0;
    sampleMode(): void { };

    _loadData(lines: string[]) {
        this.amounts = lines.map(Number);
        this.max = Math.max(...this.amounts);

        // calculate matrix
        this.matrix = Array.from({length: this.stamps.length+1}, _ => Array(this.max+1).fill(Infinity));

        let m = this.matrix;
        this.stamps.forEach((value, index) => {
            for (let r=1; r<this.max+1; r++) {
                if      (value === r) m[index+1][r] = 1;
                else if (value > r)   m[index+1][r] = m[index][r];
                else                  m[index+1][r] = Math.min(m[index][r], 1 + m[index+1][r - value]);
            }
        });
        // for (let i=0; i<this.stamps.length; i++) {
        //     this.log(m[i].join(','));
        // }
    }

    _runStep(): boolean {
        let moreToDo = this.stepNumber < this.lines.length;
        let n = this.amounts[this.stepNumber-1];
        let m = Math.floor(n/2);

        let bestCombo = Infinity;
        while (n - m*2 <= 100) {
            let num1 = this.matrix.at(-1)[m];
            let num2 = this.matrix.at(-1)[n-m];
            if (num1 + num2 < bestCombo) {
                this.log(`Better! ${m}=${num1} and ${n-m}=${num2}`);
                bestCombo = num1 + num2;
            }
            m--;
        }

        this.log(`${n} made using ${bestCombo} coins`);
        this.sum += bestCombo;
        if (!moreToDo) {
            this.result = this.sum.toString();
            // 151616 length & first is correct
        }
        return moreToDo;
    }
}