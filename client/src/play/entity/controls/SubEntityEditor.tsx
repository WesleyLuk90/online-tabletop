import React from "react";
import { Attributes } from "../../modes/Attributes";
import { ControlProps } from "./EntityControl";

export function SubEntityEditor({
    entity,
    entityType,
    attributeID,
    gameMode
}: ControlProps) {
    const attributeType = entityType.getSubEntityAttribute(attributeID);
    const type = gameMode.getEntityType(attributeType.subEntityType);
    const subEntities = Attributes.getSubEntityAttribute(attributeType, entity);
    return (
        <div className="sub-entity-editor">
            {type.pluralName}
            <div className="sub-entity-editor__entities">
                {subEntities.map(e => (
                    <div className="sub-entity-editor__entity">{e}</div>
                ))}
            </div>
        </div>
    );
}
