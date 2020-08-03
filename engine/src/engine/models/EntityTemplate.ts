import { Collection } from "../../utils/Collection";
import { Attribute } from "./Attribute";

export class EntityTemplate {
    constructor(
        readonly id: string,
        readonly entityType: string,
        readonly attributes: Collection<Attribute>
    ) {}
}
