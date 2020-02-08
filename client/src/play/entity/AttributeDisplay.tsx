import React from "react";
import { AttributeDefinition } from "../modes/GameMode";
import { GameEntity } from "./GameEntity";

export function AttributeDisplay({
    entity,
    attribute
}: {
    entity: GameEntity;
    attribute: AttributeDefinition;
}) {
    const value = entity.getAttribute(attribute);

    if (value == null) {
        return null;
    }

    return <span></span>;
}
