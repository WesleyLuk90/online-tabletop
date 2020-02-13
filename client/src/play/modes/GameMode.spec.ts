import { assertExhaustive } from "../../util/Exaustive";
import { Component, Control } from "./Editor";
import { AttributeType, EntityType } from "./GameMode";
import { GameModes } from "./GameModes";

describe("GameMode", () => {
    const entityTypeValidators = [validateNameAttribute, validateEditor];

    function validateNameAttribute(entity: EntityType) {
        expect(entity.attributes.map(a => a.id)).toContain(
            entity.nameAttributeID
        );
        expect(
            entity.attributes.find(a => a.id === entity.nameAttributeID)?.type
        ).toBe(AttributeType.Text);
    }

    function validateEditor(entity: EntityType) {
        function validateControl(control: Control) {
            expect(entity.attributes.map(a => a.id)).toContain(
                control.attributeID
            );
        }
        function validateComponent(component: Component) {
            switch (component.type) {
                case "control":
                    return validateControl(component);
                case "control-row":
                    return component.controls.forEach(validateControl);
                case "row":
                    return component.columns.forEach(c =>
                        c.components.forEach(validateComponent)
                    );
                case "section":
                    return component.components.forEach(validateComponent);
                default:
                    assertExhaustive(component);
            }
        }
        entity.editor.pages.forEach(page => {
            page.components.forEach(validateComponent);
        });
    }

    it("should validate", () => {
        GameModes.forEach(g =>
            g.entityTypes.forEach(type =>
                entityTypeValidators.forEach(validator => validator(type))
            )
        );
    });
});
