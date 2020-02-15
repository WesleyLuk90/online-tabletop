import React from "react";
import { NumberInput } from "../../../common/controls/Input";
import { Attributes } from "../../modes/Attributes";
import { NumberAttribute } from "../../modes/GameMode";
import { ControlProps } from "./EntityControl";
import "./NumberControl.css";

export function NumberControl({
    attributeID,
    entityType,
    entity,
    services
}: ControlProps) {
    const attributeDefinition = Attributes.getAttribute(
        attributeID,
        entityType
    ) as NumberAttribute;
    return (
        <div className="number-control">
            <label className="number-control__label">
                {attributeDefinition.name}
            </label>
            <div className="number-control__input">
                <NumberInput
                    value={Attributes.getAttributeNumberValue(
                        attributeDefinition,
                        entity
                    )}
                    onChange={numberValue =>
                        services.entityService().updateAttribute(entity, {
                            attributeID,
                            numberValue
                        })
                    }
                />
            </div>
        </div>
    );
}
