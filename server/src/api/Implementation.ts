import { Api, Either } from "engine";
import * as Express from "express";
import { Context } from "./Context";

export class Implementation<I, O> {
    constructor(
        readonly api: Api<I, O>,
        readonly implementation: (context: Context, input: I) => Promise<O>
    ) {}

    async handle(req: Express.Request, res: Express.Response) {
        const body = req.body;
        const input = this.api.input.decode(body);
        if (Either.isLeft(input)) {
            return res.status(400).json({
                message: "Invalid input",
            });
        }
        try {
            const response = this.implementation(
                { userID: (req.user as any)?.userID },
                input.right
            );
            return res.json(response);
        } catch (e) {
            console.error(e);
            return res.status(500);
        }
    }
}
