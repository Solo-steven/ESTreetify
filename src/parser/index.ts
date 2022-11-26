import {Tokenizer} from "@/src/tokenizer";
class Parser  {
    private tokenizer: Tokenizer;
    constructor(code: string) {
        this.tokenizer = new Tokenizer(code);
    }
    parse() {
        // Entry Function
        return this.parseProgram();
        
    }
    parseProgram() {
        // Parse Directive and ProgramBody
        const body = this.parseProgramBody();
    }
    parseProgramBody() {
        // Main Loop for parse Statement, Delcaration and Expression.   
    }
    parseExpression() {

    }
    parseMaybeAssignmentExpression() {
        
    }
    parseConditionalAssignmentExpression() {

    }
    parsePrimaryExpression() {

    }
    parseBinaryExpression() {
        
    }
}