export type UserLoginCredentials = {
    email: string,
    password: string
}

export type UserRegOnlyCredentials = {
    passwordCheck: string,
    login: string
}

export type UserRegisterCredentials = UserLoginCredentials & UserRegOnlyCredentials