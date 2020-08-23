import { Api, E } from "engine";
import * as Express from "express";
import { inspect } from "util";
import { Context } from "./Context";

export class Implementation<I, O> {
    constructor(
        readonly api: Api<I, O>,
        readonly implementation: (context: Context, input: I) => Promise<O>
    ) {}

    async handle(req: Express.Request, res: Express.Response) {
        const body = req.body;
        const input = this.api.input.decode(body);
        if (E.isLeft(input)) {
            console.error(inspect(input.left, false, 5, true));
            return res.status(400).json({
                message: "Invalid input",
            });
        }
        try {
            const response = await this.implementation(
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
