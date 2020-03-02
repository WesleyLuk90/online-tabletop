import * as t from "io-ts";
import { AttributeSchema, Entity, EntitySchema } from "./Entity";

export const CreateEntityDeltaSchema = t.strict({
    type: t.literal("create"),
    source: t.string,
    entity: EntitySchema
});

export interface CreateEntityDelta
    extends t.TypeOf<typeof CreateEntityDeltaSchema> {}

export const DeleteEntityDeltaSchema = t.strict({
    type: t.literal("delete"),
    source: t.string,
    campaignID: t.string,
    entityID: t.string
});

export interface DeleteEntityDelta
    extends t.TypeOf<typeof DeleteEntityDeltaSchema> {}

export const DeleteEntityAttributeSchema = t.strict({
    type: t.literal("delete-attribute"),
    source: t.string,
    campaignID: t.string,
    entityID: t.string,
    attribute: AttributeSchema
});
export interface DeleteEntityAttribute
    extends t.TypeOf<typeof DeleteEntityAttributeSchema> {}

export const UpdateEntityAttributeSchema = t.strict({
    type: t.literal("update-attribute"),
    source: t.string,
    campaignID: t.string,
    entityID: t.string,
    attribute: AttributeSchema
});
export interface UpdateEntityAttribute
    extends t.TypeOf<typeof UpdateEntityAttributeSchema> {}

export const UpdateEntityDeltaSchema: t.UnionC<[
    t.Type<DeleteEntityAttribute>,
    t.Type<UpdateEntityAttribute>
]> = t.union([DeleteEntityAttributeSchema, UpdateEntityAttributeSchema]);

export type UpdateEntityDelta = t.TypeOf<typeof UpdateEntityDeltaSchema>;

export const EntityDeltaSchema: t.UnionC<[
    t.Type<CreateEntityDelta>,
    t.Type<DeleteEntityDelta>,
    t.Type<UpdateEntityDelta>
]> = t.union([
    CreateEntityDeltaSchema,
    DeleteEntityDeltaSchema,
    UpdateEntityDeltaSchema
]);

export type EntityDelta = t.TypeOf<typeof EntityDeltaSchema>;

export function deltaCampaignID(delta: EntityDelta): string {
    switch (delta.type) {
        case "create":
            return delta.entity.campaignID;
        default:
            return delta.campaignID;
    }
}
export function deltaEntityID(delta: EntityDelta): string {
    switch (delta.type) {
        case "create":
            return delta.entity.entityID;
        default:
            return delta.entityID;
    }
}

export function applyDelta(e: Entity, update: UpdateEntityDelta): Entity {
    switch (update.type) {
        case "delete-attribute":
            return {
                ...e,
                attributes: e.attributes.filter(
                    e => e.attributeID !== update.attribute.attributeID
                )
            };
        case "update-attribute":
            return {
                ...e,
                attributes: e.attributes
                    .filter(e => e.attributeID !== update.attribute.attributeID)
                    .concat([update.attribute])
            };
    }
}
