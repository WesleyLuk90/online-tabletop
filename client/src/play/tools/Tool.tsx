import { Token } from "protocol/src/Token";
import { Callback } from "../../util/Callback";
import { GameState } from "../GameState";
import { TokenUpdate } from "../tokens/TokenUpdater";

export type ToolCreatableToken = Omit<
    Token,
    "campaignID" | "tokenID" | "sceneID" | "layerID" | "version"
>;

export interface ToolCallbacks {
    createToken: Callback<ToolCreatableToken>;
    addSelection: Callback<Token[]>;
    updateTokens: Callback<TokenUpdate[]>;
}

export interface ToolProps {
    gameState: GameState;
    callbacks: ToolCallbacks;
}

export interface Tool {
    (props: ToolProps): React.ReactElement | null;
}
