import { SourceLocation } from "@/src/utils/location";
/** ======================================================
 *          Token and ToknType Data Type
 * ========================================================
 */
export interface TokenType {
    type: string;
    label: string;
}
export interface Token<T> {
    type: TokenType;
    value: T;
    start: number;
    end: number;
    location: SourceLocation;
};
export interface TokenFactory  {
    <T>(value: T, start: number, end: number, location: SourceLocation): Token<T>;
    is(token: Token<unknown>): boolean;
    type(): TokenType; // For Test Case
}

function createTokenFactory<V = string>(type: string, label: string): TokenFactory {
    const tokenType: TokenType = Object.freeze({ type, label });
    const tokenFactory = <T = V>(
        value: T, start: number, end: number, 
        location: SourceLocation
    ): Token<T> => ({
            type: tokenType,
            value, start, end, location
    });
    tokenFactory.is = (token: Token<unknown>) => token.type === tokenType;
    tokenFactory.type = () => tokenType;
    return tokenFactory;
}

export const TokenFactories  = {
    // ========== Keyword ==========
    await: createTokenFactory("keyword/await", "await"),
    break: createTokenFactory("keyword/break", "break"),
    case: createTokenFactory("keyword/case", "case"),
    catch: createTokenFactory("keyword","catch"),
    class: createTokenFactory("keyword/class", "class"),
    const: createTokenFactory("keyword/const", "const"),
    continue: createTokenFactory("keyword/continue", "continue"),
    debugger: createTokenFactory("keyword/debugger", "debugger"),
    default: createTokenFactory("keyword/default", "default"),
    do: createTokenFactory("keyword/do", "do"),
    else: createTokenFactory("keyword/else", "else"),
    enum: createTokenFactory("keyword/enum", "enum"),
    export: createTokenFactory("keyword/export", "export"),
    extends: createTokenFactory("keyword/extends", "extends"),
    finally: createTokenFactory("keyword/finally", "finally"),
    for: createTokenFactory("keyword/for", "for"),
    function: createTokenFactory("keyword/function", "function"),
    if: createTokenFactory("keyword/if", "if"),
    import: createTokenFactory("keyword/import", "import"),
    new: createTokenFactory("keyword/new", "new"),
    return: createTokenFactory("keyword/new", "new"),
    super: createTokenFactory("keyword/super", "super"),
    switch: createTokenFactory("keyword/switch", "switch"),
    this: createTokenFactory("keyword/this", "this"),
    throw: createTokenFactory("keyword/throw", "throw"),
    try: createTokenFactory("keyword/try", "try"),
    var: createTokenFactory("keyword/var", "var"),
    with: createTokenFactory("keyword/with", "with"),
    yield: createTokenFactory("keyword/yield", "yield"),
    delete: createTokenFactory("keyword/delete", "delete"),
    void: createTokenFactory("keyword/void", "void"),
    typeof: createTokenFactory("keyword/typeof", "typeof"),
    in: createTokenFactory("keyword/in", "in"),
    instanceof: createTokenFactory("keyword/instanceof", "instanceof"),
    let: createTokenFactory("keyword/let", "let"),
    // ========== Punctuators ==========
    bracesLeft: createTokenFactory("punctuator/bracesLeft", "{"),
    bracesRight: createTokenFactory("punctuator/bracesRight", "}"),
    bracketLeft: createTokenFactory("punctuator/bracketLeft", "["),
    bracketRight: createTokenFactory("punctuator/bracketRight", "]"),
    parenthesesLeft: createTokenFactory("punctuator/parenthesesLeft", "("),
    parenthesesRight: createTokenFactory("punctuator/parenthesesRight", ")"),
    singleQuotation: createTokenFactory("punctuator/singleQuotation", "\'"),
    doubleQuotation: createTokenFactory("punctuator/doubleQuotation", "\""),
    semi: createTokenFactory("punctuator/Semi", ";"),
    colon: createTokenFactory("punctuator/colon", ":"),
    hashTag: createTokenFactory("punctuator/HashTag", "#"),
    // ========== Operators ==========
    plus: createTokenFactory("operator/plus", "+"),
    minus: createTokenFactory("operator/mius", "-"),
    divide: createTokenFactory("operator/divide", "/"),
    multiply: createTokenFactory("operator/multiply", "*"),
    mod: createTokenFactory("operator/mod", "%"),
    incre: createTokenFactory("operator/incre", "++"),
    decre:createTokenFactory("operator/decre", "--"),
    expon: createTokenFactory("operator/expon", "**"),
    gt: createTokenFactory("operator/greaterThen", ">"),
    lt: createTokenFactory("operator/lessThen", "<"),
    eq: createTokenFactory("operator/equal", "=="),
    notEq: createTokenFactory("operator/notEqual", "!="),
    geqt: createTokenFactory("operator/greaterOrEqualThen", ">="),
    leqt: createTokenFactory("operator/lessOrEqualThen", "<="),
    strictEq: createTokenFactory("operator/strictEqual", "==="),
    strictNotEq: createTokenFactory("operator/strictNotEqual", "!=="),
    bitwiseOR: createTokenFactory("operator/bitwiseOR", "|"),
    bitwiseAND: createTokenFactory("operator/bitwiseAND", "&"),
    bitewiseNOT: createTokenFactory("operator/bitwiseNOT", "~"),
    bitwiseXOR: createTokenFactory("operator/bitwiseXOR", "^"),
    bitwiseLeftShift: createTokenFactory("operator/bitwiseLeftShift", "<<"),
    bitwiseRightShift: createTokenFactory("operator/bitwisRightShift", ">>"),
    bitwiseRightShiftFill: createTokenFactory("operator/bitwiseRightShiftFill", ">>>"),
    logicalOR: createTokenFactory("operator/logicaOR", "||"),
    logicalAND: createTokenFactory("operator/logicalAND", "&&"),
    logicalNOT: createTokenFactory("operator/logicalNOT", "!"),
    comma: createTokenFactory("operator/comma", ","),
    spread: createTokenFactory("operator/spread", "..."),
    qustion: createTokenFactory("operator/qustion", "?"), // ? :
    qustionDot: createTokenFactory("operatpr/qustionDot", "?."),
    dot: createTokenFactory("operator/dot", "."),
    assgin: createTokenFactory("operator/assignment", "="),
    plusAssign: createTokenFactory("operator/plusAssignment", "+="),
    minusAssign: createTokenFactory("operator/minusAssignment", "-="),
    modAssign: createTokenFactory("operator/modAssignment", "%="),
    divideAssign: createTokenFactory("operator/divideAssignment", "/="),
    multiplyAssign: createTokenFactory("operator/multiplyAssgin", "*="),
    exponAssign: createTokenFactory("operator/exponAssignment", "**="),
    bitwiseORAssgin: createTokenFactory("operator/bitwiseORAssginment", "|="),
    bitwiseANDAssgin: createTokenFactory("operator/bitwiseANDAssginment", "&="),
    bitewiseNOTAssgin: createTokenFactory("operator/bitwiseNOTAssginment", "~="),
    bitwiseXORAssgin: createTokenFactory("operator/bitwiseXORAssginment", "^="),
    logicalORAssign: createTokenFactory("operator/logicaORAssingment", "||="),
    logicalANDAssgin: createTokenFactory("operator/logicalANDAssignment", "&&="),
    bitwiseLeftShiftAssgin: createTokenFactory("operator/bitwiseLeftShiftAssginment", "<<="),
    bitwiseRightShiftAssgin: createTokenFactory("operator/bitwisRightShiftAssginment", ">>="),
    bitwiseRightShiftFillAssgin: createTokenFactory("operator/bitwiseRightShiftFillAssginment", ">>>="),
    // ========== Literal ==========
    true: createTokenFactory("literal/true", "true"),
    false: createTokenFactory("literal/false", "false"),
    null: createTokenFactory("literal/nll", "null"),
    undefined: createTokenFactory("literal/undefined", "undefined"),
    numberLiteral: createTokenFactory("literal/number", "number-pattern"),
    stringLiteral: createTokenFactory("literal/string", "string-pattern"),
    // ========== Comment ===========
    singleLineComment: createTokenFactory("comment/single", "comment-single"),
    multiLineComment: createTokenFactory("comment/multi", "comment-multi"),
    // ========== ID ===========
    identifier: createTokenFactory('identifier', 'identifier'),
    // ========== EOF ==========
    eof: createTokenFactory('eof', 'eof'),
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
        "try", "var", "with", "yield","let",
        // Unary operators
        "delete", "void", "typeof",
        // Relation operators
        "in", "instanceof",
    ]
};

export const UTF8Def = {
    // TODO: more generice defined for utf-8 support
    whiteSpaceChars: [" ", "\t"],
    newLineChars: ["\n"],
    numberChars: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
}

export function composeCharsArray(...argument: Array<Array<string>>) {
    return argument.reduce(
        (pre: Array<string>, cur: Array<string>) => {
            return [...pre, ...cur];
        }, 
        []
    );
}