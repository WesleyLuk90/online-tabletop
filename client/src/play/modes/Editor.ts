
export interface Editor {
    pages: Page[];
}

export interface Page {
    name: string;
    sections: Section[];
}

export interface Section {
    label: string;
    rows: Row[];
}

export interface Row {
    columns: Column[];
}
export interface Column {
    width: number;
    components: Component[];
}

export interface Component {
    attributeID: string;
}
