import React from "react";
import { assertExhaustive } from "../../../util/Exaustive";
import { Attributes } from "../../modes/Attributes";
import { Control } from "../../modes/Editor";
import {
    NumberAttribute,
    RichTextAttribute,
    SubEntityAttribute,
    TextAttribute
} from "../../modes/GameMode";
import { LayoutProps } from "../EntityComponent";
import { NumberControl } from "./NumberControl";
import { TextControl } from "./TextControl";

export interface ControlProps extends LayoutProps {
    attributeID: string;
}

export function EntityControl(
    props: { control: Control } & LayoutProps
): React.ReactElement {
    const attribute = Attributes.getAttribute(
        props.control.attributeID,
        props.entityType
    );
    if (attribute instanceof NumberAttribute) {
        return (
            <NumberControl {...props} attributeID={props.control.attributeID} />
        );
    } else if (attribute instanceof TextAttribute) {
        return (
            <TextControl {...props} attributeID={props.control.attributeID} />
        );
    } else if (attribute instanceof RichTextAttribute) {
        return <div></div>;
    } else if (attribute instanceof SubEntityAttribute) {
        return <div></div>;
    } else {
        return assertExhaustive(attribute);
    }
}
