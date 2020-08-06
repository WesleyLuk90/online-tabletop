import { left, right } from "fp-ts/lib/Either";
import { Tokenizer, TokenizerError } from "../../src/engine/rolls/Tokenizer";
import {
    DivideToken,
    IdentifierToken,
    LeftParenthesesToken,
    NumberToken,
    PlusToken,
    RightParenthesesToken,
    RollToken,
    WhitespaceToken,
} from "../../src/engine/rolls/Tokens";

describe("Tokenizer", () => {
    it("should tokenize", () => {
        expect(Tokenizer.tokenize("1+ 3d4+ floor(str/2.5)")).toEqual(
            right([
                new NumberToken(1),
                new PlusToken(),
                new WhitespaceToken(),
                new RollToken(3, 4, "d"),
                new PlusToken(),
                new WhitespaceToken(),
                new IdentifierToken("floor"),
                new LeftParenthesesToken(),
                new IdentifierToken("str"),
                new DivideToken(),
                new NumberToken(2.5),
                new RightParenthesesToken(),
            ])
        );
    });

    it("should error", () => {
        expect(Tokenizer.tokenize("123$123")).toEqual(
            left(new TokenizerError("123$123", "$123"))
        );
    });
});
