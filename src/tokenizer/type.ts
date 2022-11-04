import { SourceLocation } from "@/src/utils/location";
/** ======================================================
 *          Token and ToknType Data Type
 * ========================================================
 */
export interface Token {
    type: TokenType;
    value: string;
    startLoc: SourceLocation;
    endLoc: SourceLocation;
};
class TokenType {
    type: string;
    label: string;
    constructor(type: string, label: string) {
        this.type = type;
        this.label = label;
        this.create = this.create.bind(this);
        this.is = this.is.bind(this);
    }
    create(value: string, startLoc: SourceLocation, endLoc: SourceLocation | null = null): Token {
        return {
            type: this,
            value,
            startLoc,
            endLoc: endLoc ? endLoc : startLoc
        }
    }
    is(token: Token) {
        return token.type === this;
    }
}
export const Toknes  = {
    // ========== Keyword ==========
    await: new TokenType("keyword/await", "await"),
    break: new TokenType("keyword/break", "break"),
    case: new TokenType("keyword/case", "case"),
    catch: new TokenType("keyword","catch"),
    class: new TokenType("keyword/class", "class"),
    const: new TokenType("keyword/const", "const"),
    continue: new TokenType("keyword/continue", "continue"),
    debugger: new TokenType("keyword/debugger", "debugger"),
    default: new TokenType("keyword/default", "default"),
    do: new TokenType("keyword/do", "do"),
    else: new TokenType("keyword/else", "else"),
    enum: new TokenType("keyword/enum", "enum"),
    export: new TokenType("keyword/export", "export"),
    extends: new TokenType("keyword/extends", "extends"),
    finally: new TokenType("keyword/finally", "finally"),
    for: new TokenType("keyword/for", "for"),
    function: new TokenType("keyword/function", "function"),
    if: new TokenType("keyword/if", "if"),
    import: new TokenType("keyword/import", "import"),
    new: new TokenType("keyword/new", "new"),
    return: new TokenType("keyword/new", "new"),
    super: new TokenType("keyword/super", "super"),
    switch: new TokenType("keyword/switch", "switch"),
    this: new TokenType("keyword/this", "this"),
    throw: new TokenType("keyword/throw", "throw"),
    try: new TokenType("keyword/try", "try"),
    var: new TokenType("keyword/var", "var"),
    with: new TokenType("keyword/with", "with"),
    yield: new TokenType("keyword/yield", "yield"),
    delete: new TokenType("keyword/delete", "delete"),
    void: new TokenType("keyword/void", "void"),
    typeof: new TokenType("keyword/typeof", "typeof"),
    in: new TokenType("keyword/in", "in"),
    instanceof: new TokenType("keyword/instanceof", "instanceof"),
    // ========== Punctuators ==========
    bracesLeft: new TokenType("punctuator/bracesLeft", "{"),
    bracesRight: new TokenType("punctuator/bracesRight", "}"),
    bracketLeft: new TokenType("punctuator/bracketLeft", "["),
    bracketRight: new TokenType("punctuator/bracketRight", "]"),
    parenthesesLeft: new TokenType("punctuator/parenthesesLeft", "("),
    parenthesesRight: new TokenType("punctuator/parenthesesRight", ")"),
    singleQuotation: new TokenType("punctuator/singleQuotation", "\'"),
    doubleQuotation: new TokenType("punctuator/doubleQuotation", "\""),
    semi: new TokenType("punctuator/Semi", ";"),
    colon: new TokenType("punctuator/colon", ":"),
    hashTag: new TokenType("punctuator/HashTag", "#"),
    // ========== Operators ==========
    plus: new TokenType("operator/plus", "+"),
    minus: new TokenType("operator/mius", "-"),
    divide: new TokenType("operator/divide", "/"),
    multiply: new TokenType("operator/multiply", "*"),
    mod: new TokenType("operator/mod", "%"),
    incre: new TokenType("operator/incre", "++"),
    decre:new TokenType("operator/decre", "--"),
    expon: new TokenType("operator/expon", "**"),
    gt: new TokenType("operator/greaterThen", ">"),
    lt: new TokenType("operator/lessThen", "<"),
    eq: new TokenType("operator/equal", "=="),
    notEq: new TokenType("operator/notEqual", "!="),
    geqt: new TokenType("operator/greaterOrEqualThen", ">="),
    leqt: new TokenType("operator/lessOrEqualThen", "<="),
    strictEq: new TokenType("operator/strictEqual", "==="),
    strictNotEq: new TokenType("operator/strictNotEqual", "!=="),
    bitwiseOR: new TokenType("operator/bitwiseOR", "|"),
    bitwiseAND: new TokenType("operator/bitwiseAND", "&"),
    bitewiseNOT: new TokenType("operator/bitwiseNOT", "~"),
    bitwiseXOR: new TokenType("operator/bitwiseXOR", "^"),
    bitwiseLeftShift: new TokenType("operator/bitwiseLeftShift", "<<"),
    bitwiseRightShift: new TokenType("operator/bitwisRightShift", ">>"),
    bitwiseRightShiftFill: new TokenType("operator/bitwiseRightShiftFill", ">>>"),
    logicalOR: new TokenType("operator/logicaOR", "||"),
    logicalAND: new TokenType("operator/logicalAND", "&&"),
    logicalNOT: new TokenType("operator/logicalNOT", "!"),
    comma: new TokenType("operator/comma", ","),
    spread: new TokenType("operator/spread", "..."),
    qustionDot: new TokenType("operatpr/qustionDot", "?."),
    dot: new TokenType("operator/dot", "."),
    assgin: new TokenType("operator/assignment", "="),
    plusAssign: new TokenType("operator/plusAssignment", "+="),
    minusAssign: new TokenType("operator/minusAssignment", "-="),
    modAssign: new TokenType("operator/modAssignment", "%="),
    divideAssign: new TokenType("operator/divideAssignment", "/="),
    multiplyAssign: new TokenType("operator/multiplyAssgin", "*="),
    exponAssign: new TokenType("operator/exponAssignment", "**="),
    bitwiseORAssgin: new TokenType("operator/bitwiseORAssginment", "|="),
    bitwiseANDAssgin: new TokenType("operator/bitwiseANDAssginment", "&="),
    bitewiseNOTAssgin: new TokenType("operator/bitwiseNOTAssginment", "~="),
    bitwiseXORAssgin: new TokenType("operator/bitwiseXORAssginment", "^="),
    logicalORAssign: new TokenType("operator/logicaORAssingment", "||="),
    logicalANDAssgin: new TokenType("operator/logicalANDAssignment", "&&="),
    bitwiseLeftShiftAssgin: new TokenType("operator/bitwiseLeftShiftAssginment", "<<="),
    bitwiseRightShiftAssgin: new TokenType("operator/bitwisRightShiftAssginment", ">>="),
    bitwiseRightShiftFillAssgin: new TokenType("operator/bitwiseRightShiftFillAssginment", ">>>="),
    // ========== Literal ==========
    true: new TokenType("literal/true", "true"),
    false: new TokenType("literal/false", "false"),
    null: new TokenType("literal/nll", "null"),
    undefined: new TokenType("literal/undefined", "undefined"),
    numberLiteral: new TokenType("literal/number", "number-pattern"),
    stringLiteral: new TokenType("literal/string", "string-pattern"),
    // ========== Comment ===========
    singleLineComment: new TokenType("comment/single", "comment-single"),
    multiLineComment: new TokenType("comment/multi", "comment-multi"),
    // ========== ID ===========
    identifier: new TokenType('identifier', 'identifier')
}
/** ======================================================
 *          String Array for Match
 * ========================================================
 */

export const ReservedWords = {
    punctuators: [
        "{", "}",
        "[", "]",
        "(", ")",
        ":", ";",
        "\'", "\"", 
        "#"
    ],
    operator: [
        // Arithmetic operators
        "+", "-", "*", "/", "%", "++", "--", "**",
        // Compare operators
        ">", "<", "==", "!=", "<=", ">=", "===", "!==",
        // Bitwise operators
        "|", "&", "~", "^", "<<", ">>", ">>>",
        // Logical operators
        "||", "&&", "!", "??",
        // Comma operators
        ",",
        // 
        "...",
        // Optional Chaining, Chaining
        "?.", ".",
        // Assignment operator,
        "=", "+=", "-=", "*=", "%=", "**=",
        "|=", "&=", ">>=", "<<=", ">>>=", "^=", "~=",
        "||=", "&&=", "??="
    ],
    BooleanLiteral: ["true", "false"],
    NullLiteral: ["null"],
    UndefinbedLiteral: ["undefined"],
    keywords: [
        "await", "break", "case", "catch", "class",
        "const", "continue", "debugger", "default", "do",
        "else", "enum", "export", "extends", "finally",
        "for", "function", "if", "import", "new",
        "return", "super", "switch", "this", "throw",
        "try", "var", "with", "yield",
        // Unary operators
        "delete", "void", "typeof",
        // Relation operators
        "in", "instanceof",
    ],
    whiteSpaceChars: [" ", "\t"],
    newLineChars: ["\n"],

};
