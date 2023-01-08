import {TokenType} from "../tokenType";
import {Tokenizer} from "../tokenizer";
import {createOmitToken, transformTokenIntoOmitToken} from "./helper";

describe("lookhead/lookhead and get public api", () => {
    test("Get twice then lookhead", () => {
        const code = `let a = 10`;
        const tokenizer = new Tokenizer(code);
        const tokens: Array<any> = [];
        tokens.push(transformTokenIntoOmitToken(tokenizer.next()));
        tokens.push(transformTokenIntoOmitToken(tokenizer.get()));
        tokens.push(transformTokenIntoOmitToken(tokenizer.lookhead()));
        tokens.push(transformTokenIntoOmitToken(tokenizer.next()));
        tokens.push(transformTokenIntoOmitToken(tokenizer.get()));

        expect(tokens)
            .toEqual(
                [
                    createOmitToken(TokenType.let, "let"),
                    createOmitToken(TokenType.identifier, "a"),
                    createOmitToken(TokenType.assgin, "="),
                    createOmitToken(TokenType.identifier, "a"),
                    createOmitToken(TokenType.assgin, "="),
                ]
            )
    });
})