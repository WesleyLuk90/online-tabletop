export class UserFacingError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }

    code() {
        return 400;
    }
}

export class NotFoundError extends UserFacingError {
    static check(condition: boolean, object: string, id: string) {
        if (!condition) {
            throw new NotFoundError(object, id);
        }
    }

    static checkNotNull<T extends {}>(
        v: T | null | undefined,
        object: string,
        id: string
    ): T {
        if (v == null) {
            throw new NotFoundError(object, id);
        }
        return v;
    }

    constructor(object: string, id: string) {
        super(`No ${object} with id ${id} found`);
    }

    code() {
        return 404;
    }
}

export function checkPermissions(check: boolean) {
    if (!check) {
        throw new PermissionError();
    }
}

export class PermissionError extends UserFacingError {
    constructor() {
        super("You do not have permissions");
    }

    code() {
        return 403;
    }
}

export class UnauthorizedError extends UserFacingError {
    constructor() {
        super("You must be logged in");
    }

    code() {
        return 401;
    }
}

export class BadRequestError extends UserFacingError {
    static check(object: any, key: string, message?: string) {
        if (object == null || object[key] == null) {
            throw new BadRequestError(message);
        }
        return object[key];
    }

    constructor(message?: string) {
        super(message || "Bad request");
    }

    code() {
        return 400;
    }
}
