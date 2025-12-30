import { Dijkstra } from '../../lib/Dijkstra.js';
import { Grid, Pair, pair2Str, str2Pair } from '../../lib/Grid.js';
import { Puzzle } from '../../lib/Puzzle.js';

export class c202413 extends Puzzle {
  grid: number[][];
  start: Pair;
  end: Pair;
  pos: Pair;
  sampleMode(): void { };

  _loadData(lines: string[]) {
    this.grid = lines.map((line, row) => line.split('').map((ch, col)=>{
      let height = 0;
      if (ch === 'S') {
        this.start = {row, col};
      } else if (ch === 'E') {
        this.end = {row, col};
      } else if (ch === '#') {
        height = -1;
      } else {
        height = Number(ch);
      }
      if (Number.isNaN(height) || !Number.isSafeInteger(height)) throw new Error(`Ended up with invalid height: ${height} from ${ch}`);
      return height;
    }));

    if (!this.start) throw new Error(`start not found!`)
    if (!this.end) throw new Error(`end not found!`)
    this.pos = this.start;
  }

  _runStep(): boolean {
    let moreToDo = false;
    const startStr = pair2Str(this.start);
    const endStr = pair2Str(this.end);
    console.log(`[${this.stepNumber.toString().padStart(3)}] at ${startStr}, going to ${endStr}`);
    console.log(this.grid.map(line=>line.map(n=>n===-1?' ':n.toString()).join('')).join('\n'))
    const grid = new Grid(this.grid.length, this.grid[0].length, (p: Pair) => this.grid[p.row][p.col]>=0);
    const dij = new Dijkstra((node: string) => {
      const {row,col} = str2Pair(node);
      const height = this.grid[row][col];
      return new Map<string, number>(grid.getOrthogonal({row,col}).map(({row,col}) => [
        pair2Str({row,col}), // key, next line is value (time required to move from a node to its neighbor)
        1 + Math.min(Math.abs(this.grid[row][col]-height), 10-Math.abs(this.grid[row][col]-height))
      ]));
    });

    const paths = dij.pathToAny(endStr, (node: string) => {const pos = str2Pair(node); return pos.row === 0 || pos.col === 0 || pos.row === this.grid.length-1 || pos.col === this.grid[0].length-1});
    let distanceMap = dij.distanceTo.get(endStr);
    let bestDistance = Infinity;
    console.log(JSON.stringify([...paths]));
    for (const finalNode of [...paths.keys()]) {
      let distance = distanceMap.get(finalNode);
      console.log(`final ${finalNode}: distance=${distance}`)
      if (distance < bestDistance) {
        bestDistance = distance;
      }
    }

    if (!moreToDo) {
      this.result = bestDistance.toString();
    }
    return moreToDo;
  }
}