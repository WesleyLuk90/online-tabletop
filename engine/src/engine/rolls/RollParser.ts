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
    WhitespaceToken,
} from "./Tokens";

type Operator =
    | PlusToken
    | MinusToken
    | DivideToken
    | MultiplyToken
    | LeftParenthesesToken
    | IdentifierToken
    | CommaToken;

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
            throw new Error("Unexpected function arguments");
        }
        return out;
    }

    pop(): ExpressionOrArgs {
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
        function shiftOperatorToOutput(operator: Operator) {
            if (operator instanceof PlusToken) {
                const rhs = output.popExpression();
                const lhs = output.popExpression();
                output.push(new RollFunction("add", [lhs, rhs]));
            } else if (operator instanceof MinusToken) {
                const rhs = output.popExpression();
                const lhs = output.popExpression();
                output.push(new RollFunction("sub", [lhs, rhs]));
            } else if (operator instanceof MultiplyToken) {
                const rhs = output.popExpression();
                const lhs = output.popExpression();
                output.push(new RollFunction("mul", [lhs, rhs]));
            } else if (operator instanceof DivideToken) {
                const rhs = output.popExpression();
                const lhs = output.popExpression();
                output.push(new RollFunction("div", [lhs, rhs]));
            } else if (operator instanceof IdentifierToken) {
                const args = output.pop();
                if (args instanceof FunctionArguments) {
                    output.push(
                        new RollFunction(operator.identifier, args.flatten())
                    );
                } else {
                    output.push(new RollFunction(operator.identifier, [args]));
                }
            } else if (operator instanceof LeftParenthesesToken) {
                return;
            } else if (operator instanceof CommaToken) {
                const rhs = output.pop();
                const lhs = output.pop();
                output.push(new FunctionArguments(lhs, rhs));
            } else {
                assertExaustive(operator);
            }
        }
        function processOperatorWithPrecedence(nextOperator: Operator) {
            for (
                let operator = operators.peak();
                operator != null;
                operator = operators.peak()
            ) {
                if (
                    operator == null ||
                    nextOperator.precedence >= operator.precedence
                ) {
                    return;
                }
                operators.pop();
                shiftOperatorToOutput(operator);
            }
        }
        function popParenthesis() {
            for (
                let operator = operators.peak();
                !(operator instanceof LeftParenthesesToken);
                operator = operators.peak()
            ) {
                if (operator == null) {
                    throw new Error("Unbalanced parenthesis");
                }
                operators.pop();
                shiftOperatorToOutput(operator);
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
                token instanceof MultiplyToken ||
                token instanceof CommaToken
            ) {
                processOperatorWithPrecedence(token);
                operators.push(token);
            } else if (token instanceof LeftParenthesesToken) {
                operators.push(token);
            } else if (token instanceof RightParenthesesToken) {
                popParenthesis();
            } else if (token instanceof WhitespaceToken) {
            } else {
                assertExaustive(token);
            }
        }
        let operator: Operator | null = null;
        while ((operator = operators.pop())) {
            shiftOperatorToOutput(operator);
        }
        return output.popExpression();
    }
}
