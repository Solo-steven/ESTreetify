import type {
    VariableDeclarationKindKeywords,
    UnaryOperator, UpdateOperator, BinaryOperator, AssignmentOperator
} from "@/src/tokenizer/tokenType";
import type {ASTType} from "./astType"
/**
 *  NodeBase for Every AST Node must have
 *   - type: AST Type
 *   - location: SourceLocation ?
 */
interface NodeBase {
    type: ASTType;
};
/**
 *  Program := [Statement | ModuleDeclaration]
 */
export interface Program extends NodeBase {
    type: ASTType.Program;
    sourceType: "script" | "module";
    body: [ Statement | ModuleDeclaration ];
}
/**
 *  Identifier also can be a 
 *   1. expression( primary expression)
 *   2. pattern
 */
interface Identifier extends Expression, Pattern{
    type: ASTType.Identifier;
    name: string;
}
/**
 *  Literal := StringLiteral
 *          := NumberLiteral
 *          := BooleanLiteral
 *          := Nulliteral
 *          := UndefinedLiteral
 */
interface Literal extends Expression {};
export interface StringLiteral extends Literal {
    type: ASTType.StringLiteral;
    value: string;
}
export interface NumberLiteral extends Literal {
    type: ASTType.NumberLiteral;
    base: "2" | "10";
    value: number;
}
export interface Nulliteral extends Literal {
    type: ASTType.Nulliteral;
}
export interface UndefinedLiteral extends Literal {
    type: ASTType.UndefinedLiteral;
}
/**  Statement := ExpressionStatement
  *            := BlockStatement
  *            := EmptyStatement
  *            := DebuggerStatement
  *            := WithStatement
  *            := ReturnStatement
  *            := LabeledStatement
  *            := BreakStatement
  *            := ContinueStatement
  *            := IfStatement
  *            := SwitchStatement
  *            := ThrowStatement
  *            := TryStatement
  *            := WhileStatement
  *            := DoWhileStatement
  *            := ForStatement
  *            := ForInStatement
*/
interface Statement extends NodeBase{};
interface BlockStatement extends Statement {
    type: ASTType.BlockStatement;
    body: [ Statement ];
}
type FunctionBody = BlockStatement;
/***
  *  Declaration := FunctionDeclaration
  *              := VariableDeclaration
  *  VariableDeclaration := ['var'|'let'|'const'] [VariableDeclarator]
  *  VariableDeclarator  := id ('=' init)?
*/
interface Declaration extends Statement {};
export interface FunctionDeclaration extends Declaration {
    type: ASTType.FunctionDeclaration;
    id: Identifier;
    params: [ Pattern ];
    body: FunctionBody;
}
export interface VariableDeclaration extends Declaration {
    type: ASTType.VariableDeclaration;
    declarations: [ VariableDeclarator ];
    kind: VariableDeclarationKindKeywords;
}
interface VariableDeclarator extends NodeBase {
    type: ASTType.VariableDeclarator;
    id: Pattern;
    init: Expression | null;
}
/**
  * Expression := Literal
  *            := Identifier
  *            := UnaryExpression
  *            := UpdateExpression
  *            := BinaryExpression
  *            := LogicalExpression
  *            := ConditionalExpression
  *            := AssignmentExpression
  *            := SequenceExpression
  *            := ThisExpression
  *            := ArrayExpression
  *            := ObjectExpression
  *            := FunctionExpression
  *            := MemberExpression
  *            := CallExpression
  *            := NewExpression
  *            := ArrowFunctionExpression
  *            := YieldExpression
  * UnaryExpression         := UnaryOperator Expression
  * UpdateExpression        := Expression UpdateOperator
  * BinaryExpression        := Expression BinaryOperator Expression
  * LogicalExpression       := Expression LogicalOperator Expression
  * ConditionalExpression   := Expression '?' Expression ':' Expression
  * AssignmentExpression    := Expression AssignmentOperator Expression
  * SequenceExpression      := [Expression ',']
  * ArrayExpression         := [Expression]
  * ObjectExpression        := [Property]
  * NewExpression           := 'new' Expression '(' [Expression] ')'
*/
interface Expression extends NodeBase {};
export interface ThisExpression extends Expression {
    type: ASTType.ThisExpression;
}
export interface ArrayExpression extends Expression {
    type: ASTType.ArrayExpression;
    elements: [ Expression | null  | SpreadElement];
}
export interface ObjectExpression extends Expression {
    type: ASTType.ObjectExpression;
    properties: [ Property ];
}
interface Property extends Node {
    type: ASTType.Property;
    key: Literal | Identifier;
    value: Expression;
    kind: "init" | "get" | "set";
    method: boolean;
    shorthand: boolean; // don't what is for.
    computed: boolean; // don't what is for.
}
export interface UnaryExpression extends Expression {
    type: ASTType.UnaryExpression;
    operator: UnaryOperator;
    prefix: boolean;
    argument: Expression;
}
export interface UpdateExpression extends Expression {
    type: ASTType.UpdateExpression;
    operator: UpdateOperator;
    argument: Expression;
    prefix: boolean;
}
export interface BinaryExpression extends Expression {
    type: ASTType.BinaryExpression;
    operator: BinaryOperator;
    left: Expression;
    right: Expression;
}
export interface ConditionalExpression extends Expression {
    type: ASTType.ConditionalExpression;
    test: Expression;
    alternate: Expression;
    consequent: Expression;
}
export interface AssignmentExpression extends Expression {
    type: ASTType.AssginmentExpression;
    operator: AssignmentOperator;
    left: Pattern | Expression;
    right: Expression;
}
export interface SequenceExpression extends Expression {
    type: ASTType.SequenceExpression;
    expressions: [ Expression ];
}
export interface CallExpression extends Expression {
    type: ASTType.CallExpression;
    callee: Expression;
    arguments: [ Expression ];
}
export interface MemberExpression extends Expression {
    type: ASTType.MemberExpression;
    object: Expression;
    property: Expression;
    computed: boolean;
}
export interface NewExpression extends Expression {
    type: ASTType.NewExpression;
    callee: Expression;
    arguments: [ Expression | SpreadElement ];
}
export interface ArrowFunctionExpression extends Function, Expression {
    type: ASTType.ArrowFunctionExpression;
    body: FunctionBody | Expression;
    expression: boolean;
    generator: false;
}
export interface YieldExpression extends Expression {
    type: ASTType.YieldExpression;
    argument: Expression | null;
    delegate: boolean;
}
/**
 *  Pattern := ObjectPattern
 *          := ArrayPattern
 *          := RestElement 
 *          := Identifier
 *  Notes: Pattern in like `BindingPattern` in Spec (https://tc39.es/ecma262/#sec-destructuring-binding-patterns)
 */
interface Pattern extends NodeBase{};
//  ObjectPattern := ['let'| 'const' | 'var'] '{' AssignmentProperty  '}'
//  AssignmentProperty := key (':' value)?
//   ===> example: const { a, b } = object
export interface ObjectPattern extends Pattern {
    type: ASTType.ObjectPattern;
    properties: [ AssignmentProperty ];
}
interface AssignmentProperty extends Property {
    value: Pattern;
    kind: "init";
    method: false;
}
// ArrayPattern = '[' (','| Pattern )  ']'
//   ===> example: const [ a, ,b ] = someArray;
export interface ArrayPattern extends Pattern {
    type: ASTType.ArrayPattern;
    elements: [ Pattern | null ];
}
// 
export interface RestElement extends Pattern {
    type: ASTType.RestElement;
    argument: Pattern;
}
// left-hand-side = right-hand-side '...' argument
export interface SpreadElement extends NodeBase {
    type: ASTType.SpreadElement;
    argument:  Expression;
}
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
interface ModuleDeclaration extends NodeBase {};