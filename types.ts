export interface Auth {
    username: string
    password: string
}

export interface Registration extends Auth {
    email: string
}
