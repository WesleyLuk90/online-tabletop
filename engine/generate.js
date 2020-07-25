const fs = require("fs");
const { resolve } = require("path");
const { compileFromFile } = require("json-schema-to-typescript");

async function main() {
    fs.writeFileSync("src/generated/types.d.ts", "// GENERATED FILE\n");
    await Promise.all(
        fs
            .readdirSync("schemas")
            .filter((f) => f.endsWith(".json"))
            .map((f) => {
                const path = resolve("schemas", f);

                return compileFromFile(path, {
                    declareExternallyReferenced: false,
                    bannerComment: `// Generated from ${path}`,
                }).then((ts) =>
                    fs.appendFileSync("src/generated/types.d.ts", ts)
                );
            })
    );
}

main().catch((e) => console.error(e));
