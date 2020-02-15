import React from "react";
import { Tab, Tabs } from "../../common/layout/Tabs";
import { GameMode } from "../modes/GameMode";
import { Services } from "../Services";
import "./EntityEditor.css";
import { EntityComponents } from "./EntityEditorLayout";
import { GameEntity } from "./GameEntity";

export function EntityEditor({
    entity,
    gameMode,
    services
}: {
    entity: GameEntity;
    gameMode: GameMode;
    services: Services;
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
                            services={services}
                        />
                    </Tab>
                ))}
            </Tabs>
        </div>
    );
}
