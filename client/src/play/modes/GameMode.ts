import { assert } from "../../util/Assert";
import { checkNotNull } from "../../util/Nullable";
import { Editor } from "./Editor";

export class GameMode {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly entityTypes: EntityType[],
        readonly tokenEntities: TokenEntities[]
    ) {}

    getEntityType(id: string) {
        return checkNotNull(this.entityTypes.find(e => e.id === id));
    }
}

export class EntityType {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly pluralName: string,
        readonly attributes: AttributeDefinition[],
        readonly editor: Editor,
        readonly nameAttributeID: string
    ) {}

    getSubEntityAttribute(id: string): SubEntityAttribute {
        const attribute = checkNotNull(this.attributes.find(a => a.id === id));
        assert(attribute instanceof SubEntityAttribute);
        return attribute;
    }
}

export class NumberAttribute {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly defaultValue?: number
    ) {}
}

export class TextAttribute {
    constructor(readonly id: string, readonly name: string) {}
}

export class RichTextAttribute {
    constructor(readonly id: string, readonly name: string) {}
}

export class SubEntityAttribute {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly subEntityType: string
    ) {}
}

export type AttributeDefinition =
    | NumberAttribute
    | TextAttribute
    | RichTextAttribute
    | SubEntityAttribute;

export class TokenEntities {
    constructor(readonly entityTypeID: string) {}
}
