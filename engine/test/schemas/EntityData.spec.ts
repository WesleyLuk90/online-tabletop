import { Action } from "../../src/engine/models/Action";
import {
    Attribute,
    ComputedAttribute,
    NumberAttribute,
    SubEntityAttribute,
} from "../../src/engine/models/Attribute";
import { Entity } from "../../src/engine/models/Entity";
import { RollParser } from "../../src/engine/rolls/RollParser";
import { EntityDataSerde } from "../../src/schemas/EntityData";
import { Collection } from "../../src/utils/Collection";

describe("EntityData", () => {
    it("should serialize", () => {
        const entity = new Entity(
            "foo",
            "bar",
            Collection.of<Attribute>(
                new NumberAttribute("a", 10),
                new ComputedAttribute("c", RollParser.parseChecked("10")),
                new SubEntityAttribute("foo", Collection.empty())
            ),
            Collection.of(
                new Action("a", "b", "c", RollParser.parseChecked("20"))
            )
        );

        expect(
            EntityDataSerde.deserialize(EntityDataSerde.serialize(entity))
        ).toEqual(entity);
    });
});
