import { Puzzle } from '../../lib/Puzzle';

export class b202402 extends Puzzle {
    sampleMode(): void { };

    _loadData(lines: string[]) { }

    _runStep(): boolean {
        let moreToDo = false;
        let count = 0;
        let words = this.lines[0].split(':')[1].split(',');
        words.forEach(word => words.push(word.split('').reverse().join('')));

        for (let line of this.lines.slice(2)) {
            let indices = new Set<number>();
            //console.log(`line: ${line}`);
            for (let word of words) {
                let re = new RegExp(word, 'g');
                let m;
                while ((m = re.exec(line)) !== null) {
                    for (let i=0; i<word.length; i++) {
                        indices.add(m.index+i);
                    }
                    re.lastIndex = m.index+1;
                }
            }
            //console.log([...indices].sort());
            //console.log(indices.size);
            count += indices.size;
        }

        this.result = count.toString();
        return moreToDo;
    }
}