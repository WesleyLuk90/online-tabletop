import { parse } from "protocol/src/Parse";
import { Token, TokenSchema } from "protocol/src/Token";
import { NotFoundError } from "../Errors";
import {
    CompoundIndex,
    Document,
    Field,
    MongoStorage
} from "../storage/MongoStorage";

interface TokenReference {
    campaignID: string;
    tokenID: string;
}

function generateID({ campaignID, tokenID }: TokenReference) {
    return `${campaignID}/${tokenID}`;
}

export class TokenCollection extends MongoStorage<Token> {
    static CampaignField = new Field("campaignID");
    static SceneField = new Field("sceneID");

    collectionName() {
        return "tokens";
    }

    parse(data: Document) {
        return parse(data, TokenSchema);
    }

    id(token: Token) {
        return generateID(token);
    }

    compoundsIndexes() {
        return [
            new CompoundIndex([
                TokenCollection.CampaignField,
                TokenCollection.SceneField
            ])
        ];
    }
}

export class TokenStorage {
    constructor(readonly collection: TokenCollection) {}

    async list({
        campaignID,
        sceneID
    }: {
        campaignID: string;
        sceneID: string;
    }): Promise<Token[]> {
        return this.collection.list(
            TokenCollection.CampaignField.isEqualTo(campaignID),
            TokenCollection.SceneField.isEqualTo(sceneID)
        );
    }

    async get(ref: TokenReference): Promise<Token> {
        const id = generateID(ref);
        const scene = await this.collection.get(generateID(ref));
        return NotFoundError.checkNotNull(scene, "scene", id);
    }

    async create(token: Token): Promise<Token> {
        await this.collection.create(token);
        return token;
    }

    async update(token: Token): Promise<Token> {
        await this.collection.update(token);
        return token;
    }

    async delete(ref: TokenReference): Promise<void> {
        return this.collection.delete(generateID(ref));
    }
}
