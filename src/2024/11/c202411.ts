import { Puzzle } from '../../lib/Puzzle.js';

interface NumObj { [key: string]: number };

export class c202411 extends Puzzle {
    batches: NumObj[] = [];
    production = new Map<string, NumObj>();
    sampleMode(): void { };

    _loadData(lines: string[]) {
        let lineSplit = lines.map(line=>line.split(':'));
        lineSplit.forEach(([a, str]) => {
            this.batches.push({[a]: 1});

            let obj = {};
            str.split(',').forEach(c => {
                obj[c] = (obj[c]??0)+1;
            });
            this.production.set(a, obj);
        });

    }

    _runStep(): boolean {
        let moreToDo = this.stepNumber < 20;
        for (let i=0; i<this.batches.length; i++) {
            let obj: NumObj = {};
            for (let [current, count] of Object.entries(this.batches[i])) {
                for (let [produces, num] of Object.entries(this.production.get(current))) {
                    obj[produces] = (obj[produces]??0) + num*count;
                }
            }
            this.batches[i] = obj;
        }
        let lengths = this.batches.map(batch=>Object.values(batch).reduce((sum, num)=>sum+num,0));
        //this.log(`${this.stepNumber} ${lengths.join(',')}`);

        if (!moreToDo) {
            this.result = (Math.max(...lengths) - Math.min(...lengths)).toString();
        }
        return moreToDo;
    }
}