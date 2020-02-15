export class Editor {
    constructor(readonly pages: Page[]) {}
}

export class Page {
    constructor(readonly name: string, readonly components: Component[]) {}
}

export type Component = Row | Control | Section;

export class Section {
    constructor(
        readonly border: boolean,
        readonly components: Component[],
        readonly label?: string
    ) {}
}

export class Row {
    constructor(readonly columns: Column[]) {}
}

export class Column {
    constructor(readonly width: number, readonly components: Component[]) {}
}

export class Control {
    constructor(readonly attributeID: string) {}
}
