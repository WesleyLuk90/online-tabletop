import Axios, { AxiosError, AxiosResponse } from "axios";
import { E, Either } from "engine";
import { AppModule } from "../src/AppModule";
import { Config } from "../src/Config";

interface RequestArgs {
    path: string;
    body?: any;
}

export class AppClient {
    static fromModule(module: { config: Config }) {
        return new AppClient(module.config);
    }

    private app: AppModule;
    constructor(readonly config: Config) {
        this.app = new AppModule(config);
    }

    sendRequest({ path, body }: RequestArgs) {
        const url = `http://${this.app.httpHost()}:${this.app.httpPort()}/${path.replace(
            /^\//,
            ""
        )}`;
        return Axios.post(url, body);
    }

    async sendRequestE<R = any, E = any>(
        args: RequestArgs
    ): Promise<Either<AxiosError<E>, AxiosResponse<R>>> {
        try {
            return E.right(await this.sendRequest(args));
        } catch (e) {
            return E.left(e);
        }
    }
}
