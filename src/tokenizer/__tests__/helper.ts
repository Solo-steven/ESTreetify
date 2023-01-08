import {Tokenizer} from "../tokenizer";
import {Token, TokenType} from "../tokenType";

type OmitToken = Omit<Token<unknown>, "start" | "end" | "location" | "source">;

export function tokenizeIntoOmitTokens(code: string) {
    const tokens: Array<OmitToken> = [];
    const tokenizer = new Tokenizer(code);
    while(1) {
        const token = tokenizer.next();
        if(token.type === TokenType.EOF) {
            break;
        }
        tokens.push(transformTokenIntoOmitToken(token))
    }
    return tokens;
}

export function createOmitToken<T>(type: TokenType, value: T): OmitToken {
    return { type, value };
}

export function transformTokenIntoOmitToken(token: Token): OmitToken {
    return {
        type: token.type,
        value: token.value,
    }
}