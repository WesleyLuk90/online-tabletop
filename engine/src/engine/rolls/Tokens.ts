export class BaseToken {
    constructor(readonly precedence: number = 0) {}
}

export class NumberToken extends BaseToken {
    constructor(readonly number: number) {
        super();
    }
}
export class IdentifierToken extends BaseToken {
    constructor(readonly identifier: string) {
        super();
    }
}
export class RollToken extends BaseToken {
    constructor(
        readonly lhs: number,
        readonly rhs: number,
        readonly roll: string
    ) {
        super();
    }
}
export class PlusToken extends BaseToken {
    constructor() {
        super(1);
    }
}
export class MinusToken extends BaseToken {
    constructor() {
        super(1);
    }
}
export class MultiplyToken extends BaseToken {
    constructor() {
        super(2);
    }
}
export class DivideToken extends BaseToken {
    constructor() {
        super(2);
    }
}
export class LeftParenthesesToken extends BaseToken {
    constructor() {
        super(0);
    }
}
export class RightParenthesesToken extends BaseToken {
    constructor() {
        super(0);
    }
}

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
