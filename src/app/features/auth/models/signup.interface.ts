import { AuthUser } from "./auth-user.interface";

// when register
export interface SignupRequest {
    name: string;
    username: string;
    email: string;
    dateOfBirth: string;
    gender: string;
    password: string;
    rePassword: string;
}

// when success register
export interface SignupResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
        tokenType: string;
        expiresIn: string;
        user: SignupUser;
    };
}

export interface SignupUser extends AuthUser { }