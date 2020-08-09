import { Either, fromOption, isLeft, left, right } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { BaseError } from "../BaseError";
import { rightOrThrow } from "../utils/Exceptions";
import { ignoreEquality, lazy } from "../utils/Lazy";
import { SubEntityAttribute } from "./models/Attribute";
import { Campaign } from "./models/Campaign";
import { Entity } from "./models/Entity";
import { EntityTemplate } from "./models/EntityTemplate";
import { EntityType } from "./models/EntityType";
import { EntityReference, SubEntityReference } from "./models/Reference";

export class SubEntityNotFound extends BaseError {
    constructor(readonly subEntityReference: SubEntityReference) {
        super(
            `No sub entity for attribute ${subEntityReference.attribute} with id ${subEntityReference.entityID} found`
        );
    }
}
export class EntityNotFound extends BaseError {
    constructor(readonly id: string) {
        super(`No entity with id ${id} found`);
    }
}
export class EntityTemplateNotFound extends BaseError {
    constructor(readonly id: string) {
        super(`No entity template with id ${id} found`);
    }
}
export class InvalidEntityType extends BaseError {
    constructor(readonly id: string) {
        super(`Invalid entity type ${id} found`);
    }
}

export class ResolvedEntity {
    constructor(
        readonly entity: Entity,
        readonly template: EntityTemplate,
        readonly entityType: EntityType
    ) {
        ignoreEquality(this, "attributes");
    }

    readonly attributes = lazy(() =>
        this.entity.attributes.addAll(this.template.attributes)
    );
}

export class EntityHiearchy {
    constructor(readonly hierarchy: ResolvedEntity[]) {}
}

export type ResolutionError =
    | EntityNotFound
    | EntityTemplateNotFound
    | SubEntityNotFound
    | InvalidEntityType;

export class References {
    static resolveChecked(
        reference: EntityReference,
        campaign: Campaign
    ): ResolvedEntity[] {
        return rightOrThrow(References.resolve(reference, campaign));
    }

    static resolve(
        reference: EntityReference,
        campaign: Campaign
    ): Either<ResolutionError, ResolvedEntity[]> {
        const entityID = reference.entityID;
        const entity = campaign.getEntity(entityID);
        if (O.isNone(entity)) {
            return left(new EntityNotFound(entityID));
        }
        const template = campaign.getEntityTemplate(entity.value.templateId);
        if (O.isNone(template)) {
            return left(new EntityTemplateNotFound(entity.value.templateId));
        }
        const type = campaign.gameMode.entityTypes.get(
            template.value.entityType
        );
        if (O.isNone(type)) {
            return left(new InvalidEntityType(template.value.entityType));
        }
        const entities: ResolvedEntity[] = [
            new ResolvedEntity(entity.value, template.value, type.value),
        ];
        let lastEntity = entities[0];
        for (let subEntityReference of reference.subEntities) {
            const e = this.resolveSubEntity(
                subEntityReference,
                lastEntity,
                campaign
            );
            if (isLeft(e)) {
                return e;
            }
            entities.push(e.right);
            lastEntity = e.right;
        }
        return right(entities);
    }

    static resolveSubEntity(
        subEntityReference: SubEntityReference,
        resolvedEntity: ResolvedEntity,
        campaign: Campaign
    ): Either<ResolutionError, ResolvedEntity> {
        return pipe(
            resolvedEntity.attributes().get(subEntityReference.attribute),
            O.filter(SubEntityAttribute.is),
            O.chain((a) => a.subEntities.get(subEntityReference.entityID)),
            O.chain((entity) => References.resolveTemplate(campaign, entity)),
            fromOption(() => new SubEntityNotFound(subEntityReference))
        );
    }

    static resolveTemplate(
        campaign: Campaign,
        entity: Entity
    ): O.Option<ResolvedEntity> {
        return pipe(
            campaign.getEntityTemplate(entity.templateId),
            O.chain((template) =>
                References.resolveType(campaign, entity, template)
            )
        );
    }

    static resolveType(
        campaign: Campaign,
        entity: Entity,
        template: EntityTemplate
    ): O.Option<ResolvedEntity> {
        return pipe(
            campaign.gameMode.entityTypes.get(template.entityType),
            O.map((type) => new ResolvedEntity(entity, template, type))
        );
    }
}
