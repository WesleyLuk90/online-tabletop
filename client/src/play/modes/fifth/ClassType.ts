import { Editor } from "../Editor";
import { EntityType } from "../GameMode";

export const ClassType: EntityType = {
    id: "class",
    name: "Class",
    pluralName: "Classes",
    attributes: [],
    editor: new Editor([]),
    nameAttributeID: "name"
};
