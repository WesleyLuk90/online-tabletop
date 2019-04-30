import { RequestData } from "../src/route";

export function withBody<T>(data: T): RequestData<T, {}> {
    return {
        body: data,
        query: {}
    };
}

export function withQuery<T>(data: T): RequestData<{}, T> {
    return {
        body: {},
        query: data
    };
}
