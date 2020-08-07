import { Collection } from "../../utils/Collection";
import { GameMode } from "../gamemode/GameMode";
import { ActionReference } from "./ActionReference";
import { Entity } from "./Entity";
import { EntityTemplate } from "./EntityTemplate";
import { PreparedAction } from "./PreparedAction";
import { Scene } from "./Scene";

export class Campaign {
    static empty(id: string, name: string, gameMode: GameMode): Campaign {
        return new Campaign(
            id,
            name,
            Collection.empty(),
            Collection.empty(),
            Collection.empty(),
            gameMode
        );
    }

    constructor(
        readonly id: string,
        readonly name: string,
        readonly scenes: Collection<Scene>,
        readonly entities: Collection<Entity>,
        readonly entityTemplates: Collection<EntityTemplate>,
        readonly gameMode: GameMode
    ) {}

    update(campaign: Partial<Campaign>): Campaign {
        return new Campaign(
            campaign.id ?? this.id,
            campaign.name ?? this.name,
            campaign.scenes ?? this.scenes,
            campaign.entities ?? this.entities,
            campaign.entityTemplates ?? this.entityTemplates,
            campaign.gameMode ?? this.gameMode
        );
    }

    addEntity(entity: Entity): Campaign {
        return this.update({ entities: this.entities.add(entity) });
    }

    addEntityTemplate(entityTemplate: EntityTemplate): Campaign {
        return this.update({
            entityTemplates: this.entityTemplates.add(entityTemplate),
        });
    }

    prepareAction(actionReference: ActionReference): PreparedAction {
        return new PreparedAction();
    }
}
