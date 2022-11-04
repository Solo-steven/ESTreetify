import { Tokenizer } from "./tokenizer";
import { performance } from "perf_hooks";

const code = `
    const code = "string";
    console.log(code);
`;

const tokenizer = new Tokenizer(code);

let count = 0;
const start = performance.now();
while(1) {
    if(count >= 1000) {
        break;
    }
    count ++;
    const t = tokenizer.getToken();
    if(t) {
        console.log(t);
    }else {
        break;
    }
}
console.log(performance.now() - start);