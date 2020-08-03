import { Collection } from "../../utils/Collection";
import { Attribute } from "./Attribute";

export class Entity {
    readonly attributes: Collection<Attribute>;
    readonly actions: Collection<Action>;

    constructor(
        readonly id: string,
        readonly templateId: string,
        attributes?: Collection<Attribute>,
        actions?: Collection<Action>
    ) {
        this.attributes = attributes ?? Collection.empty();
        this.actions = actions ?? Collection.empty();
    }
}
