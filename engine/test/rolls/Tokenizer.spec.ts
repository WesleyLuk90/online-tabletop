import { Tokenizer } from "../../src/engine/rolls/Tokenizer";
import {
    DivideToken,
    IdentifierToken,
    LeftParenthesesToken,
    NumberToken,
    PlusToken,
    RightParenthesesToken,
    RollToken,
} from "../../src/engine/rolls/Tokens";

describe("Tokenizer", () => {
    it("should tokenzie", () => {
        expect(Tokenizer.tokenize("1+ 3d4+ floor(str/2)")).toEqual([
            new NumberToken(1),
            new PlusToken(),
            new RollToken(3, 4, "d"),
            new PlusToken(),
            new IdentifierToken("floor"),
            new LeftParenthesesToken(),
            new IdentifierToken("str"),
            new DivideToken(),
            new NumberToken(2),
            new RightParenthesesToken(),
        ]);
    });
});
