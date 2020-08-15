import * as E from "fp-ts/lib/Either";
import { Either } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { isNone, isSome } from "fp-ts/lib/Option";
import { assertExaustive } from "../utils/Exaustive";
import { rightOrThrow } from "../utils/Exceptions";
import { ResolvedExpression, ResolvedValues } from "./ExpressionResolver";
import { NumberAttribute } from "./models/Attribute";
import {
    RollExpression,
    RollFunction,
    RollLiteral,
    RollVariable,
} from "./models/RollDefinition";
import { getRollFunction } from "./RollFunctions";
import { UnknownFunction, ValidationError } from "./rolls/RollValidator";

export class BaseEvaluation {
    constructor(readonly value: number) {}
}
export class EvaluatedFunction extends BaseEvaluation {
    constructor(
        readonly value: number,
        readonly functionName: string,
        readonly args: EvaluatedExpression[]
    ) {
        super(value);
    }
}
export class EvaluatedVariable extends BaseEvaluation {
    constructor(
        readonly value: number,
        readonly variable: string,
        readonly expression: EvaluatedExpression
    ) {
        super(value);
    }
}
export class EvaluatedLiteral extends BaseEvaluation {
    constructor(readonly value: number) {
        super(value);
    }
}
type EvaluatedExpression =
    | EvaluatedFunction
    | EvaluatedVariable
    | EvaluatedLiteral;

type EvaluationError = ValidationError;

export class EvaluatedExpressionFactory {
    static createChecked(
        resolvedExpression: ResolvedExpression
    ): EvaluatedExpression {
        return rightOrThrow(
            EvaluatedExpressionFactory.create(resolvedExpression)
        );
    }

    static create(
        resolvedExpression: ResolvedExpression
    ): Either<EvaluationError, EvaluatedExpression> {
        return EvaluatedExpressionFactory.evaluate(
            resolvedExpression.expression,
            resolvedExpression.values
        );
    }

    private static evaluate(
        expression: RollExpression,
        values: ResolvedValues
    ): Either<EvaluationError, EvaluatedExpression> {
        if (expression instanceof RollLiteral) {
            return E.right(new EvaluatedLiteral(expression.value));
        } else if (expression instanceof RollVariable) {
            const attribute = values.get(expression.variableName);
            if (attribute == null) {
                throw new Error(
                    `Failed to find variable ${expression.variableName}`
                );
            }
            if (attribute instanceof NumberAttribute) {
                return E.right(
                    new EvaluatedVariable(
                        attribute.value,
                        expression.variableName,
                        new EvaluatedLiteral(attribute.value)
                    )
                );
            }
            const evaluted = EvaluatedExpressionFactory.evaluate(
                attribute.expression,
                values
            );
            return pipe(
                evaluted,
                E.map(
                    (e) =>
                        new EvaluatedVariable(
                            e.value,
                            expression.variableName,
                            e
                        )
                )
            );
        } else if (expression instanceof RollFunction) {
            const rollFunction = getRollFunction(expression.functionName);
            if (isNone(rollFunction)) {
                return E.left(new UnknownFunction(expression.functionName));
            }
            const validation = rollFunction.value.validate(expression.args);
            if (isSome(validation)) {
                return E.left(validation.value);
            }
            const args: EvaluatedExpression[] = [];
            for (let arg of expression.args) {
                const evaluted = EvaluatedExpressionFactory.evaluate(
                    arg,
                    values
                );
                if (E.isLeft(evaluted)) {
                    return evaluted;
                }
                args.push(evaluted.right);
            }
            const evaluted = rollFunction.value.evaluate(
                args.map((a) => a.value)
            );
            return E.right(
                new EvaluatedFunction(evaluted, expression.functionName, args)
            );
        } else {
            assertExaustive(expression);
        }
    }
}
