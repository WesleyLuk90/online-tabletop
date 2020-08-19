import { Attribute } from "engine/models/Entity";
import React from "react";
import { BemBuilder } from "../../util/BemBuilder";
import { Callback } from "../../util/Callback";
import { assertExhaustive } from "../../util/Exaustive";
import { Component, Control, Row, Section } from "../modes/Editor";
import { EntityType, GameMode } from "../modes/GameMode";
import { EntityControl } from "./controls/EntityControl";
import "./EntityComponent.css";
import { GameEntity } from "./GameEntity";

export interface LayoutProps {
    entity: GameEntity;
    entityType: EntityType;
    updateAttribute: Callback<Attribute>;
    gameMode: GameMode;
}

export function EntityComponents(
    props: { components: Component[] } & LayoutProps
) {
    return (
        <>
            {props.components.map((s, i) => (
                <EntityComponent key={i} {...props} component={s} />
            ))}
        </>
    );
}

export function EntityComponent(props: { component: Component } & LayoutProps) {
    const BEM = new BemBuilder("entity-component");
    const { component } = props;
    if (component instanceof Control) {
        return (
            <div>
                <EntityControl {...props} control={component} />
            </div>
        );
    } else if (component instanceof Row) {
        return (
            <div className={BEM.element("row")}>
                {component.columns.map((c, i) => (
                    <div
                        key={i}
                        className={BEM.element("column")}
                        style={{ width: `${(c.width * 100) / 12}%` }}
                    >
                        <EntityComponents
                            {...props}
                            components={c.components}
                        />
                    </div>
                ))}
            </div>
        );
    } else if (component instanceof Section) {
        return (
            <section>
                <h2>{component.label}</h2>
                <EntityComponents
                    {...props}
                    components={component.components}
                />
            </section>
        );
    } else {
        return assertExhaustive(component);
    }
}
