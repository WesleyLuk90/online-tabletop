import { Collection } from "../../utils/Collection";
import { AttributeDescription } from "./AttributeDescription";

export class EntityType {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly description: string,
        readonly attributeDescriptions: Collection<AttributeDescription>
    ) {}
}
