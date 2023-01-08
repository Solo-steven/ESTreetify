import {TokenType} from "../tokenType";
import {tokenizeIntoOmitTokens, createOmitToken} from "./helper";

describe("assginment/ assignment operator", () => {
    test("declearation a identifier", () => {
        const declaration = [
            createOmitToken(TokenType.let, "let"),
            createOmitToken(TokenType.identifier, "a"),
            createOmitToken(TokenType.assgin, "="),
            createOmitToken(TokenType.digitalLiteral, "10"),
            createOmitToken(TokenType.semi, ";"), 
        ]
        expect(
            tokenizeIntoOmitTokens(`
                let a = 10;
                let a=10;
                let a= 10;
                let a = 10;
            `)
        )
        .toEqual(
            [
                ...declaration,
                ...declaration,
                ...declaration,
                ...declaration
            ]
        )
    })
})