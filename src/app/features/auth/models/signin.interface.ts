import { AuthUser } from "./auth-user.interface";

// when send [signin]
export interface SigninRequest {
    email: string;
    password: string;
}

// when success signin [logged in]
export interface SigninResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
        tokenType: string;
        expiresIn: string;
        user: SigninUser;
    };
}

export interface SigninUser extends AuthUser { }