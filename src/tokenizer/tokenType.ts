import { SourceLocation } from "@/src/utils/location";
/**
 *  TokenType is a enum for every token.
 */
export enum TokenType {
    // ============= Keyword ===========
    await = 10010,
    break,
    case,
    catch,
    class,
    const,
    continue,
    debugger,
    default,
    do,
    else,
    enum,
    export,
    extends,
    finally,
    for,
    function,
    if,
    import,
    let,
    new,
    return,
    super,
    switch,
    this,
    throw,
    try,
    var,
    with,
    yield,
    delete,
    void,
    typeof,
    in,
    instanceof,
    // ========== Operators ==========
    plus,
    minus,
    divide,
    multiply,
    mod,
    incre,
    decre,
    expon,
    gt,
    lt,
    eq,
    notEq,
    geqt,
    leqt,
    strictEq,
    strictNotEq,
    bitwiseOR,
    bitwiseAND,
    bitwiseNOT,
    bitwiseXOR,
    bitwiseLeftShift,
    bitwiseRightShift,
    bitwiseRightShiftFill,
    logicalOR,
    logicalAND,
    logicalNOT,
    comma,
    spread,
    qustion, // ? :
    qustionDot,
    dot,
    assgin,
    plusAssign,
    minusAssign,
    modAssign,
    divideAssign,
    multiplyAssign,
    exponAssign,
    bitwiseORAssgin,
    bitwiseANDAssgin,
    bitwiseNOTAssgin,
    bitwiseXORAssgin,
    logicalORAssign,
    logicalANDAssgin,
    bitwiseLeftShiftAssgin,
    bitwiseRightShiftAssgin,
    bitwiseRightShiftFillAssgin,
    // ========== Punctuator ===========
    bracesLeft,
    bracesRight,
    bracketLeft,
    parenthesesLeft,
    parenthesesRight,
    singleQuotation,
    doubleQuotation,
    semi,
    colon,
    hashTag,
    // ========== Literal ===========
    true,
    false,
    null,
    undefined,
    stringLiteral,
    digitalLiteral,
    // =========== Comment =============
    comment,
    blockComment,
    // ========= Identifier ===========
    identifier,
    // ========== EOF ==========
    EOF
}
/**
 *  Token is a terminal for language.
 *  with original position is source code
 *  and type of this token.
 */
export interface Token<T = string> {
    type: TokenType;
    value: T,
    start: number,
    end: number,
    location: SourceLocation;
    source: string;
}
export interface TokenFactory<T = string> {
    (value: T, start: number, end: number, location: SourceLocation, source: string): Token<T>;
}
function createTokenFactory<T = string>(type: TokenType): TokenFactory<T> {
    return (value: T, start: number, end: number, location: SourceLocation, source: string): Token<T> => {
        return { type, value, start, end, location, source};
    }
}
export const TokenFactories = {
    await: createTokenFactory(TokenType.await),
    break: createTokenFactory(TokenType.break),
    case: createTokenFactory(TokenType.case),
    catch: createTokenFactory(TokenType.catch),
    class: createTokenFactory(TokenType.class),
    const: createTokenFactory(TokenType.const),
    continue: createTokenFactory(TokenType.continue),
    debugger: createTokenFactory(TokenType.debugger),
    default: createTokenFactory(TokenType.default),
    do: createTokenFactory(TokenType.do),
    else: createTokenFactory(TokenType.else),
    enum: createTokenFactory(TokenType.enum),
    export: createTokenFactory(TokenType.export),
    extends: createTokenFactory(TokenType.extends),
    finally: createTokenFactory(TokenType.finally),
    for: createTokenFactory(TokenType.for),
    function: createTokenFactory(TokenType.function),
    if: createTokenFactory(TokenType.if),
    import: createTokenFactory(TokenType.import),
    new: createTokenFactory(TokenType.new),
    return: createTokenFactory(TokenType.return),
    super: createTokenFactory(TokenType.super),
    switch: createTokenFactory(TokenType.switch),
    this: createTokenFactory(TokenType.this),
    throw: createTokenFactory(TokenType.throw),
    try: createTokenFactory(TokenType.try),
    var: createTokenFactory(TokenType.var),
    with: createTokenFactory(TokenType.with),
    yield: createTokenFactory(TokenType.yield),
    delete: createTokenFactory(TokenType.delete),
    void: createTokenFactory(TokenType.void),
    typeof: createTokenFactory(TokenType.typeof),
    in: createTokenFactory(TokenType.in),
    instanceof: createTokenFactory(TokenType.instanceof),
    let: createTokenFactory(TokenType.let),
    // ========== Punctuators ==========
    bracesLeft: createTokenFactory(TokenType.bracesLeft),
    bracesRight: createTokenFactory(TokenType.bracesRight),
    bracketLeft: createTokenFactory(TokenType.bracketLeft),
    bracketRight: createTokenFactory(TokenType.bracesRight),
    parenthesesLeft: createTokenFactory(TokenType.parenthesesLeft),
    parenthesesRight: createTokenFactory(TokenType.parenthesesRight),
    singleQuotation: createTokenFactory(TokenType.singleQuotation),
    doubleQuotation: createTokenFactory(TokenType.doubleQuotation),
    semi: createTokenFactory(TokenType.semi),
    colon: createTokenFactory(TokenType.colon),
    hashTag: createTokenFactory(TokenType.hashTag),
    // ========== Operators ==========
    plus: createTokenFactory(TokenType.plus),
    minus: createTokenFactory(TokenType.minus),
    divide: createTokenFactory(TokenType.divide),
    multiply: createTokenFactory(TokenType.multiply),
    mod: createTokenFactory(TokenType.mod),
    incre: createTokenFactory(TokenType.incre),
    decre:createTokenFactory(TokenType.decre),
    expon: createTokenFactory(TokenType.expon),
    gt: createTokenFactory(TokenType.gt),
    lt: createTokenFactory(TokenType.lt),
    eq: createTokenFactory(TokenType.eq),
    notEq: createTokenFactory(TokenType.notEq),
    geqt: createTokenFactory(TokenType.geqt),
    leqt: createTokenFactory(TokenType.leqt),
    strictEq: createTokenFactory(TokenType.strictEq),
    strictNotEq: createTokenFactory(TokenType.strictNotEq),
    bitwiseOR: createTokenFactory(TokenType.bitwiseOR),
    bitwiseAND: createTokenFactory(TokenType.bitwiseAND),
    bitwiseNOT: createTokenFactory(TokenType.bitwiseNOT),
    bitwiseXOR: createTokenFactory(TokenType.bitwiseXOR),
    bitwiseLeftShift: createTokenFactory(TokenType.bitwiseLeftShift),
    bitwiseRightShift: createTokenFactory(TokenType.bitwiseRightShift),
    bitwiseRightShiftFill: createTokenFactory(TokenType.bitwiseRightShiftFill),
    logicalOR: createTokenFactory(TokenType.logicalOR),
    logicalAND: createTokenFactory(TokenType.logicalAND),
    logicalNOT: createTokenFactory(TokenType.logicalNOT),
    comma: createTokenFactory(TokenType.comma),
    spread: createTokenFactory(TokenType.spread),
    qustion: createTokenFactory(TokenType.qustion), // ? :
    qustionDot: createTokenFactory(TokenType.qustionDot),
    dot: createTokenFactory(TokenType.dot),
    assgin: createTokenFactory(TokenType.assgin),
    plusAssign: createTokenFactory(TokenType.plusAssign),
    minusAssign: createTokenFactory(TokenType.minusAssign),
    modAssign: createTokenFactory(TokenType.modAssign),
    divideAssign: createTokenFactory(TokenType.divideAssign),
    multiplyAssign: createTokenFactory(TokenType.multiplyAssign),
    exponAssign: createTokenFactory(TokenType.exponAssign),
    bitwiseORAssgin: createTokenFactory(TokenType.bitwiseORAssgin),
    bitwiseANDAssgin: createTokenFactory(TokenType.bitwiseANDAssgin),
    bitwiseNOTAssgin: createTokenFactory(TokenType.bitwiseNOTAssgin),
    bitwiseXORAssgin: createTokenFactory(TokenType.bitwiseXORAssgin),
    logicalORAssign: createTokenFactory(TokenType.logicalORAssign),
    logicalANDAssgin: createTokenFactory(TokenType.logicalANDAssgin),
    bitwiseLeftShiftAssgin: createTokenFactory(TokenType.bitwiseLeftShiftAssgin),
    bitwiseRightShiftAssgin: createTokenFactory(TokenType.bitwiseRightShiftAssgin),
    bitwiseRightShiftFillAssgin: createTokenFactory(TokenType.bitwiseRightShiftFillAssgin),
    // ========== Literal ==========
    true: createTokenFactory(TokenType.true),
    false: createTokenFactory(TokenType.false),
    null: createTokenFactory(TokenType.null),
    undefined: createTokenFactory(TokenType.undefined),
    stringLiteral: createTokenFactory(TokenType.stringLiteral),
    digitalLiteral: createTokenFactory(TokenType.digitalLiteral),
    // ========== Comment ===========
    comment: createTokenFactory(TokenType.comment),
    blockComment: createTokenFactory(TokenType.blockComment),
    // ========== ID ===========
    identifier: createTokenFactory(TokenType.identifier),
    // ========== EOF ==========
    eof: createTokenFactory(TokenType.EOF),
}

/**
 *  Utils Compsition types and function for declarative.
 */
export type UnaryOperator = 
    TokenType.plus | TokenType.minus |                      // '+', '-'
    TokenType.logicalNOT | TokenType.bitwiseNOT |           // '!', '~'
    TokenType.typeof | TokenType.void | TokenType.delete    // 'typeof', 'void', 'delete'
    ;
export type UpdateOperator = TokenType.incre | TokenType.decre;    // '++', '--'

export type BinaryOperator = 
    TokenType.plus | TokenType.minus | TokenType.multiply | TokenType.divide | TokenType.mod | // '+', '-', '*', '/', '%'
    TokenType.bitwiseAND | TokenType.bitwiseOR | TokenType.bitwiseXOR |                        // '&', '|', '^'
    TokenType.in | TokenType.instanceof |                                                      // 'in', 'instanceof'
    TokenType.eq | TokenType.notEq | TokenType.strictEq | TokenType.strictNotEq |              // '==', '!=', '===', '!=='
    TokenType.geqt | TokenType.leqt |  TokenType.gt | TokenType.lt |                           // '>=', '<=', '>', '<'
    TokenType.bitwiseLeftShift | TokenType.bitwiseRightShift |TokenType.bitwiseRightShiftFill  // '>>', '<<', '>>>'
    ;
export type AssignmentOperator = 
    TokenType.assgin 

export type VariableDeclarationKindKeywords = TokenType.var | TokenType.const | TokenType.let; // 'let', 'var', 'const'


export const BinartOperatorSet = new Set([
    TokenType.plus , TokenType.minus , TokenType.multiply , TokenType.divide , TokenType.mod , // '+', '-', '*', '/', '%'
    TokenType.bitwiseAND , TokenType.bitwiseOR , TokenType.bitwiseXOR ,                        // '&', '|', '^'
    TokenType.in , TokenType.instanceof ,                                                      // 'in', 'instanceof'
    TokenType.eq , TokenType.notEq , TokenType.strictEq , TokenType.strictNotEq ,              // '==', '!=', '===', '!=='
    TokenType.geqt , TokenType.leqt ,  TokenType.gt , TokenType.lt ,                           // '>=', '<=', '>', '<'
    TokenType.bitwiseLeftShift , TokenType.bitwiseRightShift ,TokenType.bitwiseRightShiftFill  // '>>', '<<', '>>>'
]);

export const UnaryOperatorSet = new Set([
    TokenType.plus , TokenType.minus ,                      // '+', '-'
    TokenType.logicalNOT , TokenType.bitwiseNOT ,           // '!', '~'
    TokenType.typeof , TokenType.void , TokenType.delete    // 'typeof', 'void', 'delete'
]);

export const UpdateOperatorSet = new Set([
    TokenType.incre, TokenType.decre                        // '++', '--'
]);
