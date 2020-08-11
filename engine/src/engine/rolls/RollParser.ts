import { chain, Either, map, tryCatch } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { BaseError } from "../../BaseError";
import { assertExaustive } from "../../utils/Exaustive";
import { rightOrThrow } from "../../utils/Exceptions";
import {
    RollExpression,
    RollFunction,
    RollLiteral,
    RollVariable,
} from "../models/RollDefinition";
import { RollValidator, ValidationError } from "./RollValidator";
import { Tokenizer, TokenizerError } from "./Tokenizer";
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

class UnaryMinus {
    readonly precedence = 10;
}

type Operator =
    | PlusToken
    | MinusToken
    | DivideToken
    | MultiplyToken
    | LeftParenthesesToken
    | IdentifierToken
    | CommaToken
    | UnaryMinus;

function isOperator(token: Token) {
    return (
        token instanceof PlusToken ||
        token instanceof MinusToken ||
        token instanceof DivideToken ||
        token instanceof MultiplyToken ||
        token instanceof LeftParenthesesToken ||
        token instanceof CommaToken
    );
}

class ParseError extends BaseError {}

class FunctionArguments {
    constructor(
        readonly lhs: ExpressionOrArgs,
        readonly rhs: ExpressionOrArgs
    ) {}

    flatten(): RollExpression[] {
        const lhs =
            this.lhs instanceof FunctionArguments
                ? this.lhs.flatten()
                : [this.lhs];
        const rhs =
            this.rhs instanceof FunctionArguments
                ? this.rhs.flatten()
                : [this.rhs];
        return [...lhs, ...rhs];
    }
}

type ExpressionOrArgs = RollExpression | FunctionArguments;

class OutputStack {
    private stack: ExpressionOrArgs[] = [];
    push(output: ExpressionOrArgs) {
        this.stack.push(output);
    }
    popExpression(): RollExpression {
        const out = this.pop();
        if (out instanceof FunctionArguments) {
            throw new ParseError("Unexpected function arguments");
        }
        return out;
    }

    pop(): ExpressionOrArgs {
        const out = this.stack.pop();
        if (out == null) {
            throw new ParseError("Missing argument");
        }
        return out;
    }
}

class OperatorStack {
    private stack: Operator[] = [];
    push(output: Operator) {
        this.stack.push(output);
    }
    pop(): Operator | null {
        const out = this.stack.pop();
        return out ?? null;
    }
    peak(): Operator | null {
        const out = this.stack[this.stack.length - 1];
        return out ?? null;
    }
}

type ParseOrTokenizeError = TokenizerError | ParseError | ValidationError;

export class RollParser {
    static parse(expression: string): Either<ParseError, RollExpression> {
        return pipe(
            Tokenizer.tokenize(expression),
            chain((tokens) =>
                tryCatch(
                    () => new RollParser(tokens).parse(),
                    (a) => a as ParseError
                )
            ),
            chain((exp) =>
                pipe(
                    RollValidator.validate(exp),
                    map(() => exp)
                )
            )
        );
    }

    static parseChecked(expression: string): RollExpression {
        return rightOrThrow(RollParser.parse(expression));
    }

    private output = new OutputStack();
    private operators = new OperatorStack();

    private constructor(private tokens: Token[]) {}

    private shiftOperatorToOutput(operator: Operator) {
        if (operator instanceof PlusToken) {
            const rhs = this.output.popExpression();
            const lhs = this.output.popExpression();
            this.output.push(new RollFunction("add", [lhs, rhs]));
        } else if (operator instanceof MinusToken) {
            const rhs = this.output.popExpression();
            const lhs = this.output.popExpression();
            this.output.push(new RollFunction("sub", [lhs, rhs]));
        } else if (operator instanceof MultiplyToken) {
            const rhs = this.output.popExpression();
            const lhs = this.output.popExpression();
            this.output.push(new RollFunction("mul", [lhs, rhs]));
        } else if (operator instanceof DivideToken) {
            const rhs = this.output.popExpression();
            const lhs = this.output.popExpression();
            this.output.push(new RollFunction("div", [lhs, rhs]));
        } else if (operator instanceof IdentifierToken) {
            const args = this.output.pop();
            if (args instanceof FunctionArguments) {
                this.output.push(
                    new RollFunction(operator.identifier, args.flatten())
                );
            } else {
                this.output.push(new RollFunction(operator.identifier, [args]));
            }
        } else if (operator instanceof LeftParenthesesToken) {
            throw new ParseError("Extra left parenthesis");
        } else if (operator instanceof CommaToken) {
            const rhs = this.output.pop();
            const lhs = this.output.pop();
            this.output.push(new FunctionArguments(lhs, rhs));
        } else if (operator instanceof UnaryMinus) {
            const value = this.output.popExpression();
            this.output.push(new RollFunction("neg", [value]));
        } else {
            assertExaustive(operator);
        }
    }

    private processOperatorWithPrecedence(nextOperator: Operator) {
        for (
            let operator = this.operators.peak();
            operator != null;
            operator = this.operators.peak()
        ) {
            if (
                operator == null ||
                nextOperator.precedence >= operator.precedence
            ) {
                return;
            }
            this.operators.pop();
            this.shiftOperatorToOutput(operator);
        }
    }

    private popParenthesis() {
        for (
            let operator = this.operators.peak();
            !(operator instanceof LeftParenthesesToken);
            operator = this.operators.peak()
        ) {
            if (operator == null) {
                throw new ParseError("Extra right parenthesis");
            }
            this.operators.pop();
            this.shiftOperatorToOutput(operator);
        }
        this.operators.pop();
    }

    private parse(): RollExpression {
        for (let i = 0; i < this.tokens.length; i++) {
            const token = this.tokens[i];
            if (token instanceof NumberToken) {
                this.output.push(new RollLiteral(token.number));
            } else if (token instanceof IdentifierToken) {
                if (this.tokens[i + 1] instanceof LeftParenthesesToken) {
                    this.operators.push(token);
                } else {
                    this.output.push(new RollVariable(token.identifier));
                }
            } else if (token instanceof RollToken) {
                this.output.push(
                    new RollFunction("roll", [
                        new RollLiteral(token.lhs),
                        new RollLiteral(token.rhs),
                    ])
                );
            } else if (
                token instanceof PlusToken ||
                (token instanceof MinusToken &&
                    i != 0 &&
                    !isOperator(this.tokens[i - 1])) ||
                token instanceof DivideToken ||
                token instanceof MultiplyToken ||
                token instanceof CommaToken
            ) {
                this.processOperatorWithPrecedence(token);
                this.operators.push(token);
            } else if (token instanceof MinusToken) {
                this.operators.push(new UnaryMinus());
            } else if (token instanceof LeftParenthesesToken) {
                this.operators.push(token);
            } else if (token instanceof RightParenthesesToken) {
                this.popParenthesis();
            } else if (token instanceof WhitespaceToken) {
            } else {
                assertExaustive(token);
            }
        }
        let operator: Operator | null = null;
        while ((operator = this.operators.pop())) {
            this.shiftOperatorToOutput(operator);
        }
        return this.output.popExpression();
    }
}
