import { PriorityHeap } from "./PriorityHeap.js";

export class Dijkstra {
  constructor(private getNeighbors: (node: string) => Map<string, number>) {}

  // keep track of the best way to get to each node based on where we are starting from
  // from: to: parent
  parent = new Map<string, Map<string, Set<string>>>();

  // from: to: [shortest path1, shortest path2, ...] where paths are [n1, n2, ...]
  paths = new Map<string, Map<string, Array<Array<string>>>>();

  distanceTo = new Map<string, Map<string, number>>();

  compute(from: string, shouldStop: (node: string, distance: number) => boolean = _ => false): Dijkstra {
    let parent = new Map<string, Set<string>>();
    this.parent.set(from, parent);
    let distanceTo = new Map<string, number>();
    this.distanceTo.set(from, distanceTo);

    let unvisited = new PriorityHeap<{node: string, distance: number, counter: number}>((a, b) => b.distance === a.distance?b.counter<a.counter:b.distance<a.distance);
    let counter = 0;
    distanceTo.set(from, 0);
    unvisited.enqueue({node: from, distance: 0, counter: counter++});

    while (unvisited.size()) {
      // get the closest unvisited node
      let {node: nearestUnvisited, distance: nearestDistance} = unvisited.dequeue();
      //console.debug(`Working with ${nearestUnvisited}[${nearestDistance}] (${unvisited.size()} unvisited)`);

      if (shouldStop(nearestUnvisited, nearestDistance)) break;

      // set the distance for all its neighbors
      this.getNeighbors(nearestUnvisited)?.forEach((d, n) => {
        let currentDistance = distanceTo.get(n);
        let newDistance = nearestDistance + d;
        //console.debug(`- We can go from ${nearestUnvisited} to ${n}, newDistance=${newDistance} vs currentDistance=${currentDistance}`);
        if (currentDistance === undefined) {
          //console.debug(`- First time finding ${n}`);
          distanceTo.set(n, newDistance);
          unvisited.enqueue({node: n, distance: newDistance, counter: counter++});
          parent.set(n, new Set([nearestUnvisited]));
        } else if (newDistance < currentDistance) {
          //console.debug(`- BETTER!!!!`);
          distanceTo.set(n, newDistance);
          unvisited.reorder(obj => {
            if (obj.node === n) { obj.distance = newDistance; return true; }
            return false;
          });
          parent.set(n, new Set([nearestUnvisited]));
        } else if (newDistance === currentDistance) {
          //console.debug(`- tied`);
          parent.get(n).add(nearestUnvisited);
        }
      })
    }
    return this;
  }

  pathTo(from: string, to: string, keepAllPaths = true): Array<Array<string>> {
    if (!this.parent.has(from) || !this.parent.get(from).has(to)) this.compute(from, node => node===to);
    let parent = this.parent.get(from);
    let nearestUnvisitedPaths = [[to]];
    let parentSearch = nearestUnvisitedPaths.map(p => parent.get(p.at(-1))) // get the parents of the latest step on each path
    while (parentSearch?.some(parentToExpand => parentToExpand !== undefined)) {
      parentSearch.forEach((parentToExpand, ind) => {
        if (parentToExpand?.size) {
          if (keepAllPaths) {
            Array.from(parentToExpand).slice(1).forEach(parent => {
              let newPath = [...nearestUnvisitedPaths[ind], parent];
              nearestUnvisitedPaths.push(newPath);
            })
          }
          nearestUnvisitedPaths[ind].push(Array.from(parentToExpand)[0]);
        }
      })
      parentSearch = nearestUnvisitedPaths.map(p => parent.get(p.at(-1))); // get the parents of the latest step on each path
    }
    return nearestUnvisitedPaths.map(p => p.reverse());
  }

  pathToAny(from: string, toFunc: (node: string) => boolean, keepAllPaths = true): Map<string, Array<Array<string>>> {
    if (!this.parent.has(from)) this.compute(from, toFunc);
    let pathCache = this.paths.get(from);
    if (pathCache === undefined) {
      pathCache = new Map<string, Array<Array<string>>>();
    }
    let parent = this.parent.get(from);
    parent.forEach((parents, to) => {
      if (toFunc(to)) {
        pathCache.set(to, this.pathTo(from, to, keepAllPaths));
      }
    });
    return pathCache
  }
}