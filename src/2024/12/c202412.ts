import { Puzzle } from '../../lib/Puzzle.js';

interface Pair { x: number, y: number}

export class c202412 extends Puzzle {
    sum = 0;
    segment: Pair[] = [undefined, {x:0, y:2}, {x:0, y:1}, {x: 0, y: 0}]; 
    target: Pair[] = [];
    sampleMode(): void { };

    _loadData(lines: string[]) {
      lines.forEach(line => {
        const [x,y] = line.split(' ').map(Number);
        this.target.push({x, y});

      })

      console.log(this.segment.filter(s=>s).map(s => `S: ${s.x},${s.y}`));
      console.log(this.target.map(t => `T: ${t.x},${t.y}`));
    }

    _runStep(): boolean {
        const nextTarget = this.target.pop();
        let moreToDo = this.target.length>0;
        console.log(`\n\nFire at ${JSON.stringify(nextTarget)}`);

        let bestScore = Infinity;
        let hit = false;
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
          //
          // for part 3, there's a time component to this that changes the formula slightly
          // we now need to "intersect" with the line y=x at the highest possible position, 
          // using the lowest possible score
          // or, can we just start the meteor at the earliest possible position it could be hit
          // and iterate until we can hit it?
          // 
          // I like this method, seems easiest
          // we have to let the meteor get at least halfway to us (round up to get on the same "phase")
          // C---# <-- good 5-1=4 % 2 = 0 checks out, will intersect at x=3
          // 123456
          // C----# <-- bad, 6-1=5 %2 = 1, bad, but 5/2 = 2.5 -> 3, so move it down to 3 and iterate
        let y = nextTarget.y;
        let x = nextTarget.x;
        // decrease both by half of distance
        const half = Math.ceil(nextTarget.x/2);
        y -= half;
        x -= half;
        while (!hit) {
          // see if we can hit this location now
          for (let i=1; i<this.segment.length; i++) {
            const segment = this.segment[i];
            const dx = x-segment.x;
            const dy = y-segment.y;
            console.log(`To hit ${JSON.stringify(nextTarget)} (at ${x},${y}) from ${JSON.stringify(segment)}, dx=${dx}, dy=${dy}`);
            let power = 0;
            if (dx === dy) {
              // if dx === dy, we are hitting it on the way up
              console.log(`Hitting on the way up - continue needed?`)
              power = dx;
            } else if (dx < 2*dy) {
              // if dx < 2*dy+dy*power, we are hitting it at the flat top
              console.log(`Hitting on the flat - probably need a continue in here`)
              if (dx <= dy) {console.log(`continue`); continue; }
              power = dy;
            } else {
              // else, we are hitting it on the way down (that uses the standard power3 formula, check %3 and return /3)
              const power3 = x + y - segment.x - segment.y;
              console.log(`Standard hit on the way down, power3=${power3}`)
              if (power3 % 3) {console.log(`continue`); continue};
              power = power3 / 3;
            }
            hit = true;
            let score = (segment.y+1)*power;

            if (score < bestScore) {
              console.log(`New best score: ${score} using power=${power} from segment=${JSON.stringify(segment)}`);
              bestScore = score;
            }
          }
          y--;
          x--;
        }

        this.sum += bestScore;

        if (!moreToDo) {
            this.result = this.sum.toString();
        }
        return moreToDo;
    }
}