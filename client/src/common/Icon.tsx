import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export function Icon({ icon }: { icon: IconProp }) {
    return <FontAwesomeIcon icon={icon} />;
}

export function Spinner() {
    return <FontAwesomeIcon icon={faCircleNotch} spin />;
}
