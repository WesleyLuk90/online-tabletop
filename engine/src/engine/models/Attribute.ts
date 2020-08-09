import { Collection } from "../../utils/Collection";
import { NumberToken } from "../rolls/Tokens";
import { Entity } from "./Entity";
import { RollExpression } from "./RollDefinition";

class BaseAttribute {
    constructor(readonly id: string) {}
}

export class NumberAttribute extends BaseAttribute {
    constructor(id: string, readonly value: number) {
        super(id);
    }
}

export class ComputedAttribute extends BaseAttribute {
    constructor(id: string, readonly expression: RollExpression) {
        super(id);
    }
}

export class SubEntityAttribute extends BaseAttribute {
    static is(t: Attribute): t is SubEntityAttribute {
        return t instanceof SubEntityAttribute;
    }

    constructor(id: string, readonly subEntities: Collection<Entity>) {
        super(id);
    }
}

export type NumericAttribute = NumberAttribute | ComputedAttribute;

export function isNumericAttribute(
    attr: BaseAttribute
): attr is NumericAttribute {
    return attr instanceof NumberToken || attr instanceof ComputedAttribute;
}

export type Attribute =
    | NumberAttribute
    | SubEntityAttribute
    | ComputedAttribute;
