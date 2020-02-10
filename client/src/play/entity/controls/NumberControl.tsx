import React from "react";
import { NumberInput } from "../../../common/controls/Input";
import { getAttribute } from "../../modes/GameMode";
import { ControlProps } from "./Control";

export function NumberControl({
    attributeId,
    entityType,
    entity
}: ControlProps) {
    const attributeDefinition = getAttribute(attributeId, entityType);
    const attribute = entity.getAttribute(attributeDefinition);
    return (
        <div>
            <label>{attributeDefinition.name}</label>
            <NumberInput
                value={attribute?.numberValue || 0}
                onChange={() => {}}
            />
        </div>
    );
}
