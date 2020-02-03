interface SourcedUpdate {
    source: string;
}

export abstract class ConflictResolver<Type, Update extends SourcedUpdate> {
    private local: Map<string, Type> = new Map();
    private remote: Map<string, Type> = new Map();

    constructor(private sessionID: string) {}

    abstract getID(value: Type): string;

    applyLocalUpdate(update: Update) {}

    applyRemoteUpdate(update: Update) {
        if (update.source) {
        }
    }
}
