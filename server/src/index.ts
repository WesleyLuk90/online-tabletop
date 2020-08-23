import { AppModule } from "./AppModule";
import { fromEnv } from "./Config";

async function main() {
    const module = new AppModule(fromEnv());
    await module.start();
}

main().catch((e) => {
    console.error(e);
    process.exit(-1);
});
