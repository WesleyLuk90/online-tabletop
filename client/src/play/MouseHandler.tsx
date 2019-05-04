import { Buttons, MouseState } from "./MouseState";
import { PlayArea } from "./PlayArea";

export interface MouseHandler {
    canHandle(mouseState: MouseState): boolean;
    onUpdate(mouseState: MouseState): void;
    onFinish(mouseState: MouseState): void;
}

export class TokenSelectionHandler implements MouseHandler {
    constructor(readonly playArea: PlayArea) {}

    canHandle(mouseState: MouseState) {
        return !mouseState.isDrag() && mouseState.button === Buttons.LEFT;
    }
    onUpdate(mouseState: MouseState) {}
    onFinish(mouseState: MouseState) {
        if (mouseState.tokenId != null) {
            this.playArea.props.onSelect([mouseState.tokenId]);
        }
    }
}

export class TokenDragHandler implements MouseHandler {
    constructor(readonly playArea: PlayArea) {}

    canHandle(mouseState: MouseState) {
        return (
            mouseState.isDrag() &&
            mouseState.button === Buttons.LEFT &&
            mouseState.tokenId != null &&
            this.playArea.props.selected.includes(mouseState.tokenId)
        );
    }

    onUpdate(mouseState: MouseState) {
        this.playArea.setState({ dragSelection: mouseState.worldChange() });
    }

    onFinish(mouseState: MouseState) {
        if (mouseState.tokenId != null) {
            this.playArea.props.onDrag(mouseState.worldChange());
            this.playArea.setState({ dragSelection: null });
        }
    }
}

export class PanHandler implements MouseHandler {
    constructor(readonly playArea: PlayArea) {}

    canHandle(mouseState: MouseState) {
        return mouseState.isDrag() && mouseState.button === Buttons.RIGHT;
    }

    onUpdate(mouseState: MouseState) {
        this.playArea.props.onPan(mouseState.screenDelta().negative());
    }

    onFinish(mouseState: MouseState) {
        this.playArea.props.onPan(mouseState.screenDelta().negative());
    }
}
