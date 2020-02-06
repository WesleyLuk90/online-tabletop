import { Token } from "protocol/src/Token";
import {
    applyUpdateToken,
    CreateToken,
    DeleteToken,
    UpdateToken
} from "protocol/src/TokenDelta";
import { TokenUpdate } from "protocol/src/Update";
import { TokenRequests } from "../games/TokenRequests";
import { ConflictResolver } from "../util/ConflictResolver";
import { assertExhaustive } from "../util/Exaustive";
import { PromiseDebouncer } from "../util/PromiseDebouncer";
import { GameStateUpdater } from "./CampaignLoader";
import { GameState } from "./GameState";

class TokenConflictResolver extends ConflictResolver<Token, UpdateToken> {
    constructor(session: string, protected onUpdated: (token: Token) => void) {
        super(session);
    }

    protected getID(data: Token): string {
        return data.tokenID;
    }

    protected updateID(update: UpdateToken): string {
        return update.tokenID;
    }

    protected applyUpdate(token: Token, update: UpdateToken): Token {
        return applyUpdateToken(token, update);
    }
}

export class TokenManager {
    sceneID: string | null = null;
    debounce = new PromiseDebouncer<Token[]>();
    conflictResolver: TokenConflictResolver;

    constructor(
        private sessionID: string,
        private campaignID: string,
        private gameStateUpdater: GameStateUpdater
    ) {
        this.conflictResolver = new TokenConflictResolver(sessionID, token =>
            this.updateToken(token)
        );
    }

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
        this.conflictResolver.updateAll(tokens);
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
        this.conflictResolver.add(create.token);
        this.gameStateUpdater(s => {
            if (s.tokens.byId(create.token.tokenID) == null) {
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
        this.conflictResolver.applyLocalUpdate(update);
    }

    updateToken(token: Token) {
        this.gameStateUpdater(s => s.build(b => b.updateToken(token)));
    }

    tokenDelete(del: DeleteToken) {
        this.conflictResolver.remove(del.tokenID);
        this.gameStateUpdater(s => s.build(b => b.removeToken(del.tokenID)));
    }
}
