import {Tokenizer} from "../index";
import {TokenFactories} from "../type";
import type {Token, TokenFactory} from "../type";

type OmitToken = Omit<Token<unknown>, "start" | "end" | "location">;

export function tokenizeIntoOmitTokens(code: string) {
    const tokens: Array<OmitToken> = [];
    const tokenizer = new Tokenizer(code);
    while(1) {
        const token = tokenizer.getToken();
        if(TokenFactories.eof.is(token)) {
            break;
        }
        tokens.push({
            type: token.type,
            value: token.value,
        })
    }
    return tokens;
}

export function createOmitToken(typeFun: TokenFactory['type'], value: string): OmitToken {
    return { type: typeFun(), value };
}