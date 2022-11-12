
type Program = "Program";
type Identifier = "Identifier";
type Literal = "Literal";
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
type Statement = ExpressionStatement |
                 BlockStatement |
                 EmptyStatement |
                 DebuggerStatement |
                 WithStatement |
                 ReturnStatement | 
                 LabelStatement |
                 BreakStatement |
                 ContinueStatement |
                 IfStatement |
                 SwitchStatement |
                 ThrowStatement |
                 TryStatement |
                 WhileStatement |
                 DoWhileStatement |
                 ForStatement |
                 ForInStatement |
                 ForOfStatement 
                 ;
type ExpressionStatement = "ExpressionStatement";
type BlockStatement = "BlockStatement";
type EmptyStatement = "EmptyStatement";
type DebuggerStatement = "DebuggerStatement";
type WithStatement = "WithStatement";
type ReturnStatement = "ReturnStatement";
type LabelStatement = "LabelStatement";
type BreakStatement = "BreakStatement";
type ContinueStatement = "ContinueStatement";
type IfStatement =  "IfStatement";
type SwitchStatement = "SwitchStatement";
type ThrowStatement = "ThrowStatement";
type TryStatement = "TryStatement";
type WhileStatement = "WhileStatement";
type DoWhileStatement = "DoWhileStatement";
type ForStatement = "ForStatement";
type ForInStatement = "ForInStatement";
type ForOfStatement = "ForOfStatement";
/***
 *  Declaration := FunctionDeclaration
 *              := VariableDeclaration
 */
type Declaration = FunctionDeclaration |
                   VariableDeclaration;
type FunctionDeclaration = "FunctionDeclaration";
type VariableDeclaration = "VariableDeclaration";
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
 */
type Expression = ArrayExpression |
                  ObjectExpression |
                  FunctionExpression |
                  UnaryExpression |
                  UpdateExpression |
                  BinaryExpression |
                  AssginmentExpression |
                  LogicalExpression |
                  MemberExpression |
                  ConditionalExpression |
                  CallExpression |
                  NewExpression |
                  SequenceExpression 
                  ;
type ArrayExpression = "ArrayExpression";
type ObjectExpression = "ObjectExpression";
type FunctionExpression = "FunctionExpression";
type UnaryExpression = "UnaryExpression";
type UpdateExpression = "UpdateExpression";
type BinaryExpression = "BinaryExpression";
type AssginmentExpression = "AssignmentExpression";
type LogicalExpression = "LogicalExpression";
type MemberExpression = "MemberExpression";
type ConditionalExpression = "ConditionalExpression";
type CallExpression = "CallExpression";
type NewExpression = "NewExpression";
type SequenceExpression = "SequenceExpression";
/**
 * Exoport Entry
 */
export type ASTTypes = Program | Statement | Declaration | Expression | Identifier | Literal;