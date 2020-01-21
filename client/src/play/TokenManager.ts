import { Token } from "protocol/src/Token";
import { TokenRequests } from "../games/TokenRequests";
import { PromiseDebouncer } from "../util/PromiseDebouncer";
import { GameStateUpdater } from "./CampaignLoader";
import { GameState } from "./GameState";

export class TokenManager {
    sceneID: string | null = null;
    debounce = new PromiseDebouncer<Token[]>();

    constructor(
        private campaignID: string,
        private gameStateUpdater: GameStateUpdater
    ) {}

    updateScene(sceneID: string | null) {
        const changed = this.sceneID !== sceneID;
        this.sceneID = sceneID;
        if (changed) {
            this.gameStateUpdater((g: GameState) =>
                g.build(b => b.updateTokens([]))
            );
            this.loadTokens();
        }
    }

    async loadTokens() {
        if (this.sceneID == null) {
            return;
        }
        const tokens = await this.debounce.debounce(
            TokenRequests.list({
                campaignID: this.campaignID,
                sceneID: this.sceneID
            })
        );
        this.gameStateUpdater(g => g.build(b => b.updateTokens(tokens)));
    }
}
