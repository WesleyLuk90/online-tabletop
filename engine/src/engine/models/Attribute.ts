class BaseAttribute {
    constructor(readonly id: string) {}
}

class NumberAttribute extends BaseAttribute {
    constructor(id: string, readonly value: number) {
        super(id);
    }
}

export type Attribute = NumberAttribute;
