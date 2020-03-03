import { assertExhaustive } from "../../util/Exaustive";
import { Component, Control, Row, Section } from "./Editor";
import {
    EntityType,
    GameMode,
    SubEntityAttribute,
    TextAttribute
} from "./GameMode";
import { GameModes } from "./GameModes";

describe("GameMode", () => {
    const gameModeValidators = [validateEntitySubEntities];
    const entityTypeValidators = [
        validateNameAttribute,
        validateEditor,
        validateUniqueAttributes
    ];

    function validateNameAttribute(entity: EntityType) {
        expect(entity.attributes.map(a => a.id)).toContain(
            entity.nameAttributeID
        );
        expect(
            entity.attributes.find(a => a.id === entity.nameAttributeID)
        ).toBeInstanceOf(TextAttribute);
    }

    function validateUniqueAttributes(entity: EntityType) {
        const attributes = entity.attributes.map(a => a.id);
        expect(Array.from(new Set(attributes)).sort()).toEqual(
            attributes.sort()
        );
    }

    function validateEditor(entity: EntityType) {
        function validateControl(control: Control) {
            expect(entity.attributes.map(a => a.id)).toContain(
                control.attributeID
            );
        }
        function validateComponent(component: Component) {
            if (component instanceof Control) {
                return validateControl(component);
            } else if (component instanceof Row) {
                return component.columns.forEach(c =>
                    c.components.forEach(validateComponent)
                );
            } else if (component instanceof Section) {
                return component.components.forEach(validateComponent);
            } else {
                assertExhaustive(component);
            }
        }
        entity.editor.pages.forEach(page => {
            page.components.forEach(validateComponent);
        });
    }

    function validateEntitySubEntities(gameMode: GameMode) {
        gameMode.entityTypes.forEach(entityType =>
            entityType.attributes
                .filter(t => t instanceof SubEntityAttribute)
                .forEach(subEntityType => {
                    expect(gameMode.entityTypes.map(e => e.id)).toContain(
                        (subEntityType as SubEntityAttribute).subEntityType
                    );
                })
        );
    }

    it("should validate", () => {
        GameModes.forEach(g => {
            gameModeValidators.forEach(validator => validator(g));
            g.entityTypes.forEach(type =>
                entityTypeValidators.forEach(validator => validator(type))
            );
        });
    });
});
