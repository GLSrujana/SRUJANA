export type UserRole = 'Customer' | 'Agent' | 'Admin' | 'ClaimsOfficer';

export interface RegisterRequest {
    fullName: string;
    email: string;
    password?: string;
    role: UserRole;
}

export interface LoginRequest {
    email: string;
    password?: string;
}

export interface LoginResponse {
    userId: number;
    fullName: string;
    email: string;
    role: UserRole;
    token: string;
    expiresAtUtc: string;
}
