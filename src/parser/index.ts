import {Tokenizer, TokenType} from "@/src/tokenizer";
import {BinartOperatorSet, UnaryOperatorSet, UpdateOperatorSet} from "@/src/tokenizer";
import {AST, ASTType} from "@/src/ast";
export class Parser extends Tokenizer  {
    constructor(code: string) {
        super(code);
    }

    /**
     * Public API For Parse Code Into AST
     * @returns 
     */
    parse() {
        // Entry Function
        return this.parseProgram();
        
    }
    private parseProgram() {
        // Parse Directive and ProgramBody
        const body = this.parseProgramBody();
    }
    private parseProgramBody() {
        // Main Loop for parse Statement, Delcaration and Expression.
        const statements: AST.Statement[] = [];
        while(!this.match(TokenType.EOF)) {
            const token = this.get();
            switch(token.type) {
                default: {
                    statements.push(this.parseExpression());
                }
            }
        }
        return statements;
    }
    private parseExpression() {
        const expression = this.parseMaybeAssignmentExpression();
        
        if(this.match(TokenType.comma)) {
            const expressions: Array<AST.Expression> = [];
            while(this.match(TokenType.comma)) {
                const singleExpr = this.parseMaybeAssignmentExpression();
                expressions.push(singleExpr);
            }
            return {
                type: ASTType.ExpressionStatement,
                expression: {
                    type: ASTType.SequenceExpression,
                    expressions,
                }
            }
        }
        return {
            type: ASTType.ExpressionStatement,
            expression,
        }
    }
    private parseMaybeAssignmentExpression() {
        const leftHandSideExpression = this.parseMaybeConditionalExpression();
        if(!this.match(TokenType.assgin)) {
            return leftHandSideExpression;
        }
        const rightHandSideExpression = this.parseMaybeConditionalExpression();
    }
    private parseMaybeConditionalExpression() {
        const testExpression = this.parseBinaryExpression();
    }
    private parseBinaryExpression() {
        const primary = this.parsePrimaryExpression();
        if(this.match(BinartOperatorSet)) {
            return this.parseBinaryOp(primary);
        }
    }
    private parsePrimaryExpression() {
        // parse Update or Unary
        let expression;
        while(this.match(UpdateOperatorSet) || this.match(UpdateOperatorSet)) {
            if(this.match(UpdateOperatorSet)) {
                expression; //
            }

        }
        if(this.match(UnaryOperatorSet) || this.match) {
            const operator = this.next();
        }
    }
    private parseBinaryOp(left: AST.Expression, lastPre: number = 0) {
        
    }

}

export default Parser;