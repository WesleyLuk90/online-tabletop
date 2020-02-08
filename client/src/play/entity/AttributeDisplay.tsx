import React from "react";
import { assertExhaustive } from "../../util/Exaustive";
import { AttributeDefinition, AttributeType } from "../modes/GameMode";
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
        return <span>{placeholder}</span>;
    }

    switch (attribute.type) {
        case AttributeType.Number:
            return <span>{value.numberValue}</span>;
        case AttributeType.Text:
        case AttributeType.RichText:
            return <span>{value.stringValue}</span>;
        default:
            assertExhaustive(attribute.type);
    }
}
