export interface RequestData<B, Q> {
    body: B;
    query: Q;
}

export interface Context<B, Q> {
    userID: string;
    data: RequestData<B, Q>;
}

type Method = "get" | "post" | "delete";

export class Route<B = {}, Q = {}> {
    constructor(
        readonly method: Method,
        readonly path: string,
        readonly handle: (context: Context<B, Q>) => Promise<any>
    ) {}
}
