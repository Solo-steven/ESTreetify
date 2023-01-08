import {TokenType} from "../tokenType";
import {tokenizeIntoOmitTokens, createOmitToken} from "./helper";

describe("operator/plus and incre", () => {
    test("plus(+) concat with identifier", () => {
        expect(
            tokenizeIntoOmitTokens(`
                a + 20;
                a+10;
            `)
        )
        .toEqual(
            [
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
    const increAThenAdd1Prefix = [
        createOmitToken(TokenType.incre, "++"),
        createOmitToken(TokenType.identifier, "a"),
        createOmitToken(TokenType.plus, "+"),
        createOmitToken(TokenType.digitalLiteral, "1"),
        createOmitToken(TokenType.semi, ";"),
    ];
    const increAThenAdd1Postfix = [
        createOmitToken(TokenType.identifier, "a"),
        createOmitToken(TokenType.incre, "++"),
        createOmitToken(TokenType.plus, "+"),
        createOmitToken(TokenType.digitalLiteral, "1"),
        createOmitToken(TokenType.semi, ";"),
    ]
    test("incre(++) operator in postfix or prefix", () => {
        expect(
            tokenizeIntoOmitTokens(`
               ++a + 1;
               ++ a + 1;
               a++ + 1;
               a ++ + 1;
            `)
        ).toEqual(
            [
                ...increAThenAdd1Prefix,
                ...increAThenAdd1Prefix,
                ...increAThenAdd1Postfix,
                ...increAThenAdd1Postfix,
            ]
        )
    });
    test("incre(++) post-operator concat plus(+)", () => {
        expect(
            tokenizeIntoOmitTokens(`
               a+++1;
            `)
        ).toEqual(
            [
                ...increAThenAdd1Postfix,
            ]
        )
    });
    test("incre(++) prefix-operator concat plus(+)", () => {
        expect(
            tokenizeIntoOmitTokens(`
               ++a+1;
            `)
        ).toEqual(
            [
                ...increAThenAdd1Prefix,
            ]
        )
    });
});