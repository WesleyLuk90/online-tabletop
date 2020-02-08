import React from "react";
import { Column, Component, Page, Row, Section } from "../modes/Editor";

interface LayoutProps<L> {
    layout: L;
}

export function EntityPage(props: LayoutProps<Page>) {
    return (
        <div>
            {props.layout.sections.map((s, i) => (
                <EntitySection key={i} {...props} layout={s} />
            ))}
        </div>
    );
}

export function EntitySection(props: LayoutProps<Section>) {
    return (
        <section>
            <h3>{props.layout.label}</h3>
            {props.layout.rows.map((r, i) => (
                <EntityRow key={i} {...props} layout={r} />
            ))}
        </section>
    );
}

export function EntityRow(props: LayoutProps<Row>) {
    return (
        <div>
            {props.layout.columns.map((c, i) => (
                <EntityColumn key={i} {...props} layout={c} />
            ))}
        </div>
    );
}

export function EntityColumn(props: LayoutProps<Column>) {
    return (
        <div>
            {props.layout.components.map((c, i) => (
                <EntityComponent key={i} {...props} layout={c} />
            ))}
        </div>
    );
}

export function EntityComponent(props: LayoutProps<Component>) {
    return <div>{props.layout.attributeID}</div>;
}
