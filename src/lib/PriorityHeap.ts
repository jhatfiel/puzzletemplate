export class PriorityHeap<T=number> {
    constructor(private shouldPrecede: (a: T, b: T) => boolean = (a: T, b: T) => a <= b ) { }
    values = new Array<T>(10000); // decent sized heap to reduce memory thrash
    nextIdx = 0;

    size(): number { return this.nextIdx; }

    truncate(at: number) {
        if (this.nextIdx >= at) {
            this.nextIdx = at;
        }
    }

    enqueue(e: T): number {
        this.values[this.nextIdx] = e;
        this.nextIdx++;
        return this.bubbleUp();
    }

    bubbleUp(idx = this.nextIdx-1): number {
        const e = this.values[idx];
        while (idx > 0) {
            let parentIdx = Math.floor((idx-1)/2);
            let parent = this.values[parentIdx];
            if (this.shouldPrecede(e, parent)) break;
            this.values[parentIdx] = e;
            this.values[idx] = parent;
            idx = parentIdx;
        }
        return idx;
    }

    dequeue(): T {
        const max = this.values[0];
        const end = this.values[this.nextIdx-1];
        this.nextIdx = Math.max(0, this.nextIdx-1);
        
        if (this.nextIdx >= 0) {
            this.values[0] = end;
            this.sinkDown();
        }
        return max;
    }

    sinkDown(idx = 0) {
        const length = this.nextIdx;
        const e = this.values[0];
        while (true) {
            let leftChildIdx = 2*idx + 1;
            let rightChildIdx = 2*idx + 2;
            let leftChild: T, rightChild: T;
            let swap: number = null;

            if (leftChildIdx < length) {
                leftChild = this.values[leftChildIdx];
                if (this.shouldPrecede(e, leftChild)) swap = leftChildIdx;
            }
            if (rightChildIdx < length) {
                rightChild = this.values[rightChildIdx];
                if ((swap === null && this.shouldPrecede(e, rightChild)) ||
                    (swap !== null && this.shouldPrecede(leftChild, rightChild))) swap = rightChildIdx;
            }

            if (swap === null) break;
            this.values[idx] = this.values[swap];
            this.values[swap] = e;
            idx = swap;
        }
        return idx;
    }

    reorder(findObj: (o: T) => boolean) {
        let idx = this.values.findIndex(findObj);
        if (idx !== -1) this.bubbleUp(this.sinkDown(idx));
    }

    debugArray() {
        //console.debug(this.values);
        let str = '';
        let ind = 0;
        let pow = 0;
        while (ind < this.nextIdx) {
            str += '[' + this.values.slice(ind, ind+Math.pow(2, pow)).join(',') + '] / ';
            ind += Math.pow(2, pow);
            pow++;
        }
        console.debug(str);
    }
}