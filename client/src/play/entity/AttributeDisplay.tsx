import React from "react";
import { assertExhaustive } from "../../util/Exaustive";
import { Attributes } from "../modes/Attributes";
import {
    AttributeDefinition,
    NumberAttribute,
    RichTextAttribute,
    SubEntityAttribute,
    TextAttribute
} from "../modes/GameMode";
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

    if (attribute instanceof NumberAttribute) {
        return (
            <span>{Attributes.getAttributeNumberValue(attribute, entity)}</span>
        );
    } else if (
        attribute instanceof TextAttribute ||
        attribute instanceof RichTextAttribute
    ) {
        return (
            <span>{Attributes.getAttributeStringValue(attribute, entity)}</span>
        );
    } else if (attribute instanceof SubEntityAttribute) {
        return (
            <span>
                {/* {Attributes.getSubEntityAttribute(attribute, entity)} */}
            </span>
        );
    } else {
        return assertExhaustive(attribute);
    }
}
