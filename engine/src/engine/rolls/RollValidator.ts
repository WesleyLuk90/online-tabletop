import { Either, isLeft, left, right } from "fp-ts/lib/Either";
import { isNone, isSome } from "fp-ts/lib/Option";
import { BaseError } from "../../BaseError";
import { RollExpression, RollFunction } from "../models/RollDefinition";
import { getRollFunction, Range } from "../RollFunctions";

export class UnknownFunction extends BaseError {
    constructor(readonly name: string) {
        super(`Unknown function ${name}`);
    }
}

export class InvalidArguments extends BaseError {
    constructor(
        readonly functionName: string,
        readonly range: Range,
        readonly argCount: number
    ) {
        super(
            `Invalid arguments to ${functionName} expected ${range.toString()} arguments but got ${argCount}`
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
        const argValidation = f.value.validate(rollFunction.args);
        if (isSome(argValidation)) {
            return left(argValidation.value);
        }
        return right(null);
    }
}
