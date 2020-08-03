class BaseAttribute {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly description: string
    ) {}
}

export class NumericAttributeDescription extends BaseAttribute {
    constructor(
        id: string,
        name: string,
        description: string,
        readonly defaultValue: number
    ) {
        super(id, name, description);
    }
}
export class StringAttributeDescription extends BaseAttribute {}

export type AttributeDescription =
    | NumericAttributeDescription
    | StringAttributeDescription;
