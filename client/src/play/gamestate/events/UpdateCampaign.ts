import { Campaign } from "engine/models/Campaign";
import { GameState } from "../GameState";
import { GameEvent } from "./GameEvent";

export class UpdateCampaign implements GameEvent {
    constructor(private campaign: Campaign) {}

    update(gameState: GameState): GameState {
        const g = gameState.build((b) => b.updateCampaign(this.campaign));
        return g;
    }
}
