export interface Context {
    user_id: string;
}

export interface RequestData<B, Q> {
    body: B;
    query: Q;
}

export interface Route<B = {}, Q = {}> {
    method: "get" | "post" | "delete";
    path: string;
    handle: (data: RequestData<B, Q>, context: Context) => Promise<any>;
}
