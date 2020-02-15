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
    RichText = "RichText",
    SubEntities = "SubEntities"
}

export interface NumberAttribute {
    id: string;
    name: string;
    type: AttributeType.Number;
    defaultValue?: number;
}

export interface TextAttribute {
    id: string;
    name: string;
    type: AttributeType.Text;
}

export interface RichTextAttribute {
    id: string;
    name: string;
    type: AttributeType.RichText;
}

export interface SubEntityAttributeType {
    id: string;
    name: string;
    subEntityType: string;
    type: AttributeType.SubEntities;
}

export type AttributeDefinition =
    | NumberAttribute
    | TextAttribute
    | RichTextAttribute
    | SubEntityAttributeType;

export interface TokenEntities {
    entityTypeID: string;
}
