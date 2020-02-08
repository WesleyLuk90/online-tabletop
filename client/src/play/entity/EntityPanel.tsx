import React from "react";
import { Button } from "../../common/forms/Button";
import { ItemList } from "../../common/ItemList";
import { SidePanel } from "../../common/SidePanel";
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
