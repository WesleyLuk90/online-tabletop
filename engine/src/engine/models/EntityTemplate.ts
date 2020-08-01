import { Collection } from "../../utils/Collection";
import { Attribute } from "./Attribute";

export class EntityTemplate {
    constructor(
        readonly id: string,
        readonly attributes: Collection<Attribute>
    ) {}
}
