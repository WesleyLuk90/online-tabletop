import {
    CreateToken,
    DeleteToken,
    TokenDelta,
    UpdateToken
} from "protocol/src/TokenDelta";
import { assertExhaustive } from "../util/Exaustive";
import { Queue } from "../util/Queue";
import { NotificationService } from "./NotificationService";
import { TokenStorage } from "./TokenStorage";

export class TokenProcessor {
    constructor(
        private tokenStorage: TokenStorage,
        private notificationService: NotificationService
    ) {}

    private process = async (delta: TokenDelta): Promise<void> => {
        switch (delta.type) {
            case "create":
                return await this.createToken(delta);
            case "delete":
                return await this.deleteToken(delta);
            case "update":
                return await this.updateToken(delta);
            default:
                assertExhaustive(delta);
        }
    };

    private queue = new Queue<TokenDelta>(this.process);

    enqueue(delta: TokenDelta) {
        this.queue.enqueue(delta);
    }

    private async createToken(createToken: CreateToken) {
        await this.tokenStorage.create(createToken.token);
        this.notificationService.tokenUpdated(
            createToken.token.campaignID,
            createToken
        );
    }

    private async deleteToken(deleteToken: DeleteToken) {
        await this.tokenStorage.delete({
            campaignID: deleteToken.campaignID,
            tokenID: deleteToken.tokenID
        });
        this.notificationService.tokenUpdated(
            deleteToken.campaignID,
            deleteToken
        );
    }

    private async updateToken(updateToken: UpdateToken) {
        const originalToken = await this.tokenStorage.get({
            campaignID: updateToken.campaignID,
            tokenID: updateToken.tokenID
        });
        const updated = {
            ...originalToken,
            ...updateToken.update,
            campaignID: updateToken.campaignID,
            tokenID: updateToken.tokenID,
            version: originalToken.version + 1
        };
        await this.tokenStorage.update(updated);
        this.notificationService.versionedTokenUpdated(
            originalToken.version,
            updateToken
        );
    }
}
