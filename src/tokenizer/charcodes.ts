
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