import { newUUID } from "protocol/src/Id";
import { Token } from "protocol/src/Token";
import { TokenCollection, TokenStorage } from "../../src/game/TokenStorage";
import { DbFixture } from "../fixtures/DbFixture";

describe("TokenStorage", () => {
    const db = new DbFixture(p => new TokenCollection(p));

    it("should store", async () => {
        const storage = new TokenStorage(await db.get());
        const token: Token = {
            tokenID: newUUID(),
            campaignID: newUUID(),
            sceneID: newUUID(),
            width: 70,
            height: 70,
            version: 0,
            x: 0,
            y: 0,
            layerID: newUUID(),
            data: {
                type: "square",
                fillColor: { red: 0, green: 0, blue: 0, alpha: 0 },
                strokeColor: { red: 0, green: 0, blue: 0, alpha: 0 },
                strokeWidth: 10
            }
        };
        await storage.create(token);
        expect(
            await storage.get({
                tokenID: token.tokenID,
                campaignID: token.campaignID
            })
        ).toEqual(token);
        expect(
            await storage.list({
                campaignID: token.campaignID,
                sceneID: token.sceneID
            })
        ).toEqual([token]);
    });
});
