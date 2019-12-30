class RequestData {
    constructor(
        readonly bodyData: any,
        readonly queryData: any,
        readonly urlData: any
    ) {}

    query(key: string) {}
}

type Method = "get" | "post" | "delete";

export class Route<B = {}, Q = {}> {
    create(
        method: Method,
        path: string,
        handle: (userID: string, data: Data) => Promise<any>
    ) {
        return new Route(method, path, handle);
    }

    constructor(
        readonly method: Method,
        readonly path: string,
        readonly handle: (context: Context<B, Q>) => Promise<any>
    ) {}
}
