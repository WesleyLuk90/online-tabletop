import React from "react";
import { Button } from "../../common/controls/Button";
import { ItemList } from "../../common/controls/ItemList";
import { defaultSearch } from "../../common/controls/Search";
import { SidePanel } from "../../common/layout/SidePanel";
import { EntityCollection } from "../EntityCollection";
import { EditEntity } from "../gamestate/events/EditEntity";
import { DispatchGameEvent } from "../gamestate/events/GameEvent";
import { Attributes } from "../modes/Attributes";
import { EntityType } from "../modes/GameMode";
import { Services } from "../Services";
import { AttributeDisplay } from "./AttributeDisplay";
import "./EntityPanel.css";
import { GameEntity } from "./GameEntity";

function nameFilter(
    search: string,
    entity: GameEntity,
    entityType: EntityType
): boolean {
    return defaultSearch({
        needle: search,
        haystack: entity.formatAttribute(
            Attributes.getNameAttributeDefinition(entityType)
        ),
    });
}

export function EntityPanel({
    entities,
    entityType,
    dispatch,
    services,
}: {
    entities: EntityCollection;
    entityType: EntityType;
    dispatch: DispatchGameEvent;
    services: Services;
}) {
    return (
        <SidePanel header={entityType.pluralName}>
            <ItemList
                data={entities.getByType(entityType)}
                id={(e) => e.id()}
                left={(e) => (
                    <div
                        onClick={() => dispatch(new EditEntity(e))}
                        className="entity-panel__entity-link"
                    >
                        <AttributeDisplay
                            entity={e}
                            attribute={Attributes.getNameAttributeDefinition(
                                entityType
                            )}
                            placeholder={entityType.name}
                        />
                    </div>
                )}
                filter={(s, e) => nameFilter(s, e, entityType)}
            />
            <Button
                onClick={() => services.entityService().createNew(entityType)}
            >
                Add {entityType.name}
            </Button>
        </SidePanel>
    );
}
