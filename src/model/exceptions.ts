class AuthException extends Error {}
export class NotAuthorizedException extends AuthException {}
export class NoAccessException extends AuthException {}


class BackendException extends Error {}
export class FirestoreDataException extends BackendException {}

class FatalException extends Error {}

export class FatalServicesInitException extends FatalException {
    constructor(message: string, services: any) {
        super(`${message}\n\nОбъект сервисов: ${services.toString()}`);
    }
}