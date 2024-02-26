import { readFileSync, appendFileSync } from "fs";
import { performance } from "perf_hooks";

const classname = process.argv[2];
let id = classname.substring(1);

const dir = `${id}`;
const jsfile = `./${dir}/${classname}.js`;
const datafile = `./data/${dir}/${process.argv[3]}`;
const benchfile = `./src/${dir}/bench.txt`;
console.debug(`@@@@@@@@@@ DATAFILE: ${datafile} @@@@@@@@@@`); 
import(jsfile).then(clazz => {
    performance.mark("start");
    let puzzle = new clazz[classname](process.argv[3]);

    puzzle.loadData(readFileSync(datafile, 'utf8').toString().split(/\r?\n/));

    while (puzzle.runStep()) { }

    console.log(`Final result: ${puzzle.result}`);
    appendFileSync(benchfile, `[${(process.env['HOSTNAME'] ?? process.env['COMPUTERNAME'] ?? 'UNKNOWN').padStart(20, ' ').substring(0, 20)}] / ${(new Date()).toISOString()}: [${performance.measure(classname, "start").duration.toFixed(2).toString().padStart(10, ' ')}ms] Ran ${classname} resulting in ${puzzle.result} [${datafile}]\n`);
})
