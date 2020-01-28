import * as t from "io-ts";

export const AttributeSchema = t.strict({
    attributeID: t.string,
    numberValue: t.union([t.number, t.undefined]),
    stringValue: t.union([t.string, t.undefined])
});

export type Attribute = t.TypeOf<typeof AttributeSchema>;

export const EntitySchema = t.strict({
    campaignID: t.string,
    entityID: t.string,
    type: t.string,
    version: t.number,
    attributes: t.array(AttributeSchema)
});

export type Entity = t.TypeOf<typeof EntitySchema>;
