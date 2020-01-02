export function addProperty(object: any, property: string, value: any) {
    if (object[property] == null) {
        object[property] = value;
    }
}
