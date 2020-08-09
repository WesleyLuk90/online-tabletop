import { isNone, none } from "fp-ts/lib/Option";
import { NumericAttribute } from "./models/Attribute";
import { ResolvedEntity } from "./References";

export class ResolvedAttribute {
    constructor(
        readonly attribute: NumericAttribute,
        readonly values: Map<string, NumericAttribute>
    ) {}
}

export class AttributeResolver {
    static resolve(entities: ResolvedEntity[], attribute: string) {
        entities.slice();
    }

    private static getAttribute(entity: ResolvedEntity, attributeID: string) {
        const attribute = entity.entityType.attributeDescriptions.get(
            attributeID
        );
        if (isNone(attribute)) {
            return none;
        }
        return entity.attributes().get(attributeID);
    }
}
