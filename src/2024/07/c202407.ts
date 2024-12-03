import { Puzzle } from '../../lib/Puzzle';

interface Result {name: string, score: number};

export class c202407 extends Puzzle {
    track: string[] = [];
    //firstLoopScore: number;
    scoreToBeat: number;
    //trialMode = false;

    sampleMode(): void { };

    score(rest: string): number {
        let ops = rest.split('');
        let s = 10;
        let score = 0;
        let lastScore = 0;
        let lastDiff = 0;
        let lastS = 10;
        let cycle = this.track.length * rest.length;

        let sGainedPerCycle = 0;
        let scoreGainedPerCycle = 0;
        let scoreGainGainedPerCycle = 0;
        let d2 = 0;

        //this.log({cycle});
        for (let i=0; i<2024*this.track.length; i++) {
            let opInd = i%ops.length;
            let trackInd = i%this.track.length;
            if (i > 0 && i % cycle === 0) {
                //this.log({i, s, sDiff: s-lastS, diff: score-lastScore, diff2: score-lastScore - lastDiff});
                let lap = i/cycle;
                switch (lap) {
                    case 1:
                        sGainedPerCycle = s-lastS;
                        scoreGainedPerCycle = score - lastScore;
                        break;
                    case 2: 
                        scoreGainGainedPerCycle = score - lastScore - scoreGainedPerCycle;
                        scoreGainedPerCycle = score - lastScore;
                        //this.log({sGainedPerCycle, scoreGainedPerCycle, scoreGainGainedPerCycle});
                        // once we get to the 2nd "repetition", we can fairly easily skip ahead to the end
                        // (probably could have done this after the first repetition, but I didn't want to think about it that long)
                        // additionally, this could be done as a single statement instead of a while loop
                        while (i+cycle < 2024*this.track.length) {
                            i += cycle;
                            s += sGainedPerCycle;
                            scoreGainedPerCycle += scoreGainGainedPerCycle;
                            score += scoreGainedPerCycle;
                            //this.log({i, s, sDiff: s-lastS, diff: score-lastScore, diff2: score-lastScore - lastDiff});
                        }
                        break;
                }
                lastS = s;
                lastDiff = score-lastScore;
                lastScore = score;
            }

            /*
            if (opInd === 0 && trackInd === 0) {
                this.log({i, s, sDiff: s-lastS, diff: score-lastScore, diff2: score-lastScore - lastDiff});
                lastS = s;
                lastDiff = score-lastScore;
                lastScore = score;
            }
            
            if (opInd === 0 && trackInd === 0 && score > 0 && this.firstLoopScore === undefined) {
                this.firstLoopScore = score;
            }
            if (opInd === 0 && trackInd === 0 && score > 0 && this.trialMode) {
                if (score < this.firstLoopScore) return 0;
                else return score;
            }
            */
            let op = ops[opInd];
            let delta = 0;
            switch (op) {
                case '+': delta = 1; break;
                case '-': delta = -1; break;
            }
            op = this.track[trackInd];
            switch (op) {
                case '+': delta = 1; break;
                case '-': delta = -1; break;
            }
            s = Math.max(0, s + delta);
            score += s;
            //this.log({name, i, score, s});
            // if (i % this.track.length === 0) {
            //     this.log(`lap: ${i/this.track.length} score=${score}`);
            // }
        }
        // this.log(this.track.length);
        // this.log(2024*this.track.length);
        return score;
    }

    simulate(line: string): Result {
        let [name, rest] = line.replaceAll(',','').split(':');
        let score = this.score(rest);

        this.log({name, score});
        return {name, score};
    }

    _loadData(lines: string[]) {
        let track = 
`                                                                               
 S+= +=-== +=++=     =+=+=--=    =-= ++=     +=-  =+=++=-+==+ =++=-=-=-- 
 - + +   + =   =     =      =   == = - -     - =  =         =-=        - 
 = + + +-- =-= ==-==-= --++ +  == == = +     - =  =    ==++=    =++=-=++ 
 + + + =     +         =  + + == == ++ =     = =  ==   =   = =++=         
 = = + + +== +==     =++ == =+=  =  +  +==-=++ =   =++ --= + =             
 + ==- = + =   = =+= =   =       ++--          +     =   = = =--= ==++== 
 =     ==- ==+-- = = = ++= +=--      ==+ ==--= +--+=-= ==- ==   =+=    = 
 -               = = = =   +  +  ==+ = = +   =        ++    =          - 
 -               = + + =   +  -  = + = = +   =        +     =          - 
 --==++++==+=+++-= =-= =-+-=  =+-= =-= =--   +=++=+++==     -=+=++==+++- 
                                                                            
 `.split('\n').map(line => line.split(''));
        this.track = [];
        let _r=1, _c=1;
        let r=1, c=2;
        let ch = track[r][c];
        while (ch !== 'S') {
            let nextR: number, nextC: number;
            this.track.push(ch);
            [[-1,0],[0,-1],[0,1],[1,0]].forEach(([rd,cd]) => {
                let tr = r+rd;
                let tc = c+cd;
                if ((tr !== _r || tc !== _c) && track[tr][tc] !== ' ') {
                    nextR = tr;
                    nextC = tc;
                    ch = track[tr][tc];
                }
             });
            [r, _r] = [nextR, r];
            [c, _c] = [nextC, c];
        }
        this.track.push(ch);
    }

    _runStep(): boolean {
        let moreToDo = this.stepNumber < this.lines.length;
        this.scoreToBeat = this.simulate(this.lines[this.stepNumber-1]).score;
        if (!moreToDo) {
            let count = 0;

            //this.trialMode = true;

            // I did this before I realized the "oops" below.  Probably could have solved this better than counting, converting to a base-3 representation
            // and then substituting =/-/+ characters for 0/1/2
            for (let i=0; i<3**11; i++) {
                let str = i.toString(3).padStart(11, '0');
                // oops, missed this one for a LONG time - he very clearly specifies there should be 3 ='s and 3 -'s...
                if ([...str.matchAll(/0/g)].length !== 3 || [...str.matchAll(/1/g)].length !== 3) continue;
                str = str.replaceAll('0', '=').replaceAll('1','-').replaceAll('2','+');
                if (i%1000 === 0) this.log({i,str, count});
                let score = this.score(str);
                if (score > this.scoreToBeat) count++;
                //this.log({i,str,score,count});
            }

            this.result = count.toString();
        }
        return moreToDo;
    }
}