import { EntityData, EntityTemplateData } from "./EntityData";
import { iots } from "./iots";

const LayerDataSchema = iots.strict({});
const SceneDataSchema = iots.strict({
    id: iots.string,
    name: iots.string,
    layers: iots.array(LayerDataSchema),
    gridSize: iots.number,
});
const PlayerDataSchema = iots.strict({
    id: iots.string,
    name: iots.string,
});

const CampaignDataSchema = iots.strict({
    id: iots.string,
    name: iots.string,
    gameMode: iots.string,
    players: iots.array(PlayerDataSchema),
    scenes: iots.array(SceneDataSchema),
    entities: iots.array(EntityData),
    entityTemplates: iots.array(EntityTemplateData),
});
