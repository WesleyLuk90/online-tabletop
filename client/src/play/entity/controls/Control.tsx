import React from "react";
import { assertExhaustive } from "../../../util/Exaustive";
import { Attributes } from "../../modes/Attributes";
import { Control } from "../../modes/Editor";
import { AttributeType } from "../../modes/GameMode";
import { LayoutProps } from "../EntityEditorLayout";
import { NumberControl } from "./NumberControl";

export interface ControlProps extends LayoutProps {
    attributeID: string;
}

export function EntityControl(props: { control: Control } & LayoutProps) {
    const attribute = Attributes.getAttribute(
        props.control.attributeID,
        props.entityType
    );
    switch (attribute.type) {
        case AttributeType.Number:
            return (
                <NumberControl
                    {...props}
                    attributeID={props.control.attributeID}
                />
            );
        case AttributeType.Text:
            return <div></div>;
        case AttributeType.RichText:
            return <div></div>;
        default:
            assertExhaustive(attribute);
    }
}
