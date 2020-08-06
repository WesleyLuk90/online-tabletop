export function debug(object: any) {
    let name = "Object";
    if ("constructor" in object && "name" in object.constructor) {
        name = String(object.constructor.name);
    }
    return `${name}${JSON.stringify(object)}`;
}
