import { Collection } from "../../utils/Collection";
import { Entity } from "./Entity";

class BaseAttribute {
    constructor(readonly id: string) {}
}

export class NumberAttribute extends BaseAttribute {
    constructor(id: string, readonly value: number) {
        super(id);
    }
}

export class SubEntityAttribute extends BaseAttribute {
    constructor(id: string, readonly subEntities: Collection<Entity>) {
        super(id);
    }
}

export type Attribute = NumberAttribute | SubEntityAttribute;
