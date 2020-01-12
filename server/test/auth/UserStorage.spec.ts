import { newUUID } from "protocol/src/Id";
import { UserStorage } from "../../src/auth/UserStorage";
import { DbFixture } from "../fixtures/DbFixture";

describe("UserStorage", () => {
    const db = new DbFixture("campaigns");
    it("should store", async () => {
        const storage = new UserStorage(db.get());
        const user = { id: newUUID(), displayName: "foo" };
        await storage.create(user);
        await storage.create(user);
        expect(await storage.get(user.id)).toEqual(user);
    });
});
