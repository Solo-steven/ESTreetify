import { Parser } from "@/src/parser";
console.log(" ********** You Should Write Test !!! ************");

const code = `
    let a = 10;
    ley b = 100;
    a + b + 10 * b / 10;
`;

const parser = new Parser(code);

console.log(parser.parse());