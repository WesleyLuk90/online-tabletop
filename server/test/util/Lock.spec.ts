import { Lock } from "../../src/util/Lock";

describe("Lock", () => {
    it("should process", async () => {
        let counterA = 0;
        let counterB = 0;
        const lock = new Lock(({ key }: { key: string }) => key);

        const promisesA = new Array(100).fill(0).map(() =>
            lock.runExclusive({ key: "a" }, async () => {
                const value = counterA;
                await new Promise(res => setTimeout(res));
                counterA = value + 1;
                return value;
            })
        );
        const promisesB = new Array(100).fill(0).map(() =>
            lock.runExclusive({ key: "b" }, async () => {
                const value = counterB;
                await new Promise(res => setTimeout(res));
                counterB = value + 1;
                return value;
            })
        );

        const resultA = await Promise.all(promisesA);
        const resultB = await Promise.all(promisesB);

        expect(resultA[50]).toBe(50);
        expect(resultB[50]).toBe(50);

        expect(counterA).toBe(100);
        expect(counterB).toBe(100);
    });
});
