import { Entity } from "protocol/src/Entity";
import { EntityRequests } from "../games/EntityRequests";
import { PromiseDebouncer } from "../util/PromiseDebouncer";
import { GameStateUpdater } from "./CampaignLoader";
import { EntityCollection } from "./EntityCollection";

export class EntityManager {
    debounce = new PromiseDebouncer<Entity[]>();

    constructor(
        private sessionID: string,
        private campaignID: string,
        private gameStateUpdater: GameStateUpdater
    ) {}

    async load() {
        const entities = await this.debounce.debounce(
            EntityRequests.list(this.campaignID)
        );
        const manager = new EntityCollection(entities);
        this.gameStateUpdater(g => g.build(b => b.updateEntities(manager)));
    }
}
