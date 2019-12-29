import express, { Request, Response } from "express";
import { UserFacingError } from "./Errors";
import { RequestData, Routes } from "./Route";

function getUserId(req: Request): string | null {
    if (!req.session.passport || !req.session.passport.user) {
        return null;
    }
    return req.session.passport.user;
}

function getRequestData(req: Request): RequestData<{}, {}> {
    return {
        body: req.body || {},
        query: req.query || {}
    };
}

export function connectRoutes(routes: Routes, app: express.Application) {
    Object.keys(routes).forEach(path => {
        const route = routes[path];
        app[route.method](path, async (req: Request, res: Response) => {
            try {
                const id = getUserId(req);
                if (id == null) {
                    return res.sendStatus(401);
                }
                const response = await route.handle({
                    user_id: id,
                    data: getRequestData(req)
                });
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
