import { Queue } from "../../src/util/Queue";

describe("queue", () => {
    it("should process", async () => {
        let counter = 0;
        const queue = new Queue(async () => {
            let next = counter + 1;
            await new Promise(res => setTimeout(res, 10));
            counter = next;
        });

        for (let i = 0; i < 100; i++) {
            await new Promise(res => setTimeout(res, 1));
            queue.enqueue(i);
        }

        await queue.complete();

        expect(counter).toBe(100);
    });
});
