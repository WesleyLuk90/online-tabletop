import * as t from "io-ts";
import { Entity } from "protocol/src/Entity";
import {
    deltaCampaignID,
    deltaEntityID,
    EntityDelta,
    EntityDeltaSchema
} from "protocol/src/EntityDelta";
import { parse } from "protocol/src/Parse";
import { BadRequestError } from "../Errors";
import { Route } from "../Route";
import { CampaignPermissionService } from "./CampaignPermissionService";
import { EntityProcessor } from "./EntityProcessor";
import { EntityStorage } from "./EntityStorage";

export class EntityManager {
    constructor(
        private permissionService: CampaignPermissionService,
        private entityStorage: EntityStorage,
        private entityProcessor: EntityProcessor
    ) {}

    routes(): Route[] {
        return [
            Route.create(
                "get",
                "/api/campaign/:id/entities/:entityID",
                (userID, data) =>
                    this.get({
                        userID,
                        campaignID: data.url("id"),
                        entityID: data.url("entityID")
                    })
            ),
            Route.create("get", "/api/campaign/:id/entities", (userID, data) =>
                this.list({ userID, campaignID: data.url("id") })
            ),
            Route.create("post", "/api/campaign/:id/entities", (userID, data) =>
                this.update(
                    { userID, campaignID: data.url("id") },
                    parse(data.body(), t.array(EntityDeltaSchema))
                )
            )
        ];
    }

    async get({
        userID,
        campaignID,
        entityID
    }: {
        userID: string;
        campaignID: string;
        entityID: string;
    }) {
        return this.permissionService.requirePlayer(
            {
                userID,
                campaignID
            },
            () => this.entityStorage.get({ campaignID, entityID })
        );
    }

    async list({
        userID,
        campaignID
    }: {
        userID: string;
        campaignID: string;
    }): Promise<Entity[]> {
        return this.permissionService.requirePlayer(
            {
                userID,
                campaignID
            },
            () => this.entityStorage.list(campaignID)
        );
    }

    async update(
        { userID, campaignID }: { userID: string; campaignID: string },
        entityDelta: EntityDelta[]
    ) {
        BadRequestError.check(
            entityDelta.every(e => deltaCampaignID(e) === campaignID),
            "Entity deltas must be for the same campaign"
        );
        return this.permissionService.requireEntityPermission(
            { userID, campaignID, entityIDs: entityDelta.map(deltaEntityID) },
            () => {
                entityDelta.forEach(delta => this.entityProcessor.queue(delta));
                return {};
            }
        );
    }
}
