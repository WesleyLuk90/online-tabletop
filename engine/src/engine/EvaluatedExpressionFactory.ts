import { ValidationError } from "ajv";
import { Either } from "fp-ts/lib/Either";
import { assertExaustive } from "../utils/Exaustive";
import { rightOrThrow } from "../utils/Exceptions";
import { ResolvedExpression, ResolvedValues } from "./ExpressionResolver";
import { NumberAttribute } from "./models/Attribute";
import {
    RollExpression,
    RollLiteral,
    RollVariable,
} from "./models/RollDefinition";

export class EvaluatedExpression {
    constructor(readonly expression: RollExpression, readonly value: number) {}
}

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
    ): Either<EvaluationError, EvaluatedExpression> {}

    private static evaluate(
        expression: RollExpression,
        values: ResolvedValues
    ) {
        if (expression instanceof RollLiteral) {
            return new EvaluatedExpression(expression, expression.value);
        } else if (expression instanceof RollVariable) {
            const attribute = values.get(expression.variableName);
            if (attribute == null) {
                throw new Error(
                    `Failed to find variable ${expression.variableName}`
                );
            }
            if (attribute instanceof NumberAttribute) {
                return new EvaluatedExpression(expression, attribute.value);
            }
            return new EvaluatedExpression(
                expression,
                EvaluatedExpressionFactory.evaluate(
                    attribute.expression,
                    values
                )
            );
        } else if (expression instanceof RollVariable) {
            return new EvaluatedExpression(expression, expression.value);
        } else {
            assertExaustive(expression);
        }
    }
}
