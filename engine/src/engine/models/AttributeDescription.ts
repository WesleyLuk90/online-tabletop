class BaseAttribute {
    constructor(readonly id: string, readonly name: string) {}
}

export class NumberAttributeDescription extends BaseAttribute {
    static create(id: string, name: string, defaultValue: number = 0) {
        return new NumberAttributeDescription(id, name, defaultValue);
    }

    constructor(id: string, name: string, readonly defaultValue: number) {
        super(id, name);
    }
}

export class StringAttributeDescription extends BaseAttribute {
    static create(id: string, name: string) {
        return new StringAttributeDescription(id, name);
    }
}

export class SubEntityAttributeDescription extends BaseAttribute {
    static create(id: string, name: string, subEntityType: string) {
        return new SubEntityAttributeDescription(id, name, subEntityType);
    }

    constructor(id: string, name: string, readonly subEntityType: string) {
        super(id, name);
    }
}

export type AttributeDescription =
    | NumberAttributeDescription
    | StringAttributeDescription
    | SubEntityAttributeDescription;
