import { Either, isLeft, left, right } from "fp-ts/lib/Either";
import { isNone } from "fp-ts/lib/Option";
import { BaseError } from "../../BaseError";
import { RollExpression, RollFunction } from "../models/RollDefinition";
import { getRollFunction, Range } from "../RollFunctions";

export class UnknownFunction extends BaseError {
    constructor(readonly name: string) {
        super(`Unknown function ${name}`);
    }
}

export class InvalidArguments extends BaseError {
    constructor(readonly expression: RollFunction, readonly range: Range) {
        super(
            `Invalid arguments to ${
                expression.functionName
            } expected ${range.toString()} arguments but got ${
                expression.args.length
            }`
        );
    }
}

export type ValidationError = UnknownFunction | InvalidArguments;

export class RollValidator {
    static validate(expression: RollExpression): Either<ValidationError, null> {
        if (expression instanceof RollFunction) {
            const res = RollValidator.validateFunction(expression);
            if (isLeft(res)) {
                return res;
            }
            for (let arg of expression.args) {
                const argRes = RollValidator.validate(arg);
                if (isLeft(argRes)) {
                    return argRes;
                }
            }
        }
        return right(null);
    }

    static validateFunction(
        rollFunction: RollFunction
    ): Either<ValidationError, null> {
        const f = getRollFunction(rollFunction.functionName);
        if (isNone(f)) {
            return left(new UnknownFunction(rollFunction.functionName));
        }
        if (!f.value.range.contains(rollFunction.args.length)) {
            return left(new InvalidArguments(rollFunction, f.value.range));
        }
        return right(null);
    }
}
