export class NumberToken {
    constructor(readonly number: number) {}
}
export class IdentifierToken {
    constructor(readonly identifier: string) {}
}
export class RollToken {
    constructor(
        readonly lhs: number,
        readonly rhs: number,
        readonly roll: string
    ) {}
}
export class PlusToken {}
export class MinusToken {}
export class MultiplyToken {}
export class DivideToken {}
export class LeftParenthesesToken {}
export class RightParenthesesToken {}

export type Token =
    | NumberToken
    | IdentifierToken
    | RollToken
    | PlusToken
    | MinusToken
    | MultiplyToken
    | DivideToken
    | LeftParenthesesToken
    | RightParenthesesToken;
