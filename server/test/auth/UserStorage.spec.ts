import { newUUID } from "protocol/src/Id";
import { UserCollection, UserStorage } from "../../src/auth/UserStorage";
import { DbFixture } from "../fixtures/DbFixture";

describe("UserStorage", () => {
    const db = new DbFixture(p => new UserCollection(p));
    it("should store", async () => {
        const storage = new UserStorage(await db.get());
        const user = { id: newUUID(), displayName: "foo" };
        await storage.create(user);
        await storage.create(user);
        expect(await storage.get(user.id)).toEqual(user);
    });
});
