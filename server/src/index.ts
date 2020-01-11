import { AppModule } from "./AppModule";

async function main() {
    const module = new AppModule();
    await module.start();
}

main().catch(e => {
    console.error(e);
    process.exit(-1);
});
