import React from "react";
import { Button } from "../common/Button";
import { SidePanel } from "../common/SidePanel";
import { Callback } from "../util/Callback";
import { GameEntity } from "./entity/GameEntity";
import { EntityCollection } from "./EntityCollection";
import { EntityType } from "./modes/GameMode";

export function EntityPanel({
    campaignID,
    onAddEntity,
    entities,
    entityType
}: {
    campaignID: string;
    onAddEntity: Callback<GameEntity>;
    entities: EntityCollection;
    entityType: EntityType;
}) {
    return (
        <SidePanel header={entityType.pluralName}>
            <Button
                onClick={() =>
                    onAddEntity(GameEntity.create(campaignID, entityType))
                }
            >
                Add {entityType.name}
            </Button>
        </SidePanel>
    );
}
