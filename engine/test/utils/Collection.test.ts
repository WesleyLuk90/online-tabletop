import { none, some } from "fp-ts/lib/Option";
import { Collection } from "../../src/utils/Collection";

describe("Collection", () => {
    class Value {
        constructor(readonly id: string) {}
    }
    it("should get", () => {
        expect(
            Collection.of(new Value("a"), new Value("b"))
                .add(new Value("a"))
                .get("b")
        ).toEqual(some(new Value("b")));
    });

    it("should add", () => {
        const collection = Collection.empty()
            .add(new Value("c"))
            .add(new Value("b"));
        expect(collection.get("a")).toEqual(none);
        expect(collection.get("b")).toEqual(some(new Value("b")));
        expect(collection.get("c")).toEqual(some(new Value("c")));
    });

    it("should add all", () => {
        const collection = Collection.of(new Value("a"), new Value("b")).addAll(
            Collection.of(new Value("b"), new Value("c"))
        );
        expect(collection.get("a")).toEqual(some(new Value("a")));
        expect(collection.get("b")).toEqual(some(new Value("b")));
        expect(collection.get("c")).toEqual(some(new Value("c")));
    });
});
