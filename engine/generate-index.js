const fs = require("fs");
const path = require("path");

function list(dir) {
    const found = [];
    const entries = fs.readdirSync(dir);
    for (let entry of entries) {
        const resolved = path.join(dir, entry);
        const stat = fs.statSync(resolved);
        if (stat.isDirectory()) {
            found.push(...list(resolved));
        } else if (stat.isFile() && resolved.endsWith(".ts")) {
            found.push(resolved);
        }
    }
    return found;
}

const tsFiles = list("src")
    .filter((t) => t != "src/index.ts")
    .map((t) => t.slice("src/".length, t.length - ".ts".length))
    .map((t) => `./${t}`);

const generated = tsFiles.map((t) => `export * from '${t}';`).join("\n");

fs.writeFileSync("src/index.ts", generated);
