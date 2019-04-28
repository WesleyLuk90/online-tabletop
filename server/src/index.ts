import express from "express";
import { initializeAuth } from "./auth";
import { createDatabase } from "./database";
import { initializeSession } from "./session";

async function main() {
    require("dotenv").config();
    const app = express();
    const port = 3001;

    const db = await createDatabase();

    await initializeSession(app);
    await initializeAuth(app);

    app.get("/", (req, res) =>
        res.send("Hello World!" + JSON.stringify(req.session))
    );

    app.listen(port, () =>
        console.log(`Example app listening on port ${port}!`)
    );
}

main().catch(e => {
    console.error(e);
    process.exit(-1);
});
