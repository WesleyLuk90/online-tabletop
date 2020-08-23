import express from "express";

export function createExpress() {
    const app = express();
    app.use(express.json());
    return app;
}
