export type User = {
    username: string;
    phone: string;
    email: string;
    userId: string;
    password: string;
    photoUrl?: string;
    displayName: string | null;
    refreshToken?: string;
    phoneNumber?: string | null;
}