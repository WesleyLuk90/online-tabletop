export interface Context {
    user_id: string;
}

export interface RequestData<B> {
    body: B;
}

export interface Route<B = {}> {
    method: "get" | "post" | "delete";
    path: string;
    handle: (data: RequestData<B>, context: Context) => Promise<any>;
}
