class BaseAttribute {
    constructor(readonly id: string) {}
}

export class NumberAttribute extends BaseAttribute {
    constructor(id: string, readonly value: number) {
        super(id);
    }
}

export type Attribute = NumberAttribute;
