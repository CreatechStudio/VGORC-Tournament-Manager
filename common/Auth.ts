export enum AuthRole {
    Admin,
    Referee,
    Guest
}

export interface AuthObject {
    authRole: AuthRole,
    authPasswordHash: string
}
