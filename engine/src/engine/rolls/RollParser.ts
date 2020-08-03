import { BaseError } from "../../BaseError";
import { assertExaustive } from "../../utils/Exaustive";
import {
    RollExpression,
    RollFunction,
    RollLiteral,
    RollVariable,
} from "../models/RollDefinition";
import { Tokenizer } from "./Tokenizer";
import {
    DivideToken,
    IdentifierToken,
    LeftParenthesesToken,
    MinusToken,
    MultiplyToken,
    NumberToken,
    PlusToken,
    RightParenthesesToken,
    RollToken,
} from "./Tokens";

type Operator =
    | PlusToken
    | MinusToken
    | DivideToken
    | MultiplyToken
    | LeftParenthesesToken
    | IdentifierToken;

class MissingArgumentError extends BaseError {
    constructor() {
        super("Missing an argument");
    }
}
class MissingOperatorError extends BaseError {
    constructor() {
        super("Missing an operator");
    }
}

class OutputStack {
    private stack: RollExpression[] = [];
    push(output: RollExpression) {
        this.stack.push(output);
    }
    pop(): RollExpression {
        const out = this.stack.pop();
        if (out == null) {
            throw new MissingArgumentError();
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

export class RollParser {
    static parse(expression: string): RollExpression {
        const output = new OutputStack();
        const operators = new OperatorStack();
        const tokens = Tokenizer.tokenize(expression);
        function popOperator(nextOperator?: Operator) {
            for (
                let operator = operators.peak();
                operator != null;
                operator = operators.peak()
            ) {
                operators.pop();
                if (
                    operator == null ||
                    (nextOperator != null &&
                        nextOperator.precedence < operator.precedence)
                ) {
                    return;
                }
                if (operator instanceof PlusToken) {
                    const rhs = output.pop();
                    const lhs = output.pop();
                    output.push(new RollFunction("add", [lhs, rhs]));
                } else if (operator instanceof MinusToken) {
                    const rhs = output.pop();
                    const lhs = output.pop();
                    output.push(new RollFunction("sub", [lhs, rhs]));
                } else if (operator instanceof MultiplyToken) {
                    const rhs = output.pop();
                    const lhs = output.pop();
                    output.push(new RollFunction("mul", [lhs, rhs]));
                } else if (operator instanceof DivideToken) {
                    const rhs = output.pop();
                    const lhs = output.pop();
                    output.push(new RollFunction("div", [lhs, rhs]));
                } else if (operator instanceof LeftParenthesesToken) {
                    return;
                } else {
                    assertExaustive(operator);
                }
            }
        }
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            if (token instanceof NumberToken) {
                output.push(new RollLiteral(token.number));
            } else if (token instanceof IdentifierToken) {
                if (tokens[i + 1] instanceof LeftParenthesesToken) {
                    operators.push(token);
                } else {
                    output.push(new RollVariable(token.identifier));
                }
            } else if (token instanceof RollToken) {
                output.push(
                    new RollFunction("roll", [
                        new RollLiteral(token.lhs),
                        new RollLiteral(token.rhs),
                    ])
                );
            } else if (
                token instanceof PlusToken ||
                token instanceof MinusToken ||
                token instanceof DivideToken ||
                token instanceof MultiplyToken
            ) {
                popOperator(token);
                operators.push(token);
            } else if (token instanceof LeftParenthesesToken) {
                operators.push(token);
            } else if (token instanceof RightParenthesesToken) {
                operators.push(token);
            } else {
                assertExaustive(token);
            }
            console.log(output, operators);
        }
        popOperator();
        return output.pop();
    }
}
