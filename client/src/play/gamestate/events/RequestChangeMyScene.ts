import { CampaignRequests } from "../../../games/CampaignRequests";
import { GameState } from "../GameState";
import { GameEventType } from "./GameEvent";

export class RequestChangeMyScene implements GameEventType {
    constructor(private sceneID: string) {}

    update(gameState: GameState): GameState {
        const g = gameState.build(b => b.changeMyScene(this.sceneID));
        CampaignRequests.update(g.campaign);
        return g;
    }
}
