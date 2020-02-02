import { Entity } from "protocol/src/Entity";
import { EntityDelta } from "protocol/src/EntityDelta";
import { EntityRequests } from "../games/EntityRequests";
import { PromiseDebouncer } from "../util/PromiseDebouncer";
import { GameStateUpdater } from "./CampaignLoader";

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
    }

    async loadTokens() {}

    handleTokenUpdate(entityDelta: EntityDelta) {}
}
