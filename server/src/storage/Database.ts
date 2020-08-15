import { Client, QueryResult } from "pg";
import { lazy } from "../Module";

export class Database {
    constructor(
        readonly host: string,
        readonly port: number,
        readonly user: string,
        readonly password: string,
        readonly schema: string
    ) {}

    getClient = lazy(async () => {
        const client = new Client({
            host: this.host,
            port: this.port,
            user: this.user,
            password: this.password,
        });
        await client.connect();
        return client;
    });

    async query(
        query: string,
        values?: (string | number)[]
    ): Promise<QueryResult> {
        console.log(query);
        return (await this.getClient()).query(query, values);
    }
}
