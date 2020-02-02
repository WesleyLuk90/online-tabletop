import Axios from "axios";
import * as t from "io-ts";
import { Entity, EntitySchema } from "protocol/src/Entity";
import { EntityDelta } from "protocol/src/EntityDelta";
import { parse } from "protocol/src/Parse";

export class EntityRequests {
    async get({
        campaignID,
        entityID
    }: {
        campaignID: string;
        entityID: string;
    }): Promise<Entity> {
        const response = await Axios.get(
            `/api/campaign/${campaignID}/entities/${entityID}`
        );
        return parse(response.data, EntitySchema);
    }

    async list(campaignID: string): Promise<Entity[]> {
        const response = await Axios.get(
            `/api/campaign/${campaignID}/entities`
        );
        return parse(response.data, t.array(EntitySchema));
    }

    async update(campaignID: string, deltas: EntityDelta[]) {
        await Axios.post(`/api/campaign/${campaignID}/entities`, deltas);
    }
}
