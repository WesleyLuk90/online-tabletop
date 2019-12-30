import { BadRequestError, UnauthorizedError } from "./Errors";

export class RequestData {
    constructor(
        readonly bodyData: any,
        readonly queryData: any,
        readonly urlData: any
    ) {}

    body(): any {
        if (this.bodyData == null) {
            throw new BadRequestError();
        }
        return this.bodyData;
    }

    url(key: string): string {
        return BadRequestError.check(this.queryData, key);
    }

    query(key: string): string {
        return BadRequestError.check(this.queryData, key);
    }
}

type Method = "get" | "post" | "delete";

export class Route {
    static create<T extends {} | null>(
        method: Method,
        path: string,
        handle: (userID: string, data: RequestData) => Promise<T>
    ) {
        return new Route(method, path, (u, d) => {
            if (u == null) {
                throw new UnauthorizedError();
            }
            return handle(u, d);
        });
    }

    static createPublic<T extends {} | null>(
        method: Method,
        path: string,
        handle: (userID: string | null, data: RequestData) => Promise<T>
    ) {
        return new Route(method, path, handle);
    }

    constructor(
        readonly method: Method,
        readonly path: string,
        readonly handle: (
            userID: string | null,
            data: RequestData
        ) => Promise<any>
    ) {}
}