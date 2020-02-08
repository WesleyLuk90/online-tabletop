import React, { ReactNode } from "react";
import "./Alert.css";

export function Alert({ children }: { children: ReactNode }) {
    return <div className="alert">{children}</div>;
}
