import { checkNotNull } from "../utils/Nullable";
import { FifthEditionGameMode } from "./5e/FifthEdition";

export const GameModes = [FifthEditionGameMode];

export function findGameMode(id: string) {
    return checkNotNull(
        GameModes.find((g) => g.id === id),
        () => `Failed to find game mode with id ${id}`
    );
}
