import { Entity } from "protocol/src/Entity";
import { newUUID } from "protocol/src/Id";
import { EntityCollection, EntityStorage } from "../../src/game/EntityStorage";
import { DbFixture } from "../fixtures/DbFixture";

describe("EntityStorage", () => {
    const db = new DbFixture(p => new EntityCollection(p));

    it("should store", async () => {
        const storage = new EntityStorage(await db.get());
        const entity: Entity = {
            campaignID: newUUID(),
            entityID: newUUID(),
            attributes: [],
            type: "any",
            version: 0
        };
        await storage.create(entity);
        expect(
            await storage.get({
                entityID: entity.entityID,
                campaignID: entity.campaignID
            })
        ).toEqual(entity);
        expect(await storage.list(entity.campaignID)).toEqual([entity]);
    });
});
