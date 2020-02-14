import { Token } from "protocol/src/Token";
import {
    applyUpdateToken,
    CreateToken,
    DeleteToken,
    UpdateToken
} from "protocol/src/TokenDelta";
import { TokenUpdate } from "protocol/src/Update";
import { TokenRequests } from "../games/TokenRequests";
import { Callback } from "../util/Callback";
import { ConflictResolver } from "../util/ConflictResolver";
import { assertExhaustive } from "../util/Exaustive";
import { PromiseDebouncer } from "../util/PromiseDebouncer";
import { GameEvent } from "./gamestate/events/GameEvent";
import { GameState } from "./gamestate/GameState";

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
    private sceneID: string | null = null;
    private debounce = new PromiseDebouncer<Token[]>();
    private conflictResolver: TokenConflictResolver;

    constructor(
        private sessionID: string,
        private campaignID: string,
        private update: Callback<GameEvent>
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

    private async loadTokens() {
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

    applyLocalUpdate(update: TokenUpdate[]) {
        // this.conflictResolver.applyLocalUpdate(update);//FIXME
    }

    private tokenCreate(create: CreateToken) {
        this.conflictResolver.add(create.token);
        this.gameStateUpdater(s => {
            if (s.tokens.byId(create.token.tokenID) == null) {
                return s.build(b => b.addToken(create.token));
            } else {
                return s;
            }
        });
    }

    private tokenUpdate(update: UpdateToken) {
        if (update.source === this.sessionID) {
            return;
        }
        this.conflictResolver.applyLocalUpdate(update);
    }

    private updateToken(token: Token) {
        this.gameStateUpdater(s => s.build(b => b.updateToken(token)));
    }

    private tokenDelete(del: DeleteToken) {
        this.conflictResolver.remove(del.tokenID);
        this.gameStateUpdater(s => s.build(b => b.removeToken(del.tokenID)));
    }
}
