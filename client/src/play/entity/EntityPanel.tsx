import React from "react";
import { Button } from "../../common/controls/Button";
import { ItemList } from "../../common/controls/ItemList";
import { defaultSearch } from "../../common/controls/Search";
import { SidePanel } from "../../common/layout/SidePanel";
import { Callback } from "../../util/Callback";
import { EntityCollection } from "../EntityCollection";
import { EntityType, getNameAttributeDefinition } from "../modes/GameMode";
import { AttributeDisplay } from "./AttributeDisplay";
import { GameEntity } from "./GameEntity";

function nameFilter(
    search: string,
    entity: GameEntity,
    entityType: EntityType
): boolean {
    return defaultSearch({
        needle: search,
        haystack: entity.getAttributeAsString(
            getNameAttributeDefinition(entityType)
        )
    });
}

export function EntityPanel({
    campaignID,
    onAddEntity,
    entities,
    entityType,
    onEditEntity
}: {
    campaignID: string;
    onAddEntity: Callback<GameEntity>;
    entities: EntityCollection;
    entityType: EntityType;
    onEditEntity: Callback<GameEntity>;
}) {
    return (
        <SidePanel header={entityType.pluralName}>
            <ItemList
                data={entities.getByType(entityType)}
                id={e => e.entityID()}
                left={e => (
                    <div onClick={() => onEditEntity(e)}>
                        <AttributeDisplay
                            entity={e}
                            attribute={getNameAttributeDefinition(entityType)}
                            placeholder={entityType.name}
                        />
                    </div>
                )}
                filter={(s, e) => nameFilter(s, e, entityType)}
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
