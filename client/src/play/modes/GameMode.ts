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
    pluralName: string;
    attributes: AttributeDefinition[];
    editor: Editor;
    nameAttributeID: string;
}

export enum AttributeType {
    Number = "Number",
    Text = "Text",
    RichText = "RichText"
}

export interface AttributeDefinition {
    id: string;
    name: string;
    type: AttributeType;
}

export interface TokenEntities {
    entityTypeID: string;
}
