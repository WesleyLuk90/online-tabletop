import { Role } from "protocol/src/Role";
import {
    CampaignCollection,
    CampaignStorage
} from "../../src/game/CampaignStorage";
import { DbFixture } from "../fixtures/DbFixture";

describe("CampaignStorage", () => {
    const db = new DbFixture(p => new CampaignCollection(p));

    it("should store", async () => {
        const storage = new CampaignStorage(await db.get());
        await storage.create({
            id: "",
            ownerID: "other",
            name: "bar",
            players: [],
            sceneID: ""
        });
        const created = await storage.create({
            id: "",
            ownerID: "user1",
            name: "bar",
            players: [{ userID: "user1", role: Role.manager, sceneID: "" }],
            sceneID: ""
        });
        expect(created.id).toBeTruthy();
        expect(await storage.get(created.id)).toEqual(created);
        const updated = { ...created, name: "foo" };
        expect(await storage.update(updated)).toEqual(updated);
        expect(await storage.get(created.id)).toEqual(updated);

        expect(await storage.list("user1")).toEqual([updated]);
    });
});
