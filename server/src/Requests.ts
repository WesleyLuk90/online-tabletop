import express, { Request, Response } from "express";
import { UserFacingError } from "./Errors";
import { RequestData, Route } from "./Route";

function getUserId(req: Request): string | null {
    if (
        req.session == null ||
        !req.session.passport ||
        !req.session.passport.user
    ) {
        return null;
    }
    return req.session.passport.user;
}

function getRequestData(req: Request) {
    return new RequestData(req.body, req.query, req.params);
}

export function connectRoutes(routes: Route[], app: express.Application) {
    routes.forEach(route => {
        app[route.method](route.path, async (req: Request, res: Response) => {
            try {
                const id = getUserId(req);
                const response = await route.handle(id, getRequestData(req));
                res.json(response);
            } catch (e) {
                if (e instanceof UserFacingError) {
                    res.status(e.code()).send(e.message);
                } else {
                    console.error(e);
                    res.sendStatus(500);
                }
            }
        });
    });
}
