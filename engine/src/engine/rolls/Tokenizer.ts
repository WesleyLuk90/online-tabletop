import { Either, left, right } from "fp-ts/Either";
import { BaseError } from "../../BaseError";
import { notNull } from "../../utils/Nullable";
import {
    CommaToken,
    DivideToken,
    IdentifierToken,
    LeftParenthesesToken,
    MinusToken,
    MultiplyToken,
    NumberToken,
    PlusToken,
    RightParenthesesToken,
    RollToken,
    Token,
    WhitespaceToken,
} from "./Tokens";

class Match {
    constructor(readonly match: RegExpMatchArray, readonly token: Token) {}
}

function createMatcher(regex: RegExp, factory: (e: RegExpMatchArray) => Token) {
    return (e: string) => {
        const match = e.match(regex);
        if (match != null && match[0].length > 0) {
            return new Match(match, factory(match));
        } else {
            return null;
        }
    };
}

const TokenMakers = [
    createMatcher(/^([0-9]+)/, (s) => new NumberToken(parseFloat(s[1]))),
    createMatcher(/^\+/, (s) => new PlusToken()),
    createMatcher(/^\-/, (s) => new MinusToken()),
    createMatcher(/^\//, (s) => new DivideToken()),
    createMatcher(/^\*/, (s) => new MultiplyToken()),
    createMatcher(/^,/, (s) => new CommaToken()),
    createMatcher(/^\(/, (s) => new LeftParenthesesToken()),
    createMatcher(/^\)/, (s) => new RightParenthesesToken()),
    createMatcher(/^([a-z_][\w_]+)/, (s) => new IdentifierToken(s[1])),
    createMatcher(
        /^(\d+)(d)(\d+)/,
        (s) => new RollToken(parseInt(s[1]), parseInt(s[3]), s[2])
    ),
    createMatcher(/^\s+/, (s) => new WhitespaceToken()),
];

export class TokenizerError extends BaseError {
    constructor(readonly expression: string, readonly rest: string) {
        super(
            `Failed to token string "${expression.slice(
                0,
                100
            )}" failed at "${rest.slice(0, 100)}"`
        );
    }
}

export class Tokenizer {
    static tokenize(expression: string): Either<TokenizerError, Token[]> {
        let rest = expression;
        const tokens = [];
        while (rest !== "") {
            const matches = TokenMakers.map((maker) => maker(rest))
                .filter(notNull)
                .sort((a, b) => b.match[0].length - a.match[0].length);
            const match = matches[0];
            if (match == null) {
                return left(new TokenizerError(expression, rest));
            }
            tokens.push(match.token);
            rest = rest.slice(match.match[0].length);
        }
        return right(tokens);
    }
}
