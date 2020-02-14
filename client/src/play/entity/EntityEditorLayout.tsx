import React from "react";
import { assertExhaustive } from "../../util/Exaustive";
import { Component } from "../modes/Editor";
import { EntityType } from "../modes/GameMode";
import { EntityControl } from "./controls/Control";
import { GameEntity } from "./GameEntity";

export interface LayoutProps {
    entity: GameEntity;
    entityType: EntityType;
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
    const { component } = props;
    switch (component.type) {
        case "control":
            return (
                <div>
                    <EntityControl {...props} control={component} />
                </div>
            );
        case "control-row":
            return (
                <div>
                    {component.controls.map(c => (
                        <EntityControl {...props} control={c} />
                    ))}
                </div>
            );
        case "row":
            return (
                <div>
                    {component.columns.map(c => (
                        <div>
                            <EntityComponents
                                {...props}
                                components={c.components}
                            />
                        </div>
                    ))}
                </div>
            );
        case "section":
            return (
                <section>
                    <h2>{component.label}</h2>
                    <EntityComponents
                        {...props}
                        components={component.components}
                    />
                </section>
            );
        default:
            assertExhaustive(component);
    }
}