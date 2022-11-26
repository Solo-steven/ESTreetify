export enum ASTType {
    /**
     *  Program
     */
    Program ,
    /**
     * Identifier 
     */
    Identifier,
    /**
     *  Literal := StringLiteral
     *          := NumberLiteral
     *          := BooleanLiteral
     *          := Nulliteral
     *          := UndefinedLiteral
    */
    Literal,
    StringLiteral,
    NumberLiteral,
    BooleanLiteral,
    Nulliteral,
    UndefinedLiteral,
    /**  Statement := ExpressionStatement
     *             := BlockStatement
     *             := EmptyStatement
     *             := DebuggerStatement
     *             := WithStatement
     *             := ReturnStatement
     *             := LabeledStatement
     *             := BreakStatement
     *             := ContinueStatement
     *             := IfStatement
     *             := SwitchStatement
     *             := ThrowStatement
     *             := TryStatement
     *             := WhileStatement
     *             := DoWhileStatement
     *             := ForStatement
     *             := ForInStatement
     */
    ExpressionStatement,
    BlockStatement,
    EmptyStatement,
    DebuggerStatement,
    WithStatement,
    ReturnStatement, 
    LabelStatement,
    BreakStatement,
    ContinueStatement,
    IfStatement,
    SwitchStatement,
    ThrowStatement,
    TryStatement,
    WhileStatement,
    DoWhileStatement,
    ForStatement,
    ForInStatement,
    ForOfStatement ,
    /***
     *  Declaration := FunctionDeclaration
     *              := VariableDeclaration
     *  VariableDeclaration := ['var'|'let'|'const'] [VariableDeclarator]
     */
    FunctionDeclaration,
    VariableDeclaration,
    VariableDeclarator,
    /**
     * Expression := ThisExpression
     *            := ArrayExpression
     *            := ObjectExpression
     *            := FunctionExpression
     *            := UnaryExpression
     *            := UpdateExpression
     *            := BinaryExpression
     *            := AssignmentExpression
     *            := LogicalExpression
     *            := MemberExpression
     *            := ConditionalExpression
     *            := CallExpression
     *            := NewExpression
     *            := SequenceExpression
     *            := ArrowFunctionExpression
     *            := YieldExpression
     * ArrayExpression = [Expression]
     * ObjectExpression := [Property]
     * UnaryExpression := UnaryOperator Expression
     * UpdateExpression := Expression UpdateOperator
     * BinaryExpression := Expression BinaryOperator Expression
     * LogicalExpression := Expression LogicalOperator Expression
     * AssignmentExpression := Expression AssignmentOperator Expression
     * ConditionalExpression := Expression '?' Expression ':' Expression
     * NewExpression := 'new' Expression '(' [Expression] ')'
     * SequenceExpression := [Expression ',']
     */
     ThisExpression,
     ArrayExpression,
     ObjectExpression,
     FunctionExpression,
     UnaryExpression,
     UpdateExpression,
     BinaryExpression,
     AssginmentExpression,
     LogicalExpression,
     MemberExpression,
     ConditionalExpression,
     CallExpression,
     NewExpression,
     SequenceExpression,
     ArrowFunctionExpression,
     YieldExpression,
     Property,
     /**
      * Module Declaration := ImportDeclaration
      *                    := ExportDeclaration
      *                    := ExportAllDeclaration
      *                    := ExportDefaultDeclaration
      *  ImportDeclaration := 'import' [ ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier ] 'from' Literal;
      *  ExportNameDeclaration := 'export' [ExportSpecifier] from Literal
      *  ExportAllDeclaration := 'export' '*' from Literal 
      *                       := 'export' '*' 'as' Identifier ] 
      *  ExportDefaultDeclaration := 'export' 'default'[AnonymousDefaultExportedFunctionDeclaration | FunctionDeclaration | AnonymousDefaultExportedClassDeclaration | ClassDeclaration | Expression];
      */
    ImportDeclaration,
    ImportSpecifier,
    ImportDefaultSpecifier,
    ImportNamespaceSpecifier,
    ExportNamedDeclaration,
    ExportSpecifier,
    ExportAllDeclaration,
    ExportDefaultDeclaration,
    AnonymousDefaultExportedFunctionDeclaration,
    AnonymousDefaultExportedClassDeclaration,
    /**
     *  Pattern := ObjectPattern
     *          := ArrayPattern
     *          := RestElement 
     *          := Identifier
     *  ObjectPattern := ['let'| 'const' | 'var'] '{' AssignmentProperty  '}'
     *  AssignmentProperty := key (':' value)?
     *  ArrayPattern = '[' (','| Pattern )  ']'
     */
    ObjectPattern, //  example: const { a, b } = object
    ArrayPattern,
    RestElement,
    SpreadElement, // SpreadElement is not derived from Pattern according to spec, But it like RestElement.
}
