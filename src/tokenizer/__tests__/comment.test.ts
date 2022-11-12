import {TokenFactories} from "../type";
import {tokenizeIntoOmitTokens, createOmitToken} from "./helper";

describe("comment/single-line-comment", () => {
    test("single-line-comment", () => {
        expect(
            tokenizeIntoOmitTokens(`
                // Start With Comment  
                let a = 10; --a;
            `)
        )
        .toEqual(
            [
                createOmitToken(TokenFactories.singleLineComment.type, " Start With Comment  "),
                createOmitToken(TokenFactories.let.type, "let"),
                createOmitToken(TokenFactories.identifier.type, "a"),
                createOmitToken(TokenFactories.assgin.type, "="),
                createOmitToken(TokenFactories.numberLiteral.type, "10"),
                createOmitToken(TokenFactories.semi.type, ";"),
                createOmitToken(TokenFactories.decre.type, "--"),
                createOmitToken(TokenFactories.identifier.type, "a"),
                createOmitToken(TokenFactories.semi.type, ";"),
            ]
        )
    }) 
});

describe("comment/multi-line-comment", () => {
    test("multi-line-comment", () => {
        expect(
            tokenizeIntoOmitTokens(`
                /*
                    start With Some thing
                    // End With Some Thing
                    * Other Thing
                */
                let a = 10;
            `)
        )
        .toEqual(
            [
                createOmitToken(TokenFactories.multiLineComment.type, "\n\                    start With Some thing\n                    // End With Some Thing\n                    * Other Thing\n                "),
                createOmitToken(TokenFactories.let.type, "let"),
                createOmitToken(TokenFactories.identifier.type, "a"),
                createOmitToken(TokenFactories.assgin.type, "="),
                createOmitToken(TokenFactories.numberLiteral.type, "10"),
                createOmitToken(TokenFactories.semi.type, ";"),
            ]
        )
    }) 
});