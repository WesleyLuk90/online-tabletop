import * as t from "io-ts";

export const NumberAttributeSchema = t.strict({
    attributeID: t.string,
    numberValue: t.number
});
export const StringAttributeSchema = t.strict({
    attributeID: t.string,
    stringValue: t.string
});

export const AttributeSchema = t.union([
    NumberAttributeSchema,
    StringAttributeSchema
]);

export type Attribute = t.TypeOf<typeof AttributeSchema>;

export const EntitySchema = t.strict({
    campaignID: t.string,
    entityID: t.string,
    type: t.string,
    version: t.number,
    attributes: t.array(AttributeSchema)
});

export type Entity = t.TypeOf<typeof EntitySchema>;
