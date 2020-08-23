import { Implementation } from "./Implementation";

export interface Implementations {
    implementations(): Implementation<any, any>[];
}
