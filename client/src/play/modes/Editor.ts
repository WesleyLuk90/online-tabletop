export interface Editor {
    pages: Page[];
}

export interface Page {
    name: string;
    components: Component[];
}

export type Component =
    | ({ type: "row" } & Row)
    | ({ type: "control" } & Control)
    | ({ type: "section" } & Section)
    | ({ type: "control-row" } & ControlRow);

export interface Section {
    label?: string;
    border: boolean;
    components: Component[];
}

export interface Row {
    columns: Column[];
}

export interface Column {
    width: number;
    components: Component[];
}

export interface Control {
    attributeID: string;
}

export interface ControlRow {
    controls: Control[];
}
