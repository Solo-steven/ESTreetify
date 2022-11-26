import {TokenType} from "../tokenType";
import {tokenizeIntoOmitTokens, createOmitToken} from "./helper";

describe("operator/plus and incre", () => {
    test("plus(+) concat with identifier", () => {
        expect(
            tokenizeIntoOmitTokens(`
                let a = 10;
                a + 20;
                a+10;
            `)
        )
        .toEqual(
            [
                createOmitToken(TokenType.let, "let"),
                createOmitToken(TokenType.identifier, "a"),
                createOmitToken(TokenType.assgin, "="),
                createOmitToken(TokenType.digitalLiteral, "10"),
                createOmitToken(TokenType.semi, ";"),
                createOmitToken(TokenType.identifier, "a"),
                createOmitToken(TokenType.plus, "+"),
                createOmitToken(TokenType.digitalLiteral, "20"),
                createOmitToken(TokenType.semi, ";"),
                createOmitToken(TokenType.identifier, "a"),
                createOmitToken(TokenType.plus, "+"),
                createOmitToken(TokenType.digitalLiteral, "10"),
                createOmitToken(TokenType.semi, ";"),   
            ]
        );
    });
    test("incre(++) operator in postfix or prefix", () => {
        expect(
            tokenizeIntoOmitTokens(`
               let a = 10;
               ++a + 1;
               ++ a + 1;
               a++ + 1;
               a ++ + 1;
            `)
        ).toEqual(
            [
                createOmitToken(TokenType.let, "let"),
                createOmitToken(TokenType.identifier, "a"),
                createOmitToken(TokenType.assgin, "="),
                createOmitToken(TokenType.digitalLiteral, "10"),
                createOmitToken(TokenType.semi, ";"),
                createOmitToken(TokenType.incre, "++"),
                createOmitToken(TokenType.identifier, "a"),
                createOmitToken(TokenType.plus, "+"),
                createOmitToken(TokenType.digitalLiteral, "1"),
                createOmitToken(TokenType.semi, ";"),
                createOmitToken(TokenType.incre, "++"),
                createOmitToken(TokenType.identifier, "a"),
                createOmitToken(TokenType.plus, "+"),
                createOmitToken(TokenType.digitalLiteral, "1"),
                createOmitToken(TokenType.semi, ";"),
                createOmitToken(TokenType.identifier, "a"),
                createOmitToken(TokenType.incre, "++"),
                createOmitToken(TokenType.plus, "+"),
                createOmitToken(TokenType.digitalLiteral, "1"),
                createOmitToken(TokenType.semi, ";"),
                createOmitToken(TokenType.identifier, "a"),
                createOmitToken(TokenType.incre, "++"),
                createOmitToken(TokenType.plus, "+"),
                createOmitToken(TokenType.digitalLiteral, "1"),
                createOmitToken(TokenType.semi, ";"),   
            ]
        )
    });
    test("incre(++) operator concat plus(+)", () => {
        expect(
            tokenizeIntoOmitTokens(`
               let a = 10;
               a+++1;
            `)
        ).toEqual(
            [
                createOmitToken(TokenType.let, "let"),
                createOmitToken(TokenType.identifier, "a"),
                createOmitToken(TokenType.assgin, "="),
                createOmitToken(TokenType.digitalLiteral, "10"),
                createOmitToken(TokenType.semi, ";"),
                createOmitToken(TokenType.identifier, "a"),
                createOmitToken(TokenType.incre, "++"),
                createOmitToken(TokenType.plus, "+"),
                createOmitToken(TokenType.digitalLiteral, "1"),
                createOmitToken(TokenType.semi, ";"),
            ]
        )
    });
});