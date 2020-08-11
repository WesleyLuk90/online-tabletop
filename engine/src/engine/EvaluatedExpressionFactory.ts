import { Either } from "fp-ts/lib/Either";
import { assertExaustive } from "../utils/Exaustive";
import { rightOrThrow } from "../utils/Exceptions";
import { ResolvedExpression, ResolvedValues } from "./ExpressionResolver";
import {
    RollExpression,
    RollFunction,
    RollLiteral,
    RollVariable,
} from "./models/RollDefinition";

export class EvaluatedExpression {
    constructor(readonly expression: RollExpression, readonly value: number) {}
}

type EvaluationError = never;

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
    ): Either<EvaluationError, EvaluatedExpression> {}

    private static evaluate(
        expression: RollExpression,
        values: ResolvedValues
    ) {
        if (expression instanceof RollLiteral) {
            return new EvaluatedExpression(expression, expression.value);
        } else if (expression instanceof RollFunction) {
            return new EvaluatedExpression(expression, expression.value);
        } else if (expression instanceof RollVariable) {
            return new EvaluatedExpression(expression, expression.value);
        } else {
            assertExaustive(expression);
        }
    }
}
