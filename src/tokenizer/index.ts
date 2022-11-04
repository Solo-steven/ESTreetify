import type {SourceLocation} from "@/src/utils/location";
import {forkLocation, createLocation} from "@/src/utils/location";
import type {Token} from "@/src/tokenizer/type";
import {ReservedWords, Toknes as tt} from "./type";

/** Context for reading Code String
 *  - position: current pointer to code string.
 *  - location: location info, row and col.
 */
export interface Context {
    position: number;
    location: SourceLocation;
}
export function createContext (): Context {
    return {
        position: 0,
        location: createLocation()
    };
}
export function forkContext(target: Context): Context {
    return { ...target, location: forkLocation(target.location) };
}
/** Tokenizer for push token to parser
 * 
 */
// TODO: multi line comment.
// TODO: template string.
// TODO: string with '/' could change line, regex support.
export class Tokenizer {
    private code: string;
    private context: Context;
    private tempTokenStart: SourceLocation | null;
    constructor(code: string) {
        this.code = code;
        this.context = createContext();
        this.tempTokenStart = null;
    }
    private get() {
        if(this.code.length <= this.context.position) {
            return "";
        }
        return this.code[this.context.position];
    }
    private eat() {
        const char = this.get();
        if(char) {
            if(char === ReservedWords.newLineChars[0]) {
                this.context.location.row ++;
                this.context.location.col = 0;
            } else {
                this.context.location.col ++;
            }
            this.context.position ++;
            return char;
        }
        return "";
    }
    private is(char: string | Array<string> = "") {
        if(!Array.isArray(char)) {
            char = [char];
        }
        const matchSet = new Set(char);
        return matchSet.has(this.get());
    }
    protected skipSpace() {
        while(!this.is()) {
            if(!this.is([...ReservedWords.newLineChars, ...ReservedWords.whiteSpaceChars])) {
                return;
            }
            this.eat();
            continue;
        }
    }
    protected startToken() {
        this.tempTokenStart = forkLocation(this.context.location);
    }
    protected finishToken<T>(
        callback: (value: T, startLoc: SourceLocation, endLoc: SourceLocation) => Token, 
        value: T
    ) {
        const tokenEnd = forkLocation(this.context.location);
        return callback(value, this.tempTokenStart, tokenEnd);
    }
    protected behaviorError(name: string, char: string) {
        return new Error(`[Error]: ${name} state machine should only be called when currnet position is ${char}. `);
    }
    protected lexicalError() {
        // TODO
    }
    getToken() {
        this.skipSpace();
        const char = this.get();
        if(char === "") {
            return null // EOF;
        }
        this.startToken();
        switch(char) {
            /** ==========================================
             *              Punctuators
             *  ==========================================
             */
            case "{":
                this.eat();
                return this.finishToken(tt.bracesLeft.create, "{");
            case "}":
                this.eat();
                return this.finishToken(tt.bracesRight.create, "}");
            case "[":
                this.eat();
                return this.finishToken(tt.bracketLeft.create, "[");
            case "]":
                this.eat();
                return this.finishToken(tt.bracketRight.create,"]");
            case "(":
                this.eat();
                return this.finishToken(tt.parenthesesLeft.create, "(");
            case ")":
                this.eat();
                return this.finishToken(tt.parenthesesRight.create, ")");
            case ":":
                this.eat();
                return this.finishToken(tt.colon.create, ":");
            case ";":
                this.eat();
                return this.finishToken(tt.semi.create, ";");
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
                return this.finishToken(tt.comma.create, ",");
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
    /** ======================================
     *      Operators State Machine
     *  ======================================
     */
    readPlusStart(): Token {
        // read any token start with +', '+=', '++'
        // MUST call when current char is '+'
        if(!this.is("+")) {
            throw this.behaviorError("readPlusStart", "+")
        }
        this.eat();
        if(this.is("=")) {
            this.eat();
            return this.finishToken(tt.plusAssign.create, "+=");
        }
        if(this.is("+")) {
            this.eat();
            return this.finishToken(tt.incre.create, "++");
        }
        return this.finishToken(tt.plus.create, "+");
    }
    readMinusStart() {
        if(!this.is("-")) {
            throw this.behaviorError("readMinusStart", "-");
        }
        this.eat();
        if(this.is("=")) {
            this.eat();
            return this.finishToken(tt.multiplyAssign.create, "-=");
        }
        if(this.is("-")) {
            this.eat();
            return this.finishToken(tt.decre.create, "--");
        }
        return this.finishToken(tt.minus.create,"-");
    }
    readMultiplyStart() {
        if(this.is("*")) {
            throw this.behaviorError("readMutiplyStart", "*");
        }
        this.eat();
        if(this.is("*")) {
            this.eat();
            if(this.is("=")) {
                this.eat();
                return this.finishToken(tt.exponAssign.create, "**=");
            }
            return this.finishToken(tt.expon.create, "**");
        }
        if(this.is("=")) {
            this.eat();
            return this.finishToken(tt.multiplyAssign.create,"*=");
        }
        return this.finishToken(tt.multiply.create, "*");
    }
    readSlashStart() {
        if(this.is("*")) {
            throw this.behaviorError("readSlashStart", "/");
        }
        this.eat();
        if(this.is("/")) {
            return this.readComment();
        }
        if(this.is("*")) {
            return this.readCommentBlock();
        }
        return this.finishToken(tt.divide.create, "/");
    }
    readComment() {
        if(!this.is("/")) {
            throw this.behaviorError("readComment", "//");
        }
        let comment = "";
        while(!this.is("\n")) {
            comment += this.eat();
        }
        return this.finishToken(tt.singleLineComment.create, comment);
    }
    readCommentBlock() {
        // TODO
    }
    readModStart() {
        if(this.is("*")) {
            throw this.behaviorError("readModStart", "%");
        }
        this.eat();
        if(this.is("=")) {
            this.eat();
            return this.finishToken(tt.modAssign.create,"%=");
        }
        return this.finishToken(tt.mod.create, "%");
    }
    readGTStart() {
        if(!this.is(">")) {
            throw this.behaviorError("readGTStart", ">");
        }
        this.eat();
        if(this.is(">")) {
            this.eat();
            if(this.is("=")) {
                this.eat();
                return this.finishToken(tt.bitwiseRightShiftAssgin.create, ">>=");
            }
            if(this.is(">")) {
                this.eat();
                if(this.is("=")) {
                    this.eat();
                    return this.finishToken(tt.bitwiseRightShiftFillAssgin.create, ">>>=");
                }
                return this.finishToken(tt.bitwiseRightShiftFill.create, ">>>");
            }
            return this.finishToken(tt.bitwiseRightShift.create, ">>")
        }
        if(this.is("=")) {
            this.eat();
            return this.finishToken(tt.geqt.create, ">=");
        }
        return this.finishToken(tt.gt.create, ">");
    }
    readLTStart() {
        if(!this.is("<")) {
            throw this.behaviorError("readLTStart", "<");
        }
        this.eat();
        if(this.is("<")) {
            this.eat();
            if(this.is("=")) {
                this.eat();
                return this.finishToken(tt.bitwiseLeftShiftAssgin.create, "<<=");
            }
            return this.finishToken(tt.bitwiseLeftShift.create, "<<");
        }
        if(this.is("=")) {
            this.eat();
            return this.finishToken(tt.leqt.create, "<=");
        }
        return this.finishToken(tt.lt.create, "<");
    }
    readAssignStart() {
        // [READ]: '=', '==', '==='
        // [MUST]: call when current char is '=' 
        if(!this.is("=")) {
            throw this.behaviorError("readAssginStart", "=");
        }
        this.eat();
        if(this.is("=")) {
            this.eat();
            if(this.is("=")) {
                this.eat();
                return this.finishToken(tt.strictEq.create, "===");
            }
            return this.finishToken(tt.eq.create, "==");
        }
        return this.finishToken(tt.assgin.create, "=");
    }
    readExclamationStart() {
        // [READ]: '!', '!=', '!=='
        // [MUST]: call when current char is '!'
        if(!this.is("!")) {
            throw this.behaviorError("readExclamationStart", "!");
        }
        this.eat();
        if(this.is("=")) {
            this.eat();
            if(this.is('=')) {
                this.eat()
                return this.finishToken(tt.strictNotEq.create, "!==");
            }
            return this.finishToken(tt.notEq.create, "!=");
        }
        return this.finishToken(tt.logicalNOT.create, "!");
    }
    readANDStart() {
        // [READ]: '&', '&&', '&=', '&&='
        // [MUST]: call when current char is '&' 
        if(this.is("&")) {
            throw this.behaviorError("readANDStart", "&");
        }
        this.eat();
        if(this.is("&")) {
            this.eat();
            if(this.is("=")) {
                this.eat();
                return this.finishToken(tt.logicalANDAssgin.create, "&&=");
            }
            return this.finishToken(tt.logicalAND.create, "&&");
        }
        if(this.is("=")) {
            this.eat();
            return this.finishToken(tt.bitwiseANDAssgin.create, "&=");
        }
        return this.finishToken(tt.bitwiseAND.create, "&");
    }
    readORStart() {
        // [READ]: '|', '||', '|=', '||='
        // [MUST]: call when current char is '|' 
        if(this.is("|")) {
            throw this.behaviorError("readORStart", "|");
        }
        this.eat();
        if(this.is("|")) {
            this.eat();
            if(this.is("=")) {
                this.eat();
                return this.finishToken(tt.logicalORAssign.create,"||=");
            }
            return this.finishToken(tt.logicalOR.create,"||");
        }
        if(this.is("=")) {
            this.eat();
            return this.finishToken(tt.bitwiseORAssgin.create,"|=");
        }
        return this.finishToken(tt.bitwiseOR.create,"|");
    }
    readQustionStart() {
        // [READ]: '?', '?.' '??'
        // [MUST]: call when current char is '?'
        if(!this.is("?")) {
            throw this.behaviorError("readQustionStart", "?");
        } 
        this.eat();
        if(this.is(".")) {
            this.eat();
            return this.finishToken(tt.qustionDot.create,"?.");
        }
        if(this.is("?")) {
            this.eat();
            //TODO ??
        }
        return this.finishToken(tt.qustionDot.create, "?");
    }
    readDotStart() {
        // [READ]: '.', '...'
        // [MUST]: call when current char is '.'
        if(!this.is(".")) {
            throw this.behaviorError("readDotStart", ".");
        } 
        this.eat();
        if(this.is(".")) {
            // TODO -> ... valid, .. not
        }
        return this.finishToken(tt.dot.create, ".");
    }
    readTildeStart() {
        // [READ]: '~', '~='
        // [MUST]: call when current char is '~'
        if(!this.is("~")) {
            throw this.behaviorError("readWaveStart", "~");
        } 
        this.eat();
        if(this.is("=")) {
            this.eat();
            return this.finishToken(tt.bitwiseXORAssgin.create, "~=");
        }
        return this.finishToken(tt.bitwiseXOR.create, "~=");
    }
    readUpArrowStart() {
        // [READ]: '^', '^='
        // [MUST]: call when current char is '^'
        this.eat();
        if(this.is("=")) {
            this.eat();
            return this.finishToken(tt.bitewiseNOTAssgin.create, "^=");
        }
        return this.finishToken(tt.bitewiseNOT.create, "^");
    }
    /** ================================================
     *     Id, Literal, Keywords State Machine
     *  ================================================
     */
    readNumberLiteral() {
        this.eat();
        // Start With 0
        if(this.is("0")) {
            this.eat();
            let floatWord = "";
            if(this.is(".")) {
                while(this.is("1/2/3/4/5/6/7/8/9/0".split("/"))) {
                    floatWord += this.eat();
                }
                return this.finishToken(tt.numberLiteral.create, `0.${floatWord}`);
            }
            throw new Error(`[Error]: Not Support 0x 0b Number`)
        }
        // Start With Non - 
        let intWord = "";
        let floatWord = "";
        while(this.is("1/2/3/4/5/6/7/8/9/0".split("/"))) {
            intWord += this.eat();
        }
        if(this.is(".")) {
            while(this.is("1/2/3/4/5/6/7/8/9/0".split("/"))) {
                floatWord += this.eat();
            }
            return this.finishToken(tt.numberLiteral.create, `${intWord}.${floatWord}`);
        }
        return this.finishToken(tt.numberLiteral.create, `${intWord}`);
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
        return this.finishToken(tt.stringLiteral.create, word);
    }
    readString() {
        let word = "";
        let start = this.eat();
        while(!this.is([
            ...ReservedWords.punctuators,
            ...ReservedWords.operator, 
            ...ReservedWords.newLineChars, 
            ...ReservedWords.whiteSpaceChars]
        )) {
            word += this.eat();
        }
        const w = start + word;
        if((new Set(ReservedWords.keywords)).has(w)) {
            if(tt[w] === null) {
                throw new Error(`[Error]: Keyword ${w} have no match method to create token`);
            }
            return this.finishToken(tt[w].create, w);
        }
        if((new Set(ReservedWords.BooleanLiteral)).has(w)) {
            if(w === "true") {
                return this.finishToken(tt.true.create, w);
            }
            if(w === "false") {
                return this.finishToken(tt.false.create, w);
            }
            throw new Error(`[Error]: Boolean Lieral ${w} have no match method to create token`);
        }
        if((new Set(ReservedWords.NullLiteral)).has(w)) {
            return this.finishToken(tt.null.create, w);
        }
        if((new Set(ReservedWords.UndefinbedLiteral)).has(w)) {
            return this.finishToken(tt.undefined.create, w);
        }
        return this.finishToken(tt.identifier.create, w);
    }
}