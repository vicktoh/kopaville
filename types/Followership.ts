export interface Folowership {
    following: {userId: string, fullname: string, username: string, photoUrl: string}[],
    followers: {userId: string, fullname: string, username: string, photoUrl: string}[],
}