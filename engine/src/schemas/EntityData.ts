import { iots } from "./iots";

export const AttributeDataSchema = iots.strict({});
export const ActionDataSchema = iots.strict({});
export const EntityDataSchema = iots.strict({
    id: iots.string,
    templateId: iots.string,
    attributes: iots.array(AttributeDataSchema),
    actions: iots.array(ActionDataSchema),
});
export const EntityTemplateDataSchema = iots.strict({});
