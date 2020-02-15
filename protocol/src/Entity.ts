import * as t from "io-ts";

export const NumberAttributeSchema = t.strict({
    attributeID: t.string,
    numberValue: t.number
});
export const StringAttributeSchema = t.strict({
    attributeID: t.string,
    stringValue: t.string
});

interface SubEntityAttribute {
    attributeID: string;
    entities: SubEntity[];
}

export const SubEntityAttributeSchema: t.Type<SubEntityAttribute> = t.recursion(
    "SubEntityAttribute",
    () =>
        t.strict({
            attributeID: t.string,
            entities: t.array(SubEntitySchema)
        })
);

export const AttributeSchema = t.union([
    NumberAttributeSchema,
    StringAttributeSchema,
    SubEntityAttributeSchema
]);

export type Attribute = t.TypeOf<typeof AttributeSchema>;

export interface SubEntity {
    entityID: string;
    type: string;
    attributes: Attribute[];
}

export const SubEntitySchema: t.Type<SubEntity> = t.recursion("SubEntity", () =>
    t.strict({
        entityID: t.string,
        type: t.string,
        attributes: t.array(AttributeSchema)
    })
);

export const EntitySchema = t.intersection([
    SubEntitySchema,
    t.strict({
        campaignID: t.string,
        version: t.number
    })
]);

export type Entity = t.TypeOf<typeof EntitySchema>;
