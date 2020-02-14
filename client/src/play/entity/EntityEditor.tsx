import React from "react";
import { Tab, Tabs } from "../../common/layout/Tabs";
import { DispatchGameEvent } from "../gamestate/events/GameEvent";
import { GameMode } from "../modes/GameMode";
import { EntityDeltaFactory } from "./EntityDeltaFactory";
import "./EntityEditor.css";
import { EntityComponents } from "./EntityEditorLayout";
import { GameEntity } from "./GameEntity";

export function EntityEditor({
    entity,
    gameMode,
    deltaFactory,
    dispatch
}: {
    entity: GameEntity;
    gameMode: GameMode;
    deltaFactory: EntityDeltaFactory;
    dispatch: DispatchGameEvent;
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
                            dispatch={dispatch}
                            deltaFactory={deltaFactory}
                        />
                    </Tab>
                ))}
            </Tabs>
        </div>
    );
}
