import { Puzzle } from '../../lib/Puzzle';

export class b202406 extends Puzzle {
    parentOf = new Map<string, string>();
    fruit: string[] = [];
    pathsByLength = new Map<number, string[][]>();
    sampleMode(): void { };

    _loadData(lines: string[]) {
        lines.forEach(line => {
            let [parent, children] = line.split(':');
            if (parent === 'ANT' || parent === 'BUG') return;
            let arr = children.split(',');
            for (let child of arr) {
                if (child === '@') this.fruit.push(parent);
                else this.parentOf.set(child, parent);
            }
        })
    }

    _runStep(): boolean {
        let parent = this.fruit.pop();
        let moreToDo = this.fruit.length > 0;

        let path: string[] = ['@'];

        while (parent) {
            path.push(parent);
            parent = this.parentOf.get(parent);
        }
        path.reverse();

        if (true || path[0] === 'RR') {
            let length = path.length;
            let arr = this.pathsByLength.get(length);
            if (!arr) {
                arr = [];
                this.pathsByLength.set(length, arr);
            }
            arr.push(path);
        }

        if (!moreToDo) {
            this.pathsByLength.forEach((paths, length) => {
                this.log(length);
                this.log(paths.map(path => path.join(',')).join('\n'))
                if (paths.length === 1) {
                    this.result = paths[0].map(node => node[0]).join('');
                }
            })
        }
        return moreToDo;
    }
}
