import { Token } from "protocol/src/Token";
import { CreateToken, DeleteToken, UpdateToken } from "protocol/src/TokenDelta";
import { TokenUpdate } from "protocol/src/Update";
import { TokenRequests } from "../games/TokenRequests";
import { assertExhaustive } from "../util/Exaustive";
import { replaceValue } from "../util/List";
import { PromiseDebouncer } from "../util/PromiseDebouncer";
import { GameStateUpdater } from "./CampaignLoader";
import { GameState } from "./GameState";

export class TokenManager {
    sceneID: string | null = null;
    debounce = new PromiseDebouncer<Token[]>();

    constructor(
        private sessionID: string,
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

    handleTokenUpdate(tokenUpdate: TokenUpdate) {
        const update = tokenUpdate.update;
        switch (update.type) {
            case "create":
                this.tokenCreate(update);
                break;
            case "update":
                this.tokenUpdate(update);
                break;
            case "delete":
                this.tokenDelete(update);
                break;
            default:
                assertExhaustive(update);
        }
    }

    tokenCreate(create: CreateToken) {
        this.gameStateUpdater(s => {
            if (
                s.tokens.find(t => t.tokenID === create.token.tokenID) == null
            ) {
                return s.build(b => b.addToken(create.token));
            } else {
                return s;
            }
        });
    }

    tokenUpdate(update: UpdateToken) {
        if (update.source === this.sessionID) {
            return;
        }
        // FIXME handle token conflicts
        this.gameStateUpdater(s =>
            s.build(b =>
                b.updateTokens(
                    replaceValue(
                        s.tokens,
                        t => t.tokenID === update.tokenID,
                        t => ({ ...t, ...update.update })
                    )
                )
            )
        );
    }

    tokenDelete(del: DeleteToken) {
        this.gameStateUpdater(s => s.build(b => b.removeToken(del.tokenID)));
    }
}
