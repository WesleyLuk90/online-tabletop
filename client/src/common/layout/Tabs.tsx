import React, { ReactElement, useState } from "react";
import { BemBuilder } from "../../util/BemBuilder";
import "./Tabs.css";

export interface TabProps {
    id: string;
    title: string;
    children: React.ReactNode;
}

const BEM = new BemBuilder("tabs");

export function Tab({ children }: TabProps) {
    return <div className={BEM.element("content")}>{children}</div>;
}

export function Tabs({
    children
}: {
    children: ReactElement<TabProps, typeof Tab>[];
}) {
    const [tab, setTab] = useState("");
    const child = children.find(c => c.props.id === tab) || children[0];

    return (
        <div className={BEM.block()}>
            <div className={BEM.element("tab-row")}>
                {children.map(c => (
                    <button
                        className={BEM.element("tab", "active", child === c)}
                        key={c.props.id}
                        onClick={() => setTab(c.props.id)}
                    >
                        {c.props.title}
                    </button>
                ))}
            </div>
            {child}
        </div>
    );
}
