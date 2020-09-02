import { Campaign } from "../engine/models/Campaign";
import { Layer } from "../engine/models/Layer";
import { Player } from "../engine/models/Player";
import { Scene } from "../engine/models/Scene";
import { findGameMode } from "../gamemodes/GameModes";
import { ColorDataSchema, ColorDataSerde } from "./Color";
import {
    EntityDataSchema,
    EntityDataSerde,
    EntityTemplateDataSchema,
    EntityTemplateDataSerde,
} from "./EntityData";
import { iots } from "./iots";
import { deserializeCollection, Serde, serializeCollection } from "./Serde";
const LayerDataSchema = iots.strict({
    id: iots.string,
    name: iots.string,
    color: ColorDataSchema,
    playerVisible: iots.boolean,
});
export interface LayerData extends iots.TypeOf<typeof LayerDataSchema> {}
export const LayerDataSerde: Serde<Layer, LayerData> = {
    deserialize(data: LayerData): Layer {
        return new Layer(
            data.id,
            data.name,
            ColorDataSerde.deserialize(data.color),
            data.playerVisible
        );
    },
    serialize(layer: Layer): LayerData {
        return {
            id: layer.id,
            name: layer.name,
            color: ColorDataSerde.serialize(layer.color),
            playerVisible: layer.playerVisible,
        };
    },
};
const SceneDataSchema = iots.strict({
    id: iots.string,
    name: iots.string,
    layers: iots.array(LayerDataSchema),
    gridSize: iots.number,
});
export interface SceneData extends iots.TypeOf<typeof SceneDataSchema> {}
export const SceneDataSerde: Serde<Scene, SceneData> = {
    deserialize(data: SceneData): Scene {
        return new Scene(
            data.id,
            data.name,
            data.layers.map(LayerDataSerde.deserialize),
            data.gridSize
        );
    },
    serialize(scene: Scene): SceneData {
        return {
            id: scene.id,
            name: scene.name,
            gridSize: scene.gridSize,
            layers: scene.layers,
        };
    },
};
export const PlayerDataSchema = iots.strict({
    id: iots.string,
    name: iots.string,
    isGameMaster: iots.boolean,
});
export interface PlayerData extends iots.TypeOf<typeof PlayerDataSchema> {}
export const PlayerDataSerde: Serde<Player, PlayerData> = {
    deserialize(data: PlayerData): Player {
        return new Player(data.id, data.name, data.isGameMaster);
    },
    serialize(player: Player): PlayerData {
        return {
            id: player.id,
            name: player.name,
            isGameMaster: player.isGameMaster,
        };
    },
};

const CampaignDataSchema = iots.strict({
    id: iots.string,
    name: iots.string,
    gameMode: iots.string,
    players: iots.array(PlayerDataSchema),
    scenes: iots.array(SceneDataSchema),
    entities: iots.array(EntityDataSchema),
    entityTemplates: iots.array(EntityTemplateDataSchema),
});

export interface CampaignData extends iots.TypeOf<typeof CampaignDataSchema> {}

export const CampaignDataSerde: Serde<Campaign, CampaignData> = {
    deserialize(data: CampaignData): Campaign {
        return new Campaign(
            data.id,
            data.name,
            deserializeCollection(data.scenes, SceneDataSerde),
            deserializeCollection(data.entities, EntityDataSerde),
            deserializeCollection(
                data.entityTemplates,
                EntityTemplateDataSerde
            ),
            findGameMode(data.gameMode),
            deserializeCollection(data.players, PlayerDataSerde)
        );
    },
    serialize(campaign: Campaign): CampaignData {
        return {
            id: campaign.id,
            name: campaign.name,
            gameMode: campaign.gameMode.id,
            players: serializeCollection(campaign.players, PlayerDataSerde),
            entities: serializeCollection(campaign.entities, EntityDataSerde),
            entityTemplates: serializeCollection(
                campaign.entityTemplates,
                EntityTemplateDataSerde
            ),
            scenes: serializeCollection(campaign.scenes, SceneDataSerde),
        };
    },
};
