import { Collection } from "../../utils/Collection";
import { Attribute } from "./Attribute";

export class Entity {
    constructor(
        readonly id: string,
        readonly templateId: string,
        readonly attributes: Collection<Attribute>
    ) {}
}
