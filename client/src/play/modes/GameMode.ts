import { Editor } from "./Editor";

export interface GameMode {
    id: string;
    name: string;
    entityTypes: EntityType[];
    tokenEntities: TokenEntities[];
}

export interface EntityType {
    id: string;
    name: string;
    attributes: Attribute[];
    editor: Editor;
}

export enum AttributeType {
    Number = "Number",
    Text = "Text",
    RichText = "RichText"
}

export interface Attribute {
    id: string;
    name: string;
    type: AttributeType;
}

export interface TokenEntities {
    entityTypeID: string;
}
