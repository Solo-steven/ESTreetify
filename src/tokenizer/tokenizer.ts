import {clonePosition, createLocation} from "@/src/utils/location";
import type {Context} from "./context";
import {createContext, cloneContext} from "./context";
import type {Token, TokenFactory} from "./tokenType";
import {TokenType,TokenFactories} from "./tokenType";

import {ReservedWords, UTF8Def} from "../utils/charcodes";
import {composeCharsArray} from "../utils/charcodes";
/**
 * Tokenizer Class is used for tokenize code string intpo tokens.
 * expose three method as public for compostion or inherit
 * - get: like string peek
 * - lookhead: peek next token
 * - match: like string is
 * - next: like string eat
 * @property {string} code - code string
 * @property {Context} context - current point and current position
 */
export class Tokenizer {
    private code: string;
    private context: Context;
    private startTokenContext: Context | null;
    private tokenStream: Array<Token>;
    constructor(code: string) {
        this.code = code;
        this.context = createContext();
        this.startTokenContext  = null;
        this.tokenStream = [];
    }
    /**
     * peek function is used for peek string start at current pointer.
     * Just like code.slice(currentPoint, currentPoint + n).
     *  1. min value of n is 1, when n is 1, peek function would return current char (code[currentPoint]).
     *  2. when current pointer reach eof, it would return empty string.
     *  3. when current point + n exccess length of code. it would return code.slice(currentPoint);
     * @param {number} n - number of char start from current point. min of n is 1. 
     * @returns {string} - the string that you want to peek.
     */
    private peek(n: number = 1): string {
        if(n < 1) {
            throw new Error(`[Error]: param 'n' at peek function need to >= 1. but now get ${n}.`)
        }
        return this.code.slice(this.context.pointer, this.context.pointer + n);
    }
    /**
     * eat function is used to move current point forward n char and return the string.
     * Just like return peek(n), then current point = current point + n; so default is 0.
     * @param {number} n 
     * @returns 
     */
    private eat(n: number = 1): string {
        if(n < 1) {
            throw new Error(`[Error]: param 'n' at eat function need to >= 1. but now get ${n}.`)
        }
        const char = this.peek(n);
        for(const ch of char) {
            if(ch === UTF8Def.newLineChars[0]) {
                this.context.position.row ++;
                this.context.position.col = 0;
            } else {
                this.context.position.col ++;
            }
            this.context.pointer ++;
        }
        return char;
    }
    /**
     * eof function is used to show is current point is reach EOF
     * @returns {boolean} - is meet EOF
     */
    private eof(): boolean {
        return this.peek() === "";
    }
    /**
     * is function is used to show is next code string is match to string that 
     * pass by param. is function just a directive function of 'peek() === value'
     * @param {string | Array<string>} char - string values thay we want to match.
     * @returns {boolean} - is match one of given value.
     */
    private is(char: string | Array<string>): boolean {
        if(typeof(char) === "string") {
            char = [char];
        }
        for(const value of char) {
            if(value.length === 0) {
                throw new Error(`[Error]: is function can't access empty string.`);
            }
            if(value === this.peek(value.length)) {
                return true;
            }
        }
        return false;
    }
    /**
     *  startToken function call when start read a token, it would 
     *  fork current context to startTokenContext Property.
     * @return {void} - no return value
     */
    protected startToken(): void {
        this.startTokenContext = cloneContext(this.context);
    }
    /**
     * finishToken function is a HOF what create a token by passing a TokenFactory function
     * it would pass the context that store at 'startTokenContext' and current Context to 
     * TokenFactoty function.
     * @param {TokenFactory} callback - function of TokenFactory
     * @param {T} value - type of value that pass to TokenFactory
     * @returns {Token<T>} - token created by TokenFactory
     */
    protected finishToken<T>(
        callback: TokenFactory<T>,
        value: T
    ): Token<T> {
        const location = createLocation();
        location.start = clonePosition(this.startTokenContext.position);
        location.end = clonePosition(this.context.position);
        const start = this.startTokenContext.pointer;
        const end = this.context.pointer;
        return callback(value, start, end, location, this.code.slice(start, end));
    }
    /**
     * sunStateMachineError is used for return a format error to developer that Sub State Machine
     * expect start chars that is not show in current code string.
     * @param {string} name - name of sub state machine
     * @param {string} char - chars that sub state machine is expected
     * @returns {Error} - a error object
     */
    private subStateMachineError(name: string, char: string): Error {
        return new Error(`[Error]: ${name} state machine should only be called when currnet position is ${char}. `);
    }
    /**
     * lexicalError is used for tokenizer unexecpt char happended. ex: string start with " can't find end ""
     * @param {string} content - error message
     * @returns {Error} - a error object
     */
    private lexicalError(content: string): Error {
        return new Error(`[Error]: Lexical Error, ${content}, position is ${this.context.position.row}, ${this.context.position.col}`);
    }
    /**
     * 
     * @returns {void}
     */
    private skipSpace(): void {
        while(!this.eof()) {
            if(!this.is(
                composeCharsArray(UTF8Def.newLineChars, UTF8Def.whiteSpaceChars)
            )) {
                return;
            }
            this.eat();
            continue;
        }
    }
    /**
     * Main Logic of Tokenizer 
     * @returns {Token}
     */
    private tokenize(): Token {
        this.skipSpace();
        const char = this.peek();
        this.startToken();
        switch(char) {
            case "":
                return this.finishToken(TokenFactories.eof, "eof");
            /** ==========================================
             *              Punctuators
             *  ==========================================
             */
            case "{":
                this.eat();
                return this.finishToken(TokenFactories.bracesLeft, "{");
            case "}":
                this.eat();
                return this.finishToken(TokenFactories.bracesRight, "}");
            case "[":
                this.eat();
                return this.finishToken(TokenFactories.bracketLeft, "[");
            case "]":
                this.eat();
                return this.finishToken(TokenFactories.bracketRight,"]");
            case "(":
                this.eat();
                return this.finishToken(TokenFactories.parenthesesLeft, "(");
            case ")":
                this.eat();
                return this.finishToken(TokenFactories.parenthesesRight, ")");
            case ":":
                this.eat();
                return this.finishToken(TokenFactories.colon, ":");
            case ";":
                this.eat();
                return this.finishToken(TokenFactories.semi, ";");
            /** ==========================================
             *                Operators
             *  ==========================================
             */
            case "+": {
                // '+', '+=', '++' 
                return this.readPlusStart();
            }
            case "-": {
                // '-', '-=', '--'
                return this.readMinusStart();
            }
            case "*": {
                // '*' , '**', '*=', '**=', 
                return this.readMultiplyStart();
            }
            case "%": {
                // '%', '%='
                return this.readModStart();
            }
            case "/": {
                // '/' '// comment' '/* comments */'
                return this.readSlashStart();
            }
            case ">": {
                // '>', '>>', '>>>' '>=', ">>=",  ">>>="
                return this.readGTStart();
            }
            case "<": {
                // '<', '<<', '<=', '<<='
                return this.readLTStart();
            }
            case '=': {
                // '=', '==', '===', 
                return this.readAssignStart();
            }
            case "!": {
                // '!', '!=', '!=='
                return this.readExclamationStart();
            }
            case ",": {
                // ','
                this.eat();
                return this.finishToken(TokenFactories.comma, ",");
            }
            case "&": {
                // '&', '&&', '&=', '&&='
                return this.readANDStart();
            }
            case "|": {
                // '|', "||", '|=', '||='
                return this.readORStart();
            }
            case "?": {
                // '?', '?.' '??'
                return this.readQustionStart();
            }
            case "^": {
                // '^', '^='
                return this.readUpArrowStart();
            }
            case "~": {
                return this.readTildeStart();
            }
            case ".": {
                // '.', '...', 'float-literal', Sub State Machine 2
                return this.readDotStart();
            }
            /** ==========================================
             *  Keyword, Id, Literal
             *   -> start from 0 ~ 9 , is number literal.
             *   -> start from " or ', is string
             *   -> oterview, read string literal
             *       ->  string maybe match the keyword or operator, or literal (bool)
             *       ->   id lterial
             *  ==========================================
             */
            case "0": case "1": case "2": case "3": case "4": case "5":
            case "6": case "7": case "8": case "9": {
                // Number Literal
                return this.readNumberLiteral();
            }
            case "\"":
            case "\'": {
                // String Literal
                return this.readStringLiteral();
            }
            default: {
                // Word -> Id or Keyword
                return this.readString();
            }
        }
    }
    /**
     * 
     * @returns {Token}
     */
    public get(): Token {
        if(this.tokenStream.length === 0) {
            this.tokenStream.push(this.tokenize());
        }
        return this.tokenStream[this.context.indexInTokenStream];
    }
    /**
     * 
     * @returns 
     */
    public match(tokenType: TokenType | Set<TokenType>): boolean {
        if(typeof(tokenType) === "number")
            return (this.get().type === tokenType)
        return tokenType.has(this.get().type);
    }
    /**
     * 
     * @returns 
     */
    public next() {
        const lastToken = this.get();
        const nextToken = this.tokenize();
        if(nextToken.type === TokenType.EOF && lastToken.type === TokenType.EOF) {
            return lastToken;
        }
        this.tokenStream.push(nextToken);
        this.context.indexInTokenStream ++;
        return lastToken;
    }
    /**
     * 
     */
    public lookhead(): Token {
        const lookheadIndex = this.context.indexInTokenStream + 1;
        const maxIndex = this.tokenStream.length - 1;
        if(lookheadIndex < maxIndex) {
            return this.tokenStream[this.context.indexInTokenStream+1];
        }
        // if next token and last token is EOF.
        const lastToken = this.get();
        const nextToken = this.tokenize();
        if(nextToken.type === TokenType.EOF && lastToken.type === TokenType.EOF) {
            return lastToken;
        }
        this.tokenStream.push(nextToken);
        return this.tokenStream[this.context.indexInTokenStream+1];
    }
    /** ======================================
     *      Operators State Machine
     *  ======================================
     */
    private readPlusStart() {
        // read any token start with '+', '+=', '++'
        // MUST call when current char is '+'
        if(!this.is("+")) {
            throw this.subStateMachineError("readPlusStart", "+")
        }
        if(this.is("+=")) {
            this.eat(2);
            return this.finishToken(TokenFactories.plusAssign, "+=");
        }
        if(this.is("++")) {
            this.eat(2);
            return this.finishToken(TokenFactories.incre, "++");
        }
        this.eat();
        return this.finishToken(TokenFactories.plus, "+");
    }
    private readMinusStart() {
        // read any token start with '-', '-=', '--'
        // MUST call when current char is '-'
        if(!this.is("-")) {
            throw this.subStateMachineError("readMinusStart", "-");
        }
        if(this.is("-=")) {
            this.eat(2);
            return this.finishToken(TokenFactories.multiplyAssign, "-=");
        }
        if(this.is("--")) {
            this.eat(2);
            return this.finishToken(TokenFactories.decre, "--");
        }
        this.eat();
        return this.finishToken(TokenFactories.minus,"-");
    }
    private readMultiplyStart() {
        // read any token start with '*', '*=', '**', '**='
        // MUST call when current char is '*'
        if(!this.is("*")) {
            throw this.subStateMachineError("readMutiplyStart", "*");
        }
        if(this.is("**=")) {
            this.eat(3);
            return this.finishToken(TokenFactories.exponAssign, "**=");
        }
        if(this.is("**")) {
            this.eat(2);
            return this.finishToken(TokenFactories.expon, "**");
        }
        if(this.is("*=")) {
            this.eat(2);
            return this.finishToken(TokenFactories.multiplyAssign,"*=");
        }
        this.eat();
        return this.finishToken(TokenFactories.multiply, "*");
    }
    private readSlashStart() {
        // read any token start with '/', '/=', 'single-line-comment', 'block-comment'
        // MUST call when current char is '/'
        if(!this.is("/")) {
            throw this.subStateMachineError("readSlashStart", "/");
        }
        if(this.is("//")) {
            return this.readComment();
        }
        if(this.is("/*")) {
            return this.readCommentBlock();
        }
        if(this.is("/=")) {
            this.eat(2);
            return this.finishToken(TokenFactories.divideAssign, "//");
        }
        this.eat();
        return this.finishToken(TokenFactories.divide, "/");
    }
    private readComment() {
        if(!this.is("//")) {
            throw this.subStateMachineError("readComment", "//");
        }
        // eat '//'
        this.eat(2);
        let comment = "";
        while(!this.is("\n") && !this.eof()) {
            comment += this.eat();
        }
        return this.finishToken(TokenFactories.comment, comment);
    }
    private readCommentBlock() {
        if(!this.is("/*")) {
            throw new Error(``);
        }
        // Eat '/*'
        this.eat(2);
        let comment = "";
        while(!this.is("*/") && !this.eof()) {
            comment += this.eat();
        }
        if(this.eof()) {
            // lexical error, no close */ to comment.
            throw this.lexicalError("block comment can't find close '*/'");
        }
        // eat '*/'
        this.eat(2);
        return this.finishToken(TokenFactories.blockComment, comment);
    }
    private readModStart() {
        // read any token start with '%', '%='
        // MUST call when current char is '%'
        if(!this.is("%")) {
            throw this.subStateMachineError("readModStart", "%");
        }
        if(this.is("%=")) {
            this.eat(2);
            return this.finishToken(TokenFactories.modAssign,"%=");
        }
        this.eat();
        return this.finishToken(TokenFactories.mod, "%");
    }
    private readGTStart() {
        // read any token start with '>', '>=', '>>', '>>=', '>>>', '>>>='
        // MUST call when current char is '>'
        if(!this.is(">")) {
            throw this.subStateMachineError("readGTStart", ">");
        }
        if(this.is(">>>=")) {
            this.eat(4);
            this.finishToken(TokenFactories.bitwiseRightShiftFillAssgin, ">>>=");
        }
        if(this.is(">>>")) {
            this.eat(3);
            return this.finishToken(TokenFactories.bitwiseRightShiftFill, ">>>");
        }
        if(this.is(">>=")) {
            this.eat(3);
            return this.finishToken(TokenFactories.bitwiseRightShiftAssgin, ">>=");
        }
        if(this.is(">>")) {
            this.eat(2);
            return this.finishToken(TokenFactories.bitwiseRightShift, ">>")
        }
        if(this.is(">=")) {
            this.eat(2);
            return this.finishToken(TokenFactories.geqt, ">=");
        }
        this.eat();
        return this.finishToken(TokenFactories.gt, ">");
    }
    private readLTStart() {
        // read any token start with '<', '<=', '<<', '<<='
        // MUST call when current char is '<'
        if(!this.is("<")) {
            throw this.subStateMachineError("readLTStart", "<");
        }
        this.eat();
        if(this.is("<<=")) {
            this.eat(3);
            return this.finishToken(TokenFactories.bitwiseLeftShiftAssgin, "<<=");
        }
        if(this.is("<<")) {
            this.eat(2);
            return this.finishToken(TokenFactories.bitwiseLeftShift, "<<");
        }
        if(this.is("<=")) {
            this.eat(2);
            return this.finishToken(TokenFactories.leqt, "<=");
        }
        this.eat();
        return this.finishToken(TokenFactories.lt, "<");
    }
    private readAssignStart() {
        // [READ]: '=', '==', '==='
        // [MUST]: call when current char is '=' 
        if(!this.is("=")) {
            throw this.subStateMachineError("readAssginStart", "=");
        }
        if(this.is("===")) {
            this.eat(3);
            return this.finishToken(TokenFactories.strictEq, "===");
        }
        if(this.is("==")) {
            this.eat(3);
            return this.finishToken(TokenFactories.eq, "==");
        }
        this.eat();
        return this.finishToken(TokenFactories.assgin, "=");
    }
    private readExclamationStart() {
        // [READ]: '!', '!=', '!=='
        // [MUST]: call when current char is '!'
        if(!this.is("!")) {
            throw this.subStateMachineError("readExclamationStart", "!");
        }
        if(this.is("!==")) {
            this.eat(3);
            return this.finishToken(TokenFactories.strictNotEq, "!==");
        }
        if(this.is("!=")) {
            this.eat(2);
            return this.finishToken(TokenFactories.notEq, "!=");
        }
        this.eat();
        return this.finishToken(TokenFactories.logicalNOT, "!");
    }
    private readANDStart() {
        // [READ]: '&', '&&', '&=', '&&='
        // [MUST]: call when current char is '&' 
        if(!this.is("&")) {
            throw this.subStateMachineError("readANDStart", "&");
        }
        if(this.is("&&=")) {
            this.eat(3);
            return this.finishToken(TokenFactories.logicalANDAssgin, "&&=");
        }
        if(this.is("&&")) {
            this.eat(2);
            return this.finishToken(TokenFactories.logicalAND, "&&");
        }
        if(this.is("&=")) {
            this.eat(2);
            return this.finishToken(TokenFactories.bitwiseANDAssgin, "&=");
        }
        this.eat();
        return this.finishToken(TokenFactories.bitwiseAND, "&");
    }
    private readORStart() {
        // [READ]: '|', '||', '|=', '||='
        // [MUST]: call when current char is '|' 
        if(!this.is("|")) {
            throw this.subStateMachineError("readORStart", "|");
        }
        if(this.is("||=")) {
            this.eat(3);
            return this.finishToken(TokenFactories.logicalORAssign,"||=");
        }
        if(this.is("|=")) {
            this.eat(2);
            return this.finishToken(TokenFactories.bitwiseORAssgin,"|=");
        }
        if(this.is("||")) {
            this.eat(2);
            return this.finishToken(TokenFactories.logicalOR,"||");
        }
        this.eat();
        return this.finishToken(TokenFactories.bitwiseOR,"|");
    }
    private readQustionStart() {
        // [READ]: '?', '?.' '??'
        // [MUST]: call when current char is '?'
        if(!this.is("?")) {
            throw this.subStateMachineError("readQustionStart", "?");
        } 
        this.eat();
        if(this.is("?.")) {
            this.eat(2);
            return this.finishToken(TokenFactories.qustionDot,"?.");
        }
        if(this.is("??")) {
            // TODO
        }
        this.eat();
        return this.finishToken(TokenFactories.qustion, "?");
    }
    private readDotStart() {
        // [READ]: '.', '...'
        // [MUST]: call when current char is '.'
        if(!this.is(".")) {
            throw this.subStateMachineError("readDotStart", ".");
        } 
        if(this.is("...")) {
            this.eat(3);
            return this.finishToken(TokenFactories.spread, "...");
        }
        if(this.is(".")) {
            this.eat();
            return this.finishToken(TokenFactories.dot, ".");
        }
        // TODO not . , ...
        throw new Error();
    }
    private readTildeStart() {
        // [READ]: '~', '~='
        // [MUST]: call when current char is '~'
        if(!this.is("~")) {
            throw this.subStateMachineError("readWaveStart", "~");
        } 
        if(this.is("~=")) {
            this.eat(2);
            return this.finishToken(TokenFactories.bitwiseXORAssgin, "~=");
        }
        this.eat();
        return this.finishToken(TokenFactories.bitwiseXOR, "~=");
    }
    private readUpArrowStart() {
        // [READ]: '^', '^='
        // [MUST]: call when current char is '^'
        if(this.is("^=")) {
            this.eat(1);
            return this.finishToken(TokenFactories.bitwiseNOTAssgin, "^=");
        }
        this.eat();
        return this.finishToken(TokenFactories.bitwiseNOT, "^");
    }
    /** ================================================
     *     Id, Literal, Keywords State Machine
     *  ================================================
     */
    private readNumberLiteral() {
        // Start With 0
        if(this.is("0")) {
            this.eat();
            let floatWord = "";
            if(this.is(".")) {
                while(this.is(UTF8Def.numberChars)) {
                    floatWord += this.eat();
                }
                return this.finishToken(TokenFactories.digitalLiteral, `0.${floatWord}`);
            }
            throw new Error(`[Error]: Not Support 0x 0b Number`)
        }
        // Start With Non - 
        let intWord = "";
        let floatWord = "";
        while(this.is(UTF8Def.numberChars) && !this.eof()) {
            intWord += this.eat();
        }
        if(this.is(".")) {
            while(this.is(UTF8Def.numberChars) && !this.eof()) {
                floatWord += this.eat();
            }
            return this.finishToken(TokenFactories.digitalLiteral, `${intWord}.${floatWord}`);
        }
        return this.finishToken(TokenFactories.digitalLiteral, `${intWord}`);
    }
    private readStringLiteral() {
        let mode = "";
        if(this.is("\'")) {
            mode = "\'";
        }else if(this.is("\"")) {
            mode = "\""
        }
        this.eat();
        let word = "";
        while(!this.is(mode) && !this.eof()) {
            word += this.eat()
        }
        if(this.eof()) {
            throw this.lexicalError(`string literal start with ${mode} can't find closed char`);
        }
        this.eat();
        return this.finishToken(TokenFactories.stringLiteral, word);
    }
    private readString() {
        let word = "";
        let start = this.eat();
        while(!this.is(
            composeCharsArray(
                ReservedWords.punctuators,
                ReservedWords.operator, 
                UTF8Def.newLineChars, 
                UTF8Def.whiteSpaceChars
            )
        )) {
            word += this.eat();
        }
        const w = start + word;
        if((new Set(ReservedWords.keywords)).has(w)) {
            if(TokenFactories[w] === null) {
                throw new Error(`[Error]: Keyword ${w} have no match method to create token`);
            }
            return this.finishToken(TokenFactories[w], w);
        }
        if((new Set(ReservedWords.BooleanLiteral)).has(w)) {
            if(w === "true") {
                return this.finishToken(TokenFactories.true, w);
            }
            if(w === "false") {
                return this.finishToken(TokenFactories.false, w);
            }
            throw new Error(`[Error]: Boolean Lieral ${w} have no match method to create token`);
        }
        if((new Set(ReservedWords.NullLiteral)).has(w)) {
            return this.finishToken(TokenFactories.null, w);
        }
        if((new Set(ReservedWords.UndefinbedLiteral)).has(w)) {
            return this.finishToken(TokenFactories.undefined, w);
        }
        return this.finishToken(TokenFactories.identifier, w);
    }
}