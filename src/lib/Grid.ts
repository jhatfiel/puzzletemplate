export interface Pair {
  row: number
  col: number
}
export const pair2Str = (p: Pair) => `${p.row},${p.col}`;
export const str2Pair = (s: string) => { const [row, col] = s.split(',').map(Number); return {row,col}};
export interface Neighbor extends Pair {
  dir: string
}

export class Grid {
  constructor(private height: number, private width: number, private canVisit: (p: Pair) => boolean = _ => true, private canWrap = false) {}
  getOrthogonal({row: r, col: c}: Pair): Neighbor[] {
    const potentialNeighbors: Neighbor[] = [];
    let row = r-1;
    let col = c;
    let dir = 'N';
    if (row < 0) { if (this.canWrap) potentialNeighbors.push({row: this.height-1, col, dir}); }
    else potentialNeighbors.push({row, col, dir});

    row = r;
    col = c+1;
    dir = 'E';
    if (col >= this.width) { if (this.canWrap) potentialNeighbors.push({row, col: 0, dir}); }
    else potentialNeighbors.push({row, col, dir});

    row = r+1;
    col = c;
    dir = 'S';
    if (row >= this.height) { if (this.canWrap) potentialNeighbors.push({row: 0, col, dir}); }
    else potentialNeighbors.push({row, col, dir});

    row = r;
    col = c-1;
    dir = 'W';
    if (col < 0) { if (this.canWrap) potentialNeighbors.push({row, col: this.width-1, dir}); }
    else potentialNeighbors.push({row, col, dir});

    return potentialNeighbors.filter(n => this.canVisit(n));
  }
}