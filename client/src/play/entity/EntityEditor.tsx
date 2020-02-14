import { EntityDelta } from "protocol/src/EntityDelta";
import React from "react";
import { Tab, Tabs } from "../../common/layout/Tabs";
import { Callback } from "../../util/Callback";
import { GameMode } from "../modes/GameMode";
import { EntityDeltaFactory } from "./EntityDeltaFactory";
import "./EntityEditor.css";
import { EntityComponents } from "./EntityEditorLayout";
import { GameEntity } from "./GameEntity";

export function EntityEditor({
    entity,
    gameMode,
    onChange,
    deltaFactory
}: {
    entity: GameEntity;
    gameMode: GameMode;
    onChange: Callback<EntityDelta>;
    deltaFactory: EntityDeltaFactory;
}) {
    const entityType = entity.getEntityType(gameMode);
    const editor = entityType.editor;
    return (
        <div className="entity-editor">
            <Tabs>
                {editor.pages.map(p => (
                    <Tab id={p.name} key={p.name} title={p.name}>
                        <EntityComponents
                            components={p.components}
                            entity={entity}
                            entityType={entityType}
                            onChange={onChange}
                            deltaFactory={deltaFactory}
                        />
                    </Tab>
                ))}
            </Tabs>
        </div>
    );
}
