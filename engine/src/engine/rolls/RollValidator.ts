import { Either, left, right } from "fp-ts/lib/Either";
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
            const f = getRollFunction(expression.functionName);
            if (isNone(f)) {
                return left(new UnknownFunction(expression.functionName));
            }
            if (!f.value.range.contains(expression.args.length)) {
                return left(new InvalidArguments(expression, f.value.range));
            }
        }
        return right(null);
    }
}
