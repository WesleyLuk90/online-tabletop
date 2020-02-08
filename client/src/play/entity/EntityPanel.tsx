import React from "react";
import { ItemList } from "../../common/controls/ItemList";
import { Button } from "../../common/forms/Button";
import { SidePanel } from "../../common/layout/SidePanel";
import { Callback } from "../../util/Callback";
import { EntityCollection } from "../EntityCollection";
import { EntityType, getNameAttributeDefinition } from "../modes/GameMode";
import { AttributeDisplay } from "./AttributeDisplay";
import { GameEntity } from "./GameEntity";

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
            <ItemList
                data={entities.getByType(entityType)}
                id={e => e.entityID()}
                left={e => (
                    <AttributeDisplay
                        entity={e}
                        attribute={getNameAttributeDefinition(entityType)}
                    />
                )}
            />
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
