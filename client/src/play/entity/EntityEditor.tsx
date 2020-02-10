import React from "react";
import { Tab, Tabs } from "../../common/layout/Tabs";
import { GameMode } from "../modes/GameMode";
import "./EntityEditor.css";
import { EntityComponents } from "./EntityEditorLayout";
import { GameEntity } from "./GameEntity";

export function EntityEditor({
    entity,
    gameMode
}: {
    entity: GameEntity;
    gameMode: GameMode;
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
                        />
                    </Tab>
                ))}
            </Tabs>
        </div>
    );
}
