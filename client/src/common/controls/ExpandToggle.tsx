import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { Icon } from "./Icon";

export function ExpandToggle({ expanded }: { expanded: boolean }) {
    if (expanded) {
        return <Icon icon={faCaretUp} />;
    } else {
        return <Icon icon={faCaretDown} />;
    }
}
