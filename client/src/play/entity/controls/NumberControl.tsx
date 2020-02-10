import React from "react";
import { NumberInput } from "../../../common/controls/Input";
import { Attributes } from "../../modes/Attributes";
import { ControlProps } from "./Control";
import "./NumberControl.css";

export function NumberControl({
    attributeID,
    entityType,
    entity
}: ControlProps) {
    const attributeDefinition = Attributes.getAttribute(
        attributeID,
        entityType
    );
    return (
        <div className="number-control">
            <label>{attributeDefinition.name}</label>
            <div className="number-control__input">
                <NumberInput
                    value={Attributes.getAttributeNumberValue(
                        attributeDefinition,
                        entity
                    )}
                    onChange={() => {}}
                />
            </div>
        </div>
    );
}
