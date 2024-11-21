import { Puzzle } from '../../lib/Puzzle';

export class b202405 extends Puzzle {
    queues: number[][] = Array.from({length: 4}, _ => []);
    shouts: number[] = [];
    sampleMode(): void { };

    _loadData(lines: string[]) {
        this.lines.map(line => line.split(' ').map(Number)).forEach(line => line.forEach((v, i) => this.queues[i].push(v)));
    }

    output(msg=undefined) {
        if (msg) this.log(msg);
        this.log(this.queues.map(line => line.join(' ')).join('\n'));
    }

    _runStep(): boolean {
        //this.output(`START: ROUND ${this.stepNumber}`);
        let ndx = (this.stepNumber-1)%this.queues.length;
        let num = this.queues[ndx].shift();
        let queue = this.queues[(ndx+1)%this.queues.length];

        let mod = (num-1) % (2*queue.length);
        let end = Math.min(mod, 2*queue.length-1-mod);
        // we may be on the way back so we need to actually insert 1 to the right
        if (mod > queue.length-1) end++;

        //this.log(`${num} will end up at position ${end}`);
        queue.splice(end, 0, num);

        let shout = Number(this.queues.map(queue => queue[0]).join(''));
        let numShouts = (this.shouts[shout] ?? 0) + 1;
        this.shouts[shout] = numShouts
        //this.output(`STEP: ${this.stepNumber} - NUM=${num}, END=${end}, ${shout}`);
        //this.log(`STEP: ${this.stepNumber} - NUM=${num}, END=${end}, ${shout} - ${numShouts}`);
        let moreToDo = numShouts !== 2024;
        if (!moreToDo) {
            this.result = (shout * this.stepNumber).toString();
        }
        return moreToDo;
    }
}