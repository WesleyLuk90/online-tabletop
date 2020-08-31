import { Action } from "../engine/models/Action";
import {
    Attribute,
    ComputedAttribute,
    NumberAttribute,
    SubEntityAttribute,
} from "../engine/models/Attribute";
import { Entity } from "../engine/models/Entity";
import { EntityTemplate } from "../engine/models/EntityTemplate";
import { Collection } from "../utils/Collection";
import { assertExaustive } from "../utils/Exaustive";
import { iots } from "./iots";
import {
    RollExpressionDataSchema,
    RollExpressionSerde,
} from "./RollExpression";
import { Serde } from "./Serde";

export const NumberAttributeDataSchema = iots.strict({
    id: iots.string,
    value: iots.number,
    _tag: iots.literal("number"),
});
interface NumberAttributeData
    extends iots.TypeOf<typeof NumberAttributeDataSchema> {}
export const ComputedAttributeDataSchema = iots.strict({
    id: iots.string,
    expression: RollExpressionDataSchema,
    _tag: iots.literal("computed"),
});
interface ComputedAttributeData
    extends iots.TypeOf<typeof ComputedAttributeDataSchema> {}
export const SubEntityAttributeSchema: iots.Type<SubEntityAttributeData> = iots.recursion(
    "SubEntityAttributeSchema",
    () =>
        iots.strict({
            id: iots.string,
            subEntities: iots.array(EntityDataSchema),
            _tag: iots.literal("subEntity"),
        })
);

export interface SubEntityAttributeData {
    id: string;
    subEntities: EntityData[];
    _tag: "subEntity";
}

export const AttributeDataSchema: iots.Type<AttributeData> = iots.recursion(
    "AttributeDataSchema",
    () =>
        iots.strict({
            attribute: iots.union([
                NumberAttributeDataSchema,
                ComputedAttributeDataSchema,
                SubEntityAttributeSchema,
            ]),
        })
);
export interface AttributeData {
    attribute:
        | NumberAttributeData
        | ComputedAttributeData
        | SubEntityAttributeData;
}
export const AttributeDataSerde: Serde<Attribute, AttributeData> = {
    serialize(attribute: Attribute): AttributeData {
        if (attribute instanceof NumberAttribute) {
            return {
                attribute: {
                    _tag: "number",
                    id: attribute.id,
                    value: attribute.value,
                },
            };
        } else if (attribute instanceof ComputedAttribute) {
            return {
                attribute: {
                    _tag: "computed",
                    id: attribute.id,
                    expression: RollExpressionSerde.serialize(
                        attribute.expression
                    ),
                },
            };
        } else if (attribute instanceof SubEntityAttribute) {
            return {
                attribute: {
                    _tag: "subEntity",
                    id: attribute.id,
                    subEntities: attribute.subEntities
                        .all()
                        .map(EntityDataSerde.serialize),
                },
            };
        } else {
            assertExaustive(attribute);
        }
    },
    deserialize(data: AttributeData): Attribute {
        const a = data.attribute;
        switch (a._tag) {
            case "number":
                return new NumberAttribute(a.id, a.value);
            case "computed":
                return new ComputedAttribute(
                    a.id,
                    RollExpressionSerde.deserialize(a.expression)
                );
            case "subEntity":
                return new SubEntityAttribute(
                    a.id,
                    Collection.ofList(
                        a.subEntities.map(EntityDataSerde.deserialize)
                    )
                );
            default:
                assertExaustive(a);
        }
    },
};

export const ActionDataSchema = iots.strict({
    id: iots.string,
    name: iots.string,
    description: iots.string,
    rollExpression: RollExpressionDataSchema,
});
export interface ActionData extends iots.TypeOf<typeof ActionDataSchema> {}
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
export interface EntityTemplateData
    extends iots.TypeOf<typeof EntityTemplateDataSchema> {}
export const EntityTemplateDataSerde: Serde<
    EntityTemplate,
    EntityTemplateData
> = {
    serialize(template: EntityTemplate): EntityTemplateData {
        return {
            id: template.id,
            entityType: template.entityType,
            actions: template.actions.all().map(ActionDataSerde.serialize),
            attributes: template.attributes
                .all()
                .map(AttributeDataSerde.serialize),
        };
    },
    deserialize(data: EntityTemplateData): EntityTemplate {
        return new EntityTemplate(
            data.id,
            data.entityType,
            Collection.ofList(
                data.attributes.map(AttributeDataSerde.deserialize)
            ),
            Collection.ofList(data.actions.map(ActionDataSerde.deserialize))
        );
    },
};

export const ActionDataSerde: Serde<Action, ActionData> = {
    serialize(action: Action): ActionData {
        return {
            id: action.id,
            name: action.name,
            description: action.description,
            rollExpression: RollExpressionSerde.serialize(
                action.rollExpression
            ),
        };
    },
    deserialize(data: ActionData): Action {
        return new Action(
            data.id,
            data.name,
            data.description,
            RollExpressionSerde.deserialize(data.rollExpression)
        );
    },
};

export const EntityDataSerde: Serde<Entity, EntityData> = {
    serialize(entity: Entity): EntityData {
        return {
            id: entity.id,
            templateId: entity.templateId,
            actions: entity.actions.all().map(ActionDataSerde.serialize),
            attributes: entity.attributes
                .all()
                .map(AttributeDataSerde.serialize),
        };
    },
    deserialize(data: EntityData): Entity {
        return new Entity(
            data.id,
            data.templateId,
            Collection.ofList(
                data.attributes.map(AttributeDataSerde.deserialize)
            ),
            Collection.ofList(data.actions.map(ActionDataSerde.deserialize))
        );
    },
};
