import { Campaign } from "../src/engine/models/Campaign";
import { Entity } from "../src/engine/models/Entity";
import { EntityTemplate } from "../src/engine/models/EntityTemplate";
import { FifthEditionGameMode } from "../src/gamemodes/FifthEdition";
import { Collection } from "../src/utils/Collection";
import { uuid } from "../src/utils/Uuid";

describe("Game", () => {
    it("should", () => {
        const entityTemplate = new EntityTemplate(uuid(), Collection.empty());
        const entity = new Entity(
            uuid(),
            entityTemplate.id,
            Collection.empty()
        );
        Campaign.empty(uuid(), "Game", FifthEditionGameMode)
            .addEntityTemplate(entityTemplate)
            .addEntity(entity);
    });
});
