import { Context, RequestData } from "../src/route";

export function createContext<B, Q>(
    user_id: string,
    data: Partial<RequestData<B, Q>> = {}
): Context<B, Q> {
    return {
        user_id,
        data: {
            body: {} as B,
            query: {} as Q,
            ...data
        }
    };
}
