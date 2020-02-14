import { Campaign } from "protocol/src/Campaign";
import { GameState } from "../GameState";
import { GameEventType } from "./GameEvent";

export class UpdateCampaign implements GameEventType {
    constructor(private campaign: Campaign) {}

    update(gameState: GameState): GameState {
        const g = gameState.build(b => b.updateCampaign(this.campaign));
        return g;
    }
}
