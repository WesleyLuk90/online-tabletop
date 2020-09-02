import { Campaign } from "../../src/engine/models/Campaign";
import { Layer } from "../../src/engine/models/Layer";
import { Player } from "../../src/engine/models/Player";
import { Scene } from "../../src/engine/models/Scene";
import { FifthEditionGameMode } from "../../src/gamemodes/5e/FifthEdition";
import { CampaignDataSerde } from "../../src/schemas/CampaignData";
import { Collection } from "../../src/utils/Collection";
import { Colors } from "../../src/utils/Color";

describe("CampaignData", () => {
    it("should serialize", () => {
        const campaign = new Campaign(
            "id",
            "foo",
            Collection.of(
                new Scene("a", "b", [new Layer("1", "2", Colors[0], true)], 10)
            ),
            Collection.empty(),
            Collection.empty(),
            FifthEditionGameMode,
            Collection.of(new Player("foo", "bar", true))
        );
        expect(
            CampaignDataSerde.deserialize(CampaignDataSerde.serialize(campaign))
        ).toEqual(campaign);
    });
});
