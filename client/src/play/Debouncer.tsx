export class Debouncer {
    animationFrame = 0;

    debounce(action: () => void) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = requestAnimationFrame(action);
    }
}
