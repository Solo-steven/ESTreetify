import {TokenFactories} from "../type";
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
                createOmitToken(TokenFactories.let.type, "let"),
                createOmitToken(TokenFactories.identifier.type, "a"),
                createOmitToken(TokenFactories.assgin.type, "="),
                createOmitToken(TokenFactories.numberLiteral.type, "10"),
                createOmitToken(TokenFactories.semi.type, ";"),
                createOmitToken(TokenFactories.identifier.type, "a"),
                createOmitToken(TokenFactories.plus.type, "+"),
                createOmitToken(TokenFactories.numberLiteral.type, "20"),
                createOmitToken(TokenFactories.semi.type, ";"),
                createOmitToken(TokenFactories.identifier.type, "a"),
                createOmitToken(TokenFactories.plus.type, "+"),
                createOmitToken(TokenFactories.numberLiteral.type, "10"),
                createOmitToken(TokenFactories.semi.type, ";"),   
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
                createOmitToken(TokenFactories.let.type, "let"),
                createOmitToken(TokenFactories.identifier.type, "a"),
                createOmitToken(TokenFactories.assgin.type, "="),
                createOmitToken(TokenFactories.numberLiteral.type, "10"),
                createOmitToken(TokenFactories.semi.type, ";"),
                createOmitToken(TokenFactories.incre.type, "++"),
                createOmitToken(TokenFactories.identifier.type, "a"),
                createOmitToken(TokenFactories.plus.type, "+"),
                createOmitToken(TokenFactories.numberLiteral.type, "1"),
                createOmitToken(TokenFactories.semi.type, ";"),
                createOmitToken(TokenFactories.incre.type, "++"),
                createOmitToken(TokenFactories.identifier.type, "a"),
                createOmitToken(TokenFactories.plus.type, "+"),
                createOmitToken(TokenFactories.numberLiteral.type, "1"),
                createOmitToken(TokenFactories.semi.type, ";"),
                createOmitToken(TokenFactories.identifier.type, "a"),
                createOmitToken(TokenFactories.incre.type, "++"),
                createOmitToken(TokenFactories.plus.type, "+"),
                createOmitToken(TokenFactories.numberLiteral.type, "1"),
                createOmitToken(TokenFactories.semi.type, ";"),
                createOmitToken(TokenFactories.identifier.type, "a"),
                createOmitToken(TokenFactories.incre.type, "++"),
                createOmitToken(TokenFactories.plus.type, "+"),
                createOmitToken(TokenFactories.numberLiteral.type, "1"),
                createOmitToken(TokenFactories.semi.type, ";"),   
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
                createOmitToken(TokenFactories.let.type, "let"),
                createOmitToken(TokenFactories.identifier.type, "a"),
                createOmitToken(TokenFactories.assgin.type, "="),
                createOmitToken(TokenFactories.numberLiteral.type, "10"),
                createOmitToken(TokenFactories.semi.type, ";"),
                createOmitToken(TokenFactories.identifier.type, "a"),
                createOmitToken(TokenFactories.incre.type, "++"),
                createOmitToken(TokenFactories.plus.type, "+"),
                createOmitToken(TokenFactories.numberLiteral.type, "1"),
                createOmitToken(TokenFactories.semi.type, ";"),
            ]
        )
    });
});