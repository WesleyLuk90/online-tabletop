import { range } from "../../../util/Range";
import { Editor } from "../Editor";
import { AttributeType, EntityType } from "../GameMode";

export const ClassType: EntityType = {
    id: "class",
    name: "Class",
    pluralName: "Classes",
    attributes: [
        {
            id: "name",
            name: "Name",
            type: AttributeType.Text
        },
        ...range(1, 10).map(level => ({
            id: `level-${level}-spell-slots`,
            name: `Level ${level} Spell Slots`,
            type: AttributeType.Number
        }))
    ],
    editor: new Editor([]),
    nameAttributeID: "name"
};
