export interface RequestData<B, Q> {
    body: B;
    query: Q;
}

export interface Context<B = {}, Q = {}> {
    user_id: string;
    data: RequestData<B, Q>;
}

export interface Routes {
    [path: string]: {
        method: "get" | "post" | "delete";
        handle: (context: Context<{}, {}>) => Promise<any>;
    };
}
