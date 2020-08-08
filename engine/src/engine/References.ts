import { Either, fromOption, isLeft, left, right } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { BaseError } from "../BaseError";
import { rightOrThrow } from "../utils/Exceptions";
import { lazy } from "../utils/Lazy";
import { SubEntityAttribute } from "./models/Attribute";
import { Campaign } from "./models/Campaign";
import { Entity } from "./models/Entity";
import { EntityTemplate } from "./models/EntityTemplate";
import { EntityReference, SubEntityReference } from "./models/Reference";

class SubEntityNotFound extends BaseError {
    constructor(readonly subEntityReference: SubEntityReference) {
        super(
            `No sub entity for attribute ${subEntityReference.attribute} with id ${subEntityReference.entityID} found`
        );
    }
}
class EntityNotFound extends BaseError {
    constructor(readonly id: string) {
        super(`No entity with id ${id} found`);
    }
}
class EntityTemplateNotFound extends BaseError {
    constructor(readonly id: string) {
        super(`No entity template with id ${id} found`);
    }
}

export class ResolvedEntity {
    constructor(readonly entity: Entity, readonly template: EntityTemplate) {}

    readonly attributes = lazy(() =>
        this.entity.attributes.addAll(this.template.attributes)
    );
}

type ResolutionError =
    | EntityNotFound
    | EntityTemplateNotFound
    | SubEntityNotFound;

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
        let entity = campaign.getEntity(entityID);
        if (O.isNone(entity)) {
            return left(new EntityNotFound(entityID));
        }
        let template = campaign.getEntityTemplate(entity.value.templateId);
        if (O.isNone(template)) {
            return left(new EntityTemplateNotFound(entity.value.templateId));
        }
        const entities: ResolvedEntity[] = [
            new ResolvedEntity(entity.value, template.value),
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
            O.map((a) => a.subEntities.get(subEntityReference.entityID)),
            O.flatten,
            O.map((e) =>
                pipe(
                    campaign.getEntityTemplate(e.templateId),
                    O.map((temp) => new ResolvedEntity(e, temp))
                )
            ),
            O.flatten,
            fromOption(() => new SubEntityNotFound(subEntityReference))
        );
    }
}
