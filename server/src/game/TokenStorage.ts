import { parse } from "protocol/src/Parse";
import { Token, TokenSchema } from "protocol/src/Token";
import { NotFoundError } from "../Errors";
import { DatabaseProvider } from "../storage/DatabaseProvider";
import { MongoStorage } from "../storage/MongoStorage";

interface TokenReference {
    campaignID: string;
    tokenID: string;
}

function generateID({ campaignID, tokenID }: TokenReference) {
    return `${campaignID}/${tokenID}`;
}

export class TokenStorage {
    storage: MongoStorage<Token, keyof Token>;

    constructor(readonly databaseProvider: DatabaseProvider) {
        this.storage = new MongoStorage<Token, keyof Token>(
            databaseProvider,
            "tokens",
            data => parse(data, TokenSchema),
            generateID,
            []
        );
    }

    async list(campaignID: string, sceneID: string): Promise<Token[]> {
        return this.storage.list(
            { key: "campaignID", value: campaignID },
            { key: "sceneID", value: sceneID }
        );
    }

    async get(ref: TokenReference): Promise<Token> {
        const id = generateID(ref);
        const scene = await this.storage.get(generateID(ref));
        return NotFoundError.checkNotNull(scene, "scene", id);
    }

    async create(token: Token): Promise<Token> {
        await this.storage.create(token);
        return token;
    }

    async update(token: Token): Promise<Token> {
        await this.storage.update(token);
        return token;
    }

    async delete(ref: TokenReference): Promise<void> {
        return this.storage.delete(generateID(ref));
    }
}
