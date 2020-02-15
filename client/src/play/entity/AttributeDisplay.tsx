import React from "react";
import { assertExhaustive } from "../../util/Exaustive";
import { Attributes } from "../modes/Attributes";
import { AttributeDefinition, AttributeType } from "../modes/GameMode";
import "./AttributeDisplay.css";
import { GameEntity } from "./GameEntity";

export function AttributeDisplay({
    entity,
    attribute,
    placeholder
}: {
    entity: GameEntity;
    attribute: AttributeDefinition;
    placeholder?: string;
}) {
    const value = entity.getAttribute(attribute);

    if (value == null) {
        return (
            <span className="attribute-display__placeholder">
                {placeholder}
            </span>
        );
    }

    switch (attribute.type) {
        case AttributeType.Number:
            return (
                <span>
                    {Attributes.getAttributeNumberValue(attribute, entity)}
                </span>
            );
        case AttributeType.Text:
        case AttributeType.RichText:
            return (
                <span>
                    {Attributes.getAttributeStringValue(attribute, entity)}
                </span>
            );
        default:
            assertExhaustive(attribute);
    }
}
