import React from "react";
import { Tab, Tabs } from "../../common/layout/Tabs";
import { GameMode } from "../modes/GameMode";
import "./EntityEditor.css";
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
                <Tab id="foo1" title="Foo1">
                    a
                </Tab>
                <Tab id="foo2" title="Foo2">
                    b
                </Tab>
                <Tab id="foo3" title="Foo3">
                    c
                </Tab>
            </Tabs>
        </div>
    );
}
