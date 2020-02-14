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
import { DispatchGameEvent } from "./gamestate/events/GameEvent";
import {
    AddTokenEvent,
    DeleteTokenEvent,
    UpdateTokenEvent
} from "./gamestate/events/TokenEvents";
import { UpdateAllTokens } from "./gamestate/events/UpdateAllTokens";

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
        private dispatch: DispatchGameEvent
    ) {
        this.conflictResolver = new TokenConflictResolver(sessionID, token =>
            this.updateToken(token)
        );
    }

    updateScene(sceneID: string | null) {
        const changed = this.sceneID !== sceneID;
        this.sceneID = sceneID;
        if (changed) {
            this.dispatch(new UpdateAllTokens([]));
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
        this.dispatch(new UpdateAllTokens(tokens));
    }

    handleTokenUpdate(tokenUpdate: TokenUpdate) {
        const update = tokenUpdate.update;
        switch (update.type) {
            case "create":
                this.createLocally(update);
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

    applyLocalUpdate(update: UpdateToken[]) {
        // this.conflictResolver.applyLocalUpdate(update);//FIXME
    }

    createLocally(create: CreateToken) {
        this.conflictResolver.add(create.token);
        this.dispatch(new AddTokenEvent(create.token));
    }

    private tokenUpdate(update: UpdateToken) {
        if (update.source === this.sessionID) {
            return;
        }
        this.conflictResolver.applyLocalUpdate(update);
    }

    private updateToken(token: Token) {
        this.dispatch(new UpdateTokenEvent(token));
    }

    private tokenDelete(del: DeleteToken) {
        this.dispatch(new DeleteTokenEvent(del.tokenID));
        this.conflictResolver.remove(del.tokenID);
    }
}
