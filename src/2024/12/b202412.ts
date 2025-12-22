import { Puzzle } from '../../lib/Puzzle.js';

interface Pair { x: number, y: number}

export class b202412 extends Puzzle {
    sum = 0;
    segment: Pair[] = []; 
    target: {pos: Pair, strength: number}[] = [];
    sampleMode(): void { };

    _loadData(lines: string[]) {
      let y = lines.length-1;
      lines.forEach(line => {
        const match = line.match(/([A-C])/);
        if (match) this.segment[y] = {x: match.index, y};
        let x = line.search(/[TH]/)
        while (x !== -1) {
          this.target.push({pos: {x, y}, strength: line[x] === 'H'?2:1});
          const pos = line.slice(x+1).search(/[TH]/);
          if (pos === -1) break;
          x = x+1+pos;
        }

        y--;
      })

      console.log(this.segment.filter(s=>s).map(s => `S: ${s.x},${s.y}`));
      console.log(this.target.map(t => `T: ${t.pos.x},${t.pos.y}`)); // will always be in order, top-left first (lowest x, highest y)
    }

    _runStep(): boolean {
        const nextTarget = this.target.pop();
        let moreToDo = this.target.length>0;
        console.log(`Fire at $${JSON.stringify(nextTarget)}`);

        let bestScore = 0;
        let bestSegmentIndex = 0;
        for (let i=1; i<this.segment.length; i++) {
          // if this segment can hit the target, see if it's a good score
          // has to have power of at least 1...
          /*
power=1
 /-
C..\  x+3
B
A
power=2
  /--
 /...\
C.....\ x+6
B
A
power=3
   /---
  /....\
 /......\
C........\ x+9
B
A
          */
          // fired at power p, projectile will cross segments y value at segment.x + 3p
          // so when compared to the y value, we would change the x value by +(s.y-t.y)
          // so.....
          // t.x = s.x + 3p + (s.y-t.y) lets us solve for p, since we know all other values
          // p = (t.x - s.x - s.y + t.y) / 3 (must be div 3)
          const segment = this.segment[i];
          let power3 = nextTarget.pos.x + nextTarget.pos.y - segment.x - segment.y;
          console.log(`To hit ${JSON.stringify(nextTarget)} from ${JSON.stringify(segment)} would take power=${power3}/3`);
          if (power3 % 3) continue;
          let power = power3/3;
          let score = nextTarget.strength*i*power;

          if (score > bestScore) {
            console.log(`New best score: ${score} using power=${power} from segment=${JSON.stringify(segment)}`);
            bestScore = score;
            bestSegmentIndex = i;
          }
        }

        this.sum += bestScore;

        if (!moreToDo) {
            this.result = this.sum.toString();
        }
        return moreToDo;
    }
}