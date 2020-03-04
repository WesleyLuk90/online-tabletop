import React from "react";
import { ControlProps } from "./EntityControl";

export function SubEntityEditor({
    entityType,
    attributeID,
    gameMode
}: ControlProps) {
    const attributeType = entityType.getSubEntityAttribute(attributeID);
    const type = gameMode.getEntityType(attributeType.subEntityType);
    return <div>{type.pluralName}</div>;
}
