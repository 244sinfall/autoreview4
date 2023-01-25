class AuthException extends Error {}
export class NotAuthorizedException extends AuthException {}
export class NoAccessException extends AuthException {}


class BackendException extends Error {}

export class APIResponseKnownError extends BackendException {}
export class FirestoreDataException extends BackendException {}

class FatalException extends Error {}

export class FatalServicesInitException<T extends object> extends FatalException {
    constructor(message: string, services: T) {
        super(`${message}\n\nОбъект сервисов: ${services.toString()}`);
    }
}