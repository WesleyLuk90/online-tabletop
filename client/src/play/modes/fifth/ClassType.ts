import { range } from "../../../util/Range";
import { Editor } from "../Editor";
import { EntityType, NumberAttribute, TextAttribute } from "../GameMode";

export const ClassType: EntityType = new EntityType(
    "class",
    "Class",
    "Classes",
    [
        new TextAttribute("name", "Name"),
        ...range(1, 10).map(
            level =>
                new NumberAttribute(
                    `level-${level}-spell-slots`,
                    `Level ${level} Spell Slots`
                )
        )
    ],
    new Editor([]),
    "name"
);
