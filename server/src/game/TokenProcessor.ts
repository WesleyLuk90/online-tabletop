import { TokenUpdateRequest } from "protocol/src/TokenDelta";
import { assertExhaustive } from "../util/Exaustive";
import { Queue } from "../util/Queue";
import { TokenStorage } from "./TokenStorage";

export class TokenProcessor {
    process = async (request: TokenUpdateRequest) => {
        switch (request.update.type) {
            case "create":
                return this.tokenStorage.create(request.update.token);
            case "delete":
                return this.tokenStorage.delete({
                    campaignID: request.campaignID,
                    tokenID: request.tokenID
                });
            case "update":
                const token = await this.tokenStorage.get({
                    campaignID: request.campaignID,
                    tokenID: request.tokenID
                });
                const updated = {
                    ...token,
                    ...request.update.update,
                    version: token.version + 1
                };
                return this.tokenStorage.update(updated);
            default:
                assertExhaustive(request.update);
        }
    };

    queue = new Queue(this.process);

    constructor(private tokenStorage: TokenStorage) {}
}
