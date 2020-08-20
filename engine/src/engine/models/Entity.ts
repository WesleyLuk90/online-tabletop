import { Collection } from "../../utils/Collection";
import { Action } from "./Action";
import { Attribute } from "./Attribute";

export class Entity {
    readonly attributes: Collection<Attribute>;
    readonly actions: Collection<Action>;

    constructor(
        readonly id: string,
        readonly templateId: string,
        readonly type: string,
        attributes?: Collection<Attribute>,
        actions?: Collection<Action>
    ) {
        this.attributes = attributes ?? Collection.empty();
        this.actions = actions ?? Collection.empty();
    }

    copy({
        attributes,
        actions,
    }: {
        attributes?: Collection<Attribute>;
        actions?: Collection<Action>;
    }): Entity {
        return new Entity(
            this.id,
            this.templateId,
            this.type,
            attributes ?? this.attributes,
            actions ?? this.actions
        );
    }
}
