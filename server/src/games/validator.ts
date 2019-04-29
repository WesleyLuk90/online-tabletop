export interface GameData {
    id: number;
    name: string;
}

function validateNumber(number: any, defaultValue: number = 0): number {
    if (isNaN(number)) {
        return defaultValue;
    }
    return number;
}

function validateString(string: any, defaultValue: string = ""): string {
    if (typeof string !== "string") {
        return defaultValue;
    }
    return string;
}

export function validateGame(data: any): GameData {
    return {
        id: validateNumber(data.id),
        name: validateString(data.name)
    };
}
