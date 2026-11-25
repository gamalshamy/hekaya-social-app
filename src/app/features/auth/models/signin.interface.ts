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

export interface SigninUser {
    _id: string;
    name: string;
    username: string;
    email: string;
    photo: string;
    cover: string;
}