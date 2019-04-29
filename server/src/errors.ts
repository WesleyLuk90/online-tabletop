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
    constructor(object: string, id: string) {
        super(`No ${object} with id ${id} found`);
    }

    code() {
        return 404;
    }
}
