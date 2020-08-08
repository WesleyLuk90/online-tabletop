export class SubEntityReference {
    constructor(readonly attribute: string, readonly entityID: string) {}
}

export class EntityReference {
    constructor(
        readonly entityID: string,
        readonly subEntities: SubEntityReference[]
    ) {}
}

export class ActionReference {
    constructor(readonly entity: EntityReference, action: string) {}
}
