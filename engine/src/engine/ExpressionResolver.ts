import { Either, fromNullable, isLeft, left, right } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import {
    alt,
    filter,
    isNone,
    isSome,
    none,
    Option,
    some,
} from "fp-ts/lib/Option";
import { BaseError } from "../BaseError";
import { assertExaustive } from "../utils/Exaustive";
import { rightOrThrow } from "../utils/Exceptions";
import {
    ComputedAttribute,
    isNumericAttribute,
    NumberAttribute,
    NumericAttribute,
} from "./models/Attribute";
import {
    ComputedAttributeDescription,
    NumberAttributeDescription,
} from "./models/AttributeDescription";
import {
    RollExpression,
    RollFunction,
    RollLiteral,
    RollVariable,
} from "./models/RollDefinition";
import { CascadingEntity, ResolvedEntity } from "./References";

export class ResolvedValues extends Map<string, NumericAttribute> {
    static create(...attributes: NumericAttribute[]): ResolvedValues {
        return new Map(attributes.map((attr) => [attr.id, attr]));
    }
}

export class ResolvedExpression {
    constructor(
        readonly expression: RollExpression,
        readonly values: ResolvedValues
    ) {}
}

export class AttributeNotFound extends BaseError {
    constructor(readonly id: string) {
        super(`An attribute with id ${id} was not found`);
    }
}

export class NonNumericAttribute extends BaseError {
    constructor(readonly id: string) {
        super(`Attribute ${id} is not numeric`);
    }
}

export class RecursiveDefinition extends BaseError {
    constructor(readonly id: string, readonly trail: string[]) {
        super(
            `Attribute ${id} is defined recursively ${[...trail, id].join(
                "->"
            )}`
        );
    }
}

type ResolutionError =
    | AttributeNotFound
    | NonNumericAttribute
    | RecursiveDefinition;

export class ExpressionResolver {
    static resolveChecked(
        entity: CascadingEntity,
        rollExpression: RollExpression
    ): ResolvedExpression {
        return rightOrThrow(ExpressionResolver.resolve(entity, rollExpression));
    }

    static resolve(
        entity: CascadingEntity,
        rollExpression: RollExpression
    ): Either<ResolutionError, ResolvedExpression> {
        const values = new Map<string, NumericAttribute>();
        function recursiveResolve(
            numericAttribute: NumericAttribute,
            trail: string[]
        ): Either<ResolutionError, null> {
            if (numericAttribute instanceof NumberAttribute) {
                return right(null);
            }
            for (let variable of ExpressionResolver.gatherVariables(
                numericAttribute.expression
            )) {
                if (trail.includes(variable)) {
                    return left(new RecursiveDefinition(variable, trail));
                }
                const resolved = ExpressionResolver.resolveSingle(
                    entity,
                    variable
                );
                if (isLeft(resolved)) {
                    return resolved;
                }
                values.set(variable, resolved.right);
                const recurisve = recursiveResolve(resolved.right, [
                    ...trail,
                    variable,
                ]);
                if (isLeft(recurisve)) {
                    return recurisve;
                }
            }
            return right(null);
        }
        for (let variable of ExpressionResolver.gatherVariables(
            rollExpression
        )) {
            const attribute = ExpressionResolver.resolveSingle(
                entity,
                variable
            );
            if (isLeft(attribute)) {
                return attribute;
            }
            values.set(variable, attribute.right);
            const resolution = recursiveResolve(attribute.right, [variable]);
            if (isLeft(resolution)) {
                return resolution;
            }
        }
        return right(new ResolvedExpression(rollExpression, values));
    }

    private static gatherVariables(expression: RollExpression): Set<string> {
        if (expression instanceof RollVariable) {
            return new Set([expression.variableName]);
        } else if (expression instanceof RollFunction) {
            const set = new Set<string>();
            expression.args
                .map(ExpressionResolver.gatherVariables)
                .map((variables) =>
                    variables.forEach((variable) => set.add(variable))
                );
            return set;
        } else if (expression instanceof RollLiteral) {
            return new Set();
        } else {
            return assertExaustive(expression);
        }
    }

    private static resolveSingle(
        entity: CascadingEntity,
        attributeID: string
    ): Either<ResolutionError, NumericAttribute> {
        return pipe(
            entity
                .byPriority()
                .map((e) => ExpressionResolver.getAttribute(e, attributeID))
                .filter(isSome)[0]?.value,
            fromNullable(new AttributeNotFound(attributeID))
        );
    }

    private static getAttribute(
        entity: ResolvedEntity,
        attributeID: string
    ): Option<NumericAttribute> {
        const maybeAttribute = entity.entityType.attributeDescriptions.get(
            attributeID
        );
        if (isNone(maybeAttribute)) {
            return none;
        }
        const attribute = maybeAttribute.value;
        return pipe(
            entity.attributes().get(attributeID),
            filter(isNumericAttribute),
            alt<NumericAttribute>(() => {
                if (attribute instanceof NumberAttributeDescription) {
                    return some(
                        new NumberAttribute(attributeID, attribute.defaultValue)
                    );
                } else if (attribute instanceof ComputedAttributeDescription) {
                    return some(
                        new ComputedAttribute(attributeID, attribute.expression)
                    );
                }
                return none;
            })
        );
    }
}
