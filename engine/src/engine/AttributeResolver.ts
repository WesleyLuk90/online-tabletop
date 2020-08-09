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

export class ResolvedAttribute {
    constructor(
        readonly attribute: NumericAttribute,
        readonly values: Map<string, NumericAttribute> = new Map()
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

export class AttributeResolver {
    static resolveChecked(
        entity: CascadingEntity,
        attributeID: string
    ): ResolvedAttribute {
        return rightOrThrow(AttributeResolver.resolve(entity, attributeID));
    }

    static resolve(
        entity: CascadingEntity,
        attributeID: string
    ): Either<ResolutionError, ResolvedAttribute> {
        const first = AttributeResolver.resolveSingle(entity, attributeID);
        if (isLeft(first)) {
            return first;
        }
        const values = new Map<string, NumericAttribute>();
        function recursiveResolve(
            numericAttribute: NumericAttribute,
            trail: string[]
        ): Either<ResolutionError, null> {
            if (numericAttribute instanceof NumberAttribute) {
                return right(null);
            }
            for (let variable of AttributeResolver.gatherVariables(
                numericAttribute.expression
            )) {
                if (trail.includes(variable)) {
                    return left(new RecursiveDefinition(variable, trail));
                }
                const resolved = AttributeResolver.resolveSingle(
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
        const resolve = recursiveResolve(first.right, [first.right.id]);
        if (isLeft(resolve)) {
            return resolve;
        }
        return right(new ResolvedAttribute(first.right, values));
    }

    private static gatherVariables(expression: RollExpression): Set<string> {
        if (expression instanceof RollVariable) {
            return new Set([expression.variableName]);
        } else if (expression instanceof RollFunction) {
            const set = new Set<string>();
            expression.args
                .map(AttributeResolver.gatherVariables)
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
                .map((e) => AttributeResolver.getAttribute(e, attributeID))
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
