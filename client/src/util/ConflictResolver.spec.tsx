import { ConflictResolver } from "./ConflictResolver";

describe("ConflictResolver", () => {
    class Data {
        constructor(readonly id: string, readonly value: number) {}
    }

    class Update {
        constructor(
            readonly id: string,
            readonly newValue: number,
            readonly source: string
        ) {}
    }

    class TestConflictResolver extends ConflictResolver<Data, Update> {
        constructor(protected onUpdated: (d: Data) => void) {
            super("me");
        }

        protected getID(data: Data) {
            return data.id;
        }
        protected updateID(update: Update) {
            return update.id;
        }
        protected applyUpdate(data: Data, update: Update) {
            return new Data(data.id, update.newValue);
        }
    }

    it("should handle regular updates", async () => {
        const mock = jest.fn();
        const resolver = new TestConflictResolver(mock);
        resolver.updateAll([new Data("a", 1)]);
        resolver.applyLocalUpdate(new Update("a", 2, "me"));
        expect(mock).toHaveBeenCalledWith(new Data("a", 2));

        resolver.applyRemoteUpdate(new Update("a", 2, "me"));
        expect(mock).not.toHaveBeenCalledWith(new Data("a", 3));
        resolver.applyRemoteUpdate(new Update("a", 3, "other"));
        expect(mock).toHaveBeenCalledWith(new Data("a", 3));
        expect(mock).toHaveBeenCalledTimes(2);
    });

    it("should resolve a conflict", async () => {
        const mock = jest.fn();
        const resolver = new TestConflictResolver(mock);
        resolver.updateAll([new Data("a", 1)]);
        resolver.applyLocalUpdate(new Update("a", 2, "me"));
        expect(mock).toHaveBeenCalledWith(new Data("a", 2));

        resolver.applyRemoteUpdate(new Update("a", 3, "other"));
        expect(mock).toHaveBeenCalledWith(new Data("a", 3));
        resolver.applyRemoteUpdate(new Update("a", 2, "me"));
        expect(mock).toHaveBeenCalledWith(new Data("a", 3));
        expect(mock).toHaveBeenCalledTimes(3);
    });

    it("should do nothing if the conflict result is the same", async () => {
        const mock = jest.fn();
        const resolver = new TestConflictResolver(mock);
        resolver.updateAll([new Data("a", 1)]);
        resolver.applyLocalUpdate(new Update("a", 2, "me"));
        expect(mock).toHaveBeenCalledWith(new Data("a", 2));

        resolver.applyRemoteUpdate(new Update("a", 2, "other"));
        expect(mock).toHaveBeenCalledWith(new Data("a", 2));
        resolver.applyRemoteUpdate(new Update("a", 2, "me"));
        expect(mock).toHaveBeenCalledTimes(2);
    });
});
