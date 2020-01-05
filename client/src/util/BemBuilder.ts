export class BemBuilder {
    constructor(readonly blockName: string) {}

    block(modifier?: string, condition?: boolean) {
        if (modifier != null && condition !== false) {
            return `${this.blockName} ${this.blockName}--${modifier}`;
        }
        return `${this.blockName}`;
    }

    element(element: string, modifier?: string, condition?: boolean) {
        if (modifier != null && (condition == null || condition === true)) {
            return `${this.blockName}__${element} ${this.blockName}__${element}--${modifier}`;
        }
        return `${this.blockName}__${element}`;
    }
}
