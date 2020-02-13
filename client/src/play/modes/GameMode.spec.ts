import { AttributeType, EntityType } from "./GameMode";
import { GameModes } from "./GameModes";

describe("GameMode", () => {
    function validateNameAttribute(entity: EntityType) {
        expect(entity.attributes.map(a => a.id)).toContain(
            entity.nameAttributeID
        );
        expect(
            entity.attributes.find(a => a.id === entity.nameAttributeID)?.type
        ).toBe(AttributeType.Text);
    }

    it("should validate", () => {
        GameModes.forEach(g => g.entityTypes.forEach(validateNameAttribute));
    });
});
