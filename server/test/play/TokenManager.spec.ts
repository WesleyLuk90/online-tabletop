import { TokenManager } from "../../src/play/TokenManager";

describe("TokenManager", () => {
    it("should generate tokens", async () => {
        const manager = new TokenManager(1e12);
        const t1 = await manager.create("g1", "u1");
        expect(await manager.create("g1", "u1")).toEqual(t1);
        const t2 = await manager.create("g2", "u2");

        expect(manager.get(t2.token)).toEqual(t2);
        expect(manager.get(t1.token)).toEqual(t1);
        expect(manager.get(t2.token)).toEqual(null);
        expect(manager.get(t1.token)).toEqual(null);
    });
});
