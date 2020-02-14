import { CampaignRequests } from "../../../games/CampaignRequests";
import { GameState } from "../GameState";
import { GameEvent } from "./GameEvent";

export class RequestChangeDefaultScene implements GameEvent {
    constructor(private sceneID: string) {}

    update(gameState: GameState): GameState {
        const g = gameState.build(b => b.changeDefaultScene(this.sceneID));
        CampaignRequests.update(g.campaign);
        return g;
    }
}
