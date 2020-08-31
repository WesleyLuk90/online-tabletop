import { iots } from "./iots";
import { RollExpressionDataSchema } from "./RollExpression";

export const NumberAttributeDataSchema = iots.strict({
    id: iots.string,
    value: iots.number,
    _tag: iots.literal("number"),
});
export const ComputedAttributeDataSchema = iots.strict({
    id: iots.string,
    expression: RollExpressionDataSchema,
    _tag: iots.literal("computed"),
});
export const SubEntityAttribute: iots.Type<SubEntityAttribute> = iots.recursion(
    "SubEntityAttribute",
    () =>
        iots.strict({
            id: iots.string,
            subEntities: iots.array(EntityDataSchema),
            _tag: iots.literal("subEntity"),
        })
);

export interface SubEntityAttribute {
    id: string;
    subEntities: EntityData[];
    _tag: "subEntity";
}

export const AttributeDataSchema = iots.strict({
    attribute: iots.union([
        NumberAttributeDataSchema,
        ComputedAttributeDataSchema,
    ]),
});

export const ActionDataSchema = iots.strict({
    id: iots.string,
    name: iots.string,
    description: iots.string,
    rollExpression: RollExpressionDataSchema,
});
export const EntityDataSchema = iots.strict({
    id: iots.string,
    templateId: iots.string,
    attributes: iots.array(AttributeDataSchema),
    actions: iots.array(ActionDataSchema),
});
export interface EntityData extends iots.TypeOf<typeof EntityDataSchema> {}
export const EntityTemplateDataSchema = iots.strict({
    id: iots.string,
    entityType: iots.string,
    attributes: iots.array(AttributeDataSchema),
    actions: iots.array(ActionDataSchema),
});
