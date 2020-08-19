import { newUUID } from "engine/engine/models/Id";
import { User } from "engine/engine/models/User";
import { Callback } from "../util/Callback";
import { CampaignEventHandler } from "./CampaignEventHandler";
import { CampaignLoader } from "./CampaignLoader";
import { EntityDeltaFactory } from "./entity/EntityDeltaFactory";
import { EntityService } from "./entity/EntityService";
import { EntityManager } from "./EntityManager";
import { GameEvent } from "./gamestate/events/GameEvent";
import { GameState } from "./gamestate/GameState";
import { TokenManager } from "./TokenManager";
import { TokenDeltaFactory } from "./tokens/TokenDeltaFactory";
import { TokenService } from "./tokens/TokenService";

export function lazy<T>(f: () => T): () => T {
    let value: T | null = null;
    let isProcessing = false;
    let isComputed = false;
    return (): T => {
        if (!isComputed) {
            if (isProcessing) {
                throw new Error("Circular dependency");
            }
            isProcessing = true;
            value = f();
            isProcessing = false;
            isComputed = true;
        }
        return value as any;
    };
}

export class Services {
    readonly sessionID = newUUID();
    constructor(
        readonly campaignID: string,
        readonly user: User,
        readonly dispatch: Callback<GameEvent | GameState | null>
    ) {}

    readonly loader = lazy(
        () =>
            new CampaignLoader(
                this.campaignID,
                this.user,
                this.dispatch,
                this.eventHandler(),
                this.tokenManager(),
                this.entityManager()
            )
    );
    readonly eventHandler = lazy(() => new CampaignEventHandler(this.dispatch));
    readonly tokenManager = lazy(
        () => new TokenManager(this.sessionID, this.campaignID, this.dispatch)
    );
    readonly entityManager = lazy(
        () => new EntityManager(this.sessionID, this.campaignID, this.dispatch)
    );
    readonly entityDeltaFactory = lazy(
        () => new EntityDeltaFactory(this.campaignID, this.sessionID)
    );
    readonly tokenDeltaFactory = lazy(
        () => new TokenDeltaFactory(this.sessionID, this.campaignID)
    );
    readonly tokenService = lazy(
        () => new TokenService(this.tokenDeltaFactory(), this.tokenManager())
    );
    readonly entityService = lazy(
        () =>
            new EntityService(
                this.campaignID,
                this.entityManager(),
                this.entityDeltaFactory()
            )
    );
}
