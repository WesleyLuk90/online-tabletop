import * as t from "io-ts";
import {
    AttributeSchema,
    Entity,
    EntitySchema,
    SubEntitySchema
} from "./Entity";

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
    attributeID: t.string
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

export const SubEntityPath = t.array(
    t.strict({
        attributeID: t.string,
        subEntityID: t.string
    })
);

export const CreateSubEntitySchema = t.strict({
    type: t.literal("create-subentity-attribute"),
    source: t.string,
    campaignID: t.string,
    entityID: t.string,
    path: SubEntityPath,
    subEntity: SubEntitySchema
});
export interface CreateSubEntity
    extends t.TypeOf<typeof CreateSubEntitySchema> {}

export const UpdateSubEntitySchema = t.strict({
    type: t.literal("update-subentity-attribute"),
    source: t.string,
    campaignID: t.string,
    entityID: t.string,
    path: SubEntityPath,
    attribute: AttributeSchema
});
export interface UpdateSubEntity
    extends t.TypeOf<typeof UpdateSubEntitySchema> {}

export const DeleteSubEntitySchema = t.strict({
    type: t.literal("delete-subentity-attribute"),
    source: t.string,
    campaignID: t.string,
    entityID: t.string,
    path: SubEntityPath
});
export interface DeleteSubEntity
    extends t.TypeOf<typeof DeleteSubEntitySchema> {}

export const UpdateEntityDeltaSchema: t.UnionC<[
    t.Type<DeleteEntityAttribute>,
    t.Type<UpdateEntityAttribute>,
    t.Type<CreateSubEntity>,
    t.Type<UpdateSubEntity>,
    t.Type<DeleteSubEntity>
]> = t.union([
    DeleteEntityAttributeSchema,
    UpdateEntityAttributeSchema,
    CreateSubEntitySchema,
    UpdateSubEntitySchema,
    DeleteSubEntitySchema
]);

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
                    e => e.attributeID !== update.attributeID
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
