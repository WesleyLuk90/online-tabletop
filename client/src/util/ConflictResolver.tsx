import { isEqual } from "lodash";
import { keyBy } from "./Maps";

interface UpdateType {
    source: string;
}

function withValue<T>(map: Map<string, T>, id: string, apply: (t: T) => void) {
    const value = map.get(id);
    if (value != null) {
        apply(value);
    }
}

export abstract class ConflictResolver<Data, Update extends UpdateType> {
    private local: Map<string, Data> = new Map();
    private remote: Map<string, Data> = new Map();

    constructor(private sessionID: string) {}

    protected abstract getID(data: Data): string;
    protected abstract updateID(update: Update): string;
    protected abstract applyUpdate(data: Data, update: Update): Data;
    protected abstract onUpdated(data: Data): void;

    add(data: Data) {
        this.local.set(this.getID(data), data);
        this.remote.set(this.getID(data), data);
    }

    remove(id: string) {
        this.local.delete(id);
        this.remote.delete(id);
    }

    updateAll(data: Data[]) {
        this.local = keyBy(data, d => this.getID(d));
        this.remote = new Map(this.local);
    }

    applyLocalUpdate(update: Update) {
        this.updateValue(this.local, update);
        this.broadcastUpdate(this.local, this.updateID(update));
    }

    applyRemoteUpdate(update: Update) {
        if (update.source == this.sessionID) {
            const id = this.updateID(update);
            this.updateValue(this.remote, update);
            withValue(this.remote, id, value => {
                if (!isEqual(value, this.local.get(id))) {
                    this.local.set(id, value);
                    this.broadcastUpdate(this.remote, id);
                }
            });
        } else {
            this.updateValue(this.local, update);
            this.updateValue(this.remote, update);
            this.broadcastUpdate(this.local, this.updateID(update));
        }
    }

    private broadcastUpdate(map: Map<string, Data>, id: string) {
        withValue(map, id, value => this.onUpdated(value));
    }

    private updateValue(map: Map<string, Data>, update: Update) {
        const id = this.updateID(update);
        withValue(map, id, value => {
            const updated = this.applyUpdate(value, update);
            map.set(id, updated);
        });
    }
}
