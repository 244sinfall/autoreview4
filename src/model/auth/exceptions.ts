class AuthException extends Error {}
export class NoAccessException extends AuthException {}

class BackendException extends Error {}

export class FirestoreDataException extends BackendException {}