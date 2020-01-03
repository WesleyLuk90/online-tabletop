export function addProperty(
    property: string,
    value: any
): (object: any) => void {
    return object => {
        if (object[property] == null) {
            object[property] = value;
        }
    };
}
