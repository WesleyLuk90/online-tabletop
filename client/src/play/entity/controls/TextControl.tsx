import React from "react";
import { Input } from "../../../common/controls/Input";
import { Attributes } from "../../modes/Attributes";
import { TextAttribute } from "../../modes/GameMode";
import { ControlProps } from "./EntityControl";
import "./TextControl.css";

export function TextControl({
    attributeID,
    entityType,
    entity,
    updateAttribute
}: ControlProps) {
    const attributeDefinition = Attributes.getAttribute(
        attributeID,
        entityType
    ) as TextAttribute;
    return (
        <div className="text-control">
            <label>{attributeDefinition.name}</label>
            <div className="text-control__input">
                <Input
                    value={Attributes.getAttributeStringValue(
                        attributeDefinition,
                        entity
                    )}
                    onChange={stringValue =>
                        updateAttribute({
                            attributeID,
                            stringValue
                        })
                    }
                />
            </div>
        </div>
    );
}
