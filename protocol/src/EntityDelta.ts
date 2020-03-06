import * as t from "io-ts";
import {
    Attribute,
    AttributeSchema,
    Entity,
    EntitySchema,
    SubEntity,
    SubEntitySchema
} from "./Entity";

export const CreateEntityDeltaSchema = t.strict({
    type: t.literal("create"),
    source: t.string,
    entity: EntitySchema
});

export interface CreateEntityDelta
    extends t.TypeOf<typeof CreateEntityDeltaSchema> {}

export const SubEntityPathSchema = t.array(
    t.strict({
        attributeID: t.string,
        subEntityID: t.string
    })
);

export interface SubEntityPath extends t.TypeOf<typeof SubEntityPathSchema> {}

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
    attributeID: t.string,
    path: SubEntityPathSchema
});
export interface DeleteEntityAttribute
    extends t.TypeOf<typeof DeleteEntityAttributeSchema> {}

export const UpdateEntityAttributeSchema = t.strict({
    type: t.literal("update-attribute"),
    source: t.string,
    campaignID: t.string,
    entityID: t.string,
    attribute: AttributeSchema,
    path: SubEntityPathSchema
});
export interface UpdateEntityAttribute
    extends t.TypeOf<typeof UpdateEntityAttributeSchema> {}

export const UpdateSubEntitySchema = t.strict({
    type: t.literal("update-subentity"),
    source: t.string,
    campaignID: t.string,
    entityID: t.string,
    path: SubEntityPathSchema,
    subEntity: SubEntitySchema
});
export interface UpdateSubEntity
    extends t.TypeOf<typeof UpdateSubEntitySchema> {}

export const DeleteSubEntitySchema = t.strict({
    type: t.literal("delete-subentity"),
    source: t.string,
    campaignID: t.string,
    entityID: t.string,
    path: SubEntityPathSchema
});
export interface DeleteSubEntity
    extends t.TypeOf<typeof DeleteSubEntitySchema> {}

export const UpdateEntityDeltaSchema: t.UnionC<[
    t.Type<DeleteEntityAttribute>,
    t.Type<UpdateEntityAttribute>,
    t.Type<UpdateSubEntity>,
    t.Type<DeleteSubEntity>
]> = t.union([
    DeleteEntityAttributeSchema,
    UpdateEntityAttributeSchema,
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

class EntityDeltaError extends Error {
    static assert(ok: boolean, message: string): asserts ok {
        if (!ok) {
            throw new EntityDeltaError(message);
        }
    }

    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, EntityDeltaError.prototype);
    }
}

function deleteAttribute<E extends SubEntity>(
    entity: E,
    attributeID: string
): E {
    EntityDeltaError.assert(
        entity.attributes.find(entity => entity.attributeID === attributeID) !=
            null,
        `Failed to delete attribute, ${attributeID} not found`
    );
    return {
        ...entity,
        attributes: entity.attributes.filter(
            entity => entity.attributeID !== attributeID
        )
    };
}

function updateAttribute<E extends SubEntity>(
    entity: E,
    attribute: Attribute
): E {
    return {
        ...entity,
        attributes: entity.attributes
            .filter(e => e.attributeID !== attribute.attributeID)
            .concat([attribute])
    };
}

export function applyDelta(entity: Entity, update: UpdateEntityDelta): Entity {
    switch (update.type) {
        case "delete-attribute":
            if (update.path.length === 0) {
                return deleteAttribute(entity, update.attributeID);
            } else {
                return updateSubEntity(entity, update.path, subEntity => {
                    EntityDeltaError.assert(
                        subEntity != null,
                        `No sub entity with id ${
                            update.path[update.path.length - 1].subEntityID
                        } found`
                    );
                    return deleteAttribute(subEntity, update.attributeID);
                });
            }
        case "update-attribute":
            if (update.path.length === 0) {
                return updateAttribute(entity, update.attribute);
            } else {
                return updateSubEntity(entity, update.path, subEntity => {
                    EntityDeltaError.assert(
                        subEntity != null,
                        `No sub entity with id ${
                            update.path[update.path.length - 1].subEntityID
                        } found`
                    );
                    return updateAttribute(subEntity, update.attribute);
                });
            }
        case "update-subentity":
            return updateSubEntity(entity, update.path, () => update.subEntity);
        case "delete-subentity":
            return updateSubEntity(entity, update.path, subEntity => {
                EntityDeltaError.assert(
                    subEntity != null,
                    `No sub entity with id ${
                        update.path[update.path.length - 1].subEntityID
                    } found`
                );
                return null;
            });
    }
}

function updateSubEntity<T extends SubEntity>(
    entity: T,
    path: SubEntityPath,
    update: (subEntity: SubEntity | null) => SubEntity | null
): T {
    EntityDeltaError.assert(path.length > 0, "Sub entity path is invalid");
    const attributes = keyBy(entity.attributes, a => a.attributeID);
    const { attributeID, subEntityID } = path[0];
    if (path.length > 1) {
        const attribute = attributes.get(attributeID);
        EntityDeltaError.assert(
            attribute != null,
            `Missing attribute ${attributeID}`
        );
        EntityDeltaError.assert(
            "entities" in attribute,
            `Expected subentity attribute ${JSON.stringify(attribute)}`
        );
        const subEntities = keyBy(attribute.entities, e => e.entityID);
        const subEntity = subEntities.get(subEntityID);
        EntityDeltaError.assert(
            subEntity != null,
            `Missing subentity with id ${subEntityID}`
        );
        subEntities.set(
            subEntityID,
            updateSubEntity(subEntity, path.slice(1), update)
        );
        attributes.set(attributeID, {
            ...attribute,
            entities: Array.from(subEntities.values())
        });
    } else {
        const attribute = attributes.get(attributeID) ?? {
            attributeID,
            entities: []
        };
        EntityDeltaError.assert(
            "entities" in attribute,
            `Expected subentity attribute ${JSON.stringify(attribute)}`
        );
        const subEntities = keyBy(attribute.entities, e => e.entityID);
        const subEntity = subEntities.get(subEntityID);
        const updated = update(subEntity ?? null);
        if (updated == null) {
            subEntities.delete(subEntityID);
        } else {
            subEntities.set(subEntityID, updated);
        }
        attributes.set(attributeID, {
            ...attribute,
            entities: Array.from(subEntities.values())
        });
    }
    return {
        ...entity,
        attributes: Array.from(attributes.values())
    };
}

function keyBy<V>(values: V[], key: (v: V) => string): Map<string, V> {
    const map = new Map();
    values.forEach(v => map.set(key(v), v));
    return map;
}

function last<T>(values: T[]): T {
    return values[values.length - 1];
}
