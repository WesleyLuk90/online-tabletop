import Axios from "axios";
import { Entity, EntitySchema } from "engine/engine/models/Entity";
import { EntityDelta } from "engine/engine/models/EntityDelta";
import { parse } from "engine/engine/models/Parse";
import * as t from "io-ts";

export class EntityRequests {
    static async get({
        campaignID,
        entityID,
    }: {
        campaignID: string;
        entityID: string;
    }): Promise<Entity> {
        const response = await Axios.get(
            `/api/campaign/${campaignID}/entities/${entityID}`
        );
        return parse(response.data, EntitySchema);
    }

    static async list(campaignID: string): Promise<Entity[]> {
        const response = await Axios.get(
            `/api/campaign/${campaignID}/entities`
        );
        return parse(response.data, t.array(EntitySchema));
    }

    static async update(campaignID: string, deltas: EntityDelta[]) {
        await Axios.post(`/api/campaign/${campaignID}/entities`, deltas);
    }
}
