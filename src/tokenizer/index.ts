import type {SourceLocation, Position} from "@/src/utils/location";
import {forkPosition, createPosition} from "@/src/utils/location";
import {createLocation} from "@/src/utils/location";
import type {Token} from "@/src/tokenizer/type";
import {ReservedWords, UTF8Def, TokenFactories} from "./type";
import {composeCharsArray} from "./type";

/** Context for reading Code String
 *  - position: current pointer to code string.
 *  - location: location info, row and col.
 */
export interface Context {
    currentPosition: Position;
    currentPointer: number;
}
export function createContext (): Context {
    return {
        currentPointer: 0,
        currentPosition: createPosition()
    };
}
export function forkContext(target: Context): Context {
    return { ...target, currentPosition: forkPosition(target.currentPosition) };
}
/** Tokenizer for push token to parser
 * 
 */
// TODO: template string.
// TODO: string with '/' could change line, regex support.
export class Tokenizer {
    private code: string;
    private context: Context;
    private tempTokenStartPointer: number;
    private tempTokenStartPosition: Position | null;
    constructor(code: string) {
        this.code = code;
        this.context = createContext();
        this.tempTokenStartPosition = null;
        this.tempTokenStartPointer = 0;
    }
    /**
     * Peek is a util function peek n char from current point position,
     * if meet eof, it would return empty string.
     * @param {number} n number of char need to peek, default is 0
     * @returns {string} peek string, if meet eof, it would return empty string.
     */
    private peek(n: number = 0): string {
        if(n < 0) {
            throw new Error(``);
        }
        if(this.code.length <= this.context.currentPointer) {
            return "";
        }
        if(this.context.currentPointer + n + 1< this.code.length) {
            return this.code.slice(this.context.currentPointer, this.context.currentPointer + n + 1);
        }
        return this.code.slice(this.context.currentPointer);
    }
    /**
     * Eat is a util function that 
     * last position to current position
     * @param {number} n 
     * @returns {string}
     */
    private eat(n: number = 0): string {
        const char = this.peek(n);
        if(char === "") {
            return "";
        }
        for(const ch of char) {
            if(ch === UTF8Def.newLineChars[0]) {
                this.context.currentPosition.row ++;
                this.context.currentPosition.col = 0;
            } else {
                this.context.currentPosition.col ++;
            }
            this.context.currentPointer ++;
        }
        return char;
    }
    private is(char: string | Array<string> |Set<string>= "") {
        if(char === "") {
            return this.peek() === "";
        }
        if(typeof(char) == "string") {
            char = [char];
        }
        if(!(char instanceof Set)) {
            char = new Set(char);
        }
        for(const value of char) {
            if(value === this.peek(value.length - 1)) {
                return true;
            }
        }
        return false;
    }
    protected startToken() {
        this.tempTokenStartPointer = this.context.currentPointer;
        this.tempTokenStartPosition = forkPosition(this.context.currentPosition)
    }
    protected finishToken<T>(
        callback: (value: T, start: number, end: number,location: SourceLocation) => Token, 
        value: T
    ) {
        const location = createLocation();
        location.start = forkPosition(this.tempTokenStartPosition);
        location.end = forkPosition(this.context.currentPosition);
        return callback(value, this.tempTokenStartPointer, this.context.currentPointer, location);
    }
    protected behaviorError(name: string, char: string) {
        return new Error(`[Error]: ${name} state machine should only be called when currnet position is ${char}. `);
    }
    protected lexicalError() {
        // TODO
    }
    getToken() {
        this.skipSpace();
        const char = this.peek();
        if(char === "") {
            return this.finishToken(TokenFactories.eof, "eof");
        }
        this.startToken();
        switch(char) {
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
    skipSpace() {
        while(!this.is()) {
            if(!this.is(
                composeCharsArray(UTF8Def.newLineChars, UTF8Def.whiteSpaceChars)
            )) {
                return;
            }
            this.eat();
            continue;
        }
    }
    /** ======================================
     *      Operators State Machine
     *  ======================================
     */
    readPlusStart(): Token {
        // read any token start with '+', '+=', '++'
        // MUST call when current char is '+'
        if(!this.is("+")) {
            throw this.behaviorError("readPlusStart", "+")
        }
        if(this.is("+=")) {
            this.eat(1);
            return this.finishToken(TokenFactories.plusAssign, "+=");
        }
        if(this.is("++")) {
            this.eat(1);
            return this.finishToken(TokenFactories.incre, "++");
        }
        this.eat();
        return this.finishToken(TokenFactories.plus, "+");
    }
    readMinusStart() {
        // read any token start with '-', '-=', '--'
        // MUST call when current char is '-'
        if(!this.is("-")) {
            throw this.behaviorError("readMinusStart", "-");
        }
        if(this.is("-=")) {
            this.eat(1);
            return this.finishToken(TokenFactories.multiplyAssign, "-=");
        }
        if(this.is("--")) {
            this.eat(1);
            return this.finishToken(TokenFactories.decre, "--");
        }
        this.eat();
        return this.finishToken(TokenFactories.minus,"-");
    }
    readMultiplyStart() {
        // read any token start with '*', '*=', '**', '**='
        // MUST call when current char is '*'
        if(!this.is("*")) {
            throw this.behaviorError("readMutiplyStart", "*");
        }
        if(this.is("**=")) {
            this.eat(2);
            return this.finishToken(TokenFactories.exponAssign, "**=");
        }
        if(this.is("**")) {
            this.eat(1);
            return this.finishToken(TokenFactories.expon, "**");
        }
        if(this.is("*=")) {
            this.eat(1);
            return this.finishToken(TokenFactories.multiplyAssign,"*=");
        }
        this.eat();
        return this.finishToken(TokenFactories.multiply, "*");
    }
    readSlashStart() {
        // read any token start with '/', '/=', 'single-line-comment', 'block-comment'
        // MUST call when current char is '/'
        if(!this.is("/")) {
            throw this.behaviorError("readSlashStart", "/");
        }
        if(this.is("//")) {
            return this.readComment();
        }
        if(this.is("/*")) {
            return this.readCommentBlock();
        }
        if(this.is("/=")) {
            this.eat(1);
            return this.finishToken(TokenFactories.divideAssign, "//");
        }
        this.eat();
        return this.finishToken(TokenFactories.divide, "/");
    }
    readComment() {
        if(!this.is("//")) {
            throw this.behaviorError("readComment", "//");
        }
        this.eat(1);
        let comment = "";
        while(!this.is("\n")) {
            comment += this.eat();
        }
        return this.finishToken(TokenFactories.singleLineComment, comment);
    }
    readCommentBlock() {
        if(!this.is("/*")) {
            throw new Error(``);
        }
        this.eat(1); // Eat '/*'
        let comment = "";
        while(!this.is("*/") && !this.is()) {
            comment += this.eat();
        }
        if(this.is()) {
            // lexical error, no close */ to comment.
            throw new Error();
        }
        this.eat(1); // eat '*/'
        return this.finishToken(TokenFactories.multiLineComment, comment);
    }
    readModStart() {
        // read any token start with '%', '%='
        // MUST call when current char is '%'
        if(!this.is("%")) {
            throw this.behaviorError("readModStart", "%");
        }
        if(this.is("%=")) {
            this.eat(1);
            return this.finishToken(TokenFactories.modAssign,"%=");
        }
        this.eat();
        return this.finishToken(TokenFactories.mod, "%");
    }
    readGTStart() {
        // read any token start with '>', '>=', '>>', '>>=', '>>>', '>>>='
        // MUST call when current char is '>'
        if(!this.is(">")) {
            throw this.behaviorError("readGTStart", ">");
        }
        if(this.is(">>>=")) {
            this.eat(3);
            this.finishToken(TokenFactories.bitwiseRightShiftFillAssgin, ">>>=");
        }
        if(this.is(">>>")) {
            this.eat(2);
            return this.finishToken(TokenFactories.bitwiseRightShiftFill, ">>>");
        }
        if(this.is(">>=")) {
            this.eat(2);
            return this.finishToken(TokenFactories.bitwiseRightShiftAssgin, ">>=");
        }
        if(this.is(">>")) {
            this.eat(1);
            return this.finishToken(TokenFactories.bitwiseRightShift, ">>")
        }
        if(this.is(">=")) {
            this.eat(1);
            return this.finishToken(TokenFactories.geqt, ">=");
        }
        this.eat();
        return this.finishToken(TokenFactories.gt, ">");
    }
    readLTStart() {
        // read any token start with '<', '<=', '<<', '<<='
        // MUST call when current char is '<'
        if(!this.is("<")) {
            throw this.behaviorError("readLTStart", "<");
        }
        this.eat();
        if(this.is("<<=")) {
            this.eat(2);
            return this.finishToken(TokenFactories.bitwiseLeftShiftAssgin, "<<=");
        }
        if(this.is("<<")) {
            this.eat(1);
            return this.finishToken(TokenFactories.bitwiseLeftShift, "<<");
        }
        if(this.is("<=")) {
            this.eat(1);
            return this.finishToken(TokenFactories.leqt, "<=");
        }
        this.eat();
        return this.finishToken(TokenFactories.lt, "<");
    }
    readAssignStart() {
        // [READ]: '=', '==', '==='
        // [MUST]: call when current char is '=' 
        if(!this.is("=")) {
            throw this.behaviorError("readAssginStart", "=");
        }
        if(this.is("===")) {
            this.eat(2);
            return this.finishToken(TokenFactories.strictEq, "===");
        }
        if(this.is("==")) {
            this.eat(1);
            return this.finishToken(TokenFactories.eq, "==");
        }
        this.eat();
        return this.finishToken(TokenFactories.assgin, "=");
    }
    readExclamationStart() {
        // [READ]: '!', '!=', '!=='
        // [MUST]: call when current char is '!'
        if(!this.is("!")) {
            throw this.behaviorError("readExclamationStart", "!");
        }
        if(this.is("!==")) {
            this.eat(2);
            return this.finishToken(TokenFactories.strictNotEq, "!==");
        }
        if(this.is("!=")) {
            this.eat(1);
            return this.finishToken(TokenFactories.notEq, "!=");
        }
        this.eat();
        return this.finishToken(TokenFactories.logicalNOT, "!");
    }
    readANDStart() {
        // [READ]: '&', '&&', '&=', '&&='
        // [MUST]: call when current char is '&' 
        if(!this.is("&")) {
            throw this.behaviorError("readANDStart", "&");
        }
        if(this.is("&&=")) {
            this.eat(2);
            return this.finishToken(TokenFactories.logicalANDAssgin, "&&=");
        }
        if(this.is("&&")) {
            this.eat(1);
            return this.finishToken(TokenFactories.logicalAND, "&&");
        }
        if(this.is("&=")) {
            this.eat(1);
            return this.finishToken(TokenFactories.bitwiseANDAssgin, "&=");
        }
        this.eat();
        return this.finishToken(TokenFactories.bitwiseAND, "&");
    }
    readORStart() {
        // [READ]: '|', '||', '|=', '||='
        // [MUST]: call when current char is '|' 
        if(!this.is("|")) {
            throw this.behaviorError("readORStart", "|");
        }
        if(this.is("||=")) {
            this.eat(2);
            return this.finishToken(TokenFactories.logicalORAssign,"||=");
        }
        if(this.is("|=")) {
            this.eat(1);
            return this.finishToken(TokenFactories.bitwiseORAssgin,"|=");
        }
        if(this.is("||")) {
            this.eat(1);
            return this.finishToken(TokenFactories.logicalOR,"||");
        }
        this.eat();
        return this.finishToken(TokenFactories.bitwiseOR,"|");
    }
    readQustionStart() {
        // [READ]: '?', '?.' '??'
        // [MUST]: call when current char is '?'
        if(!this.is("?")) {
            throw this.behaviorError("readQustionStart", "?");
        } 
        this.eat();
        if(this.is("?.")) {
            this.eat(1);
            return this.finishToken(TokenFactories.qustionDot,"?.");
        }
        if(this.is("??")) {
            // TODO
        }
        this.eat();
        return this.finishToken(TokenFactories.qustion, "?");
    }
    readDotStart() {
        // [READ]: '.', '...'
        // [MUST]: call when current char is '.'
        if(!this.is(".")) {
            throw this.behaviorError("readDotStart", ".");
        } 
        if(this.is("...")) {
            this.eat(2);
            return this.finishToken(TokenFactories.spread, "...");
        }
        if(this.is(".")) {
            this.eat();
            return this.finishToken(TokenFactories.dot, ".");
        }
        // TODO not . , ...
        throw new Error();
    }
    readTildeStart() {
        // [READ]: '~', '~='
        // [MUST]: call when current char is '~'
        if(!this.is("~")) {
            throw this.behaviorError("readWaveStart", "~");
        } 
        if(this.is("~=")) {
            this.eat(1);
            return this.finishToken(TokenFactories.bitwiseXORAssgin, "~=");
        }
        this.eat();
        return this.finishToken(TokenFactories.bitwiseXOR, "~=");
    }
    readUpArrowStart() {
        // [READ]: '^', '^='
        // [MUST]: call when current char is '^'
        if(this.is("^=")) {
            this.eat(1);
            return this.finishToken(TokenFactories.bitewiseNOTAssgin, "^=");
        }
        this.eat();
        return this.finishToken(TokenFactories.bitewiseNOT, "^");
    }
    /** ================================================
     *     Id, Literal, Keywords State Machine
     *  ================================================
     */
    readNumberLiteral() {
        // Start With 0
        if(this.is("0")) {
            this.eat();
            let floatWord = "";
            if(this.is(".")) {
                while(this.is(UTF8Def.numberChars)) {
                    floatWord += this.eat();
                }
                return this.finishToken(TokenFactories.numberLiteral, `0.${floatWord}`);
            }
            throw new Error(`[Error]: Not Support 0x 0b Number`)
        }
        // Start With Non - 
        let intWord = "";
        let floatWord = "";
        while(this.is(UTF8Def.numberChars)) {
            intWord += this.eat();
        }
        if(this.is(".")) {
            while(this.is(UTF8Def.numberChars)) {
                floatWord += this.eat();
            }
            return this.finishToken(TokenFactories.numberLiteral, `${intWord}.${floatWord}`);
        }
        return this.finishToken(TokenFactories.numberLiteral, `${intWord}`);
    }

    readStringLiteral() {
        let mode = "";
        if(this.is("\'")) {
            mode = "\'";
        }else if(this.is("\"")) {
            mode = "\""
        }
        this.eat();
        let word = "";
        while(!this.is(mode)) {
            word += this.eat()
        }
        this.eat();
        return this.finishToken(TokenFactories.stringLiteral, word);
    }
    readString() {
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