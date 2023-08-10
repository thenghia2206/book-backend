export interface IUser {
    email : string,
    password : string,
    name: string,
    phone: string,
    address: string,
    dob: Date,
    gender: boolean,
    createdAt: Date,
    updatedAt: Date,
    role: string,
    device : string[],
    active: number,
    activeCode: string,
    key : string[],
}

export interface IUserRegister {
    email: string,
    password: string,
    confirmPassword: string,
    name: string,
    phone: string,
    address: string,
    dob: Date,
    gender: boolean,
}

export interface IUserProfile {
    name: string,
    phone: string,
    address: string,
    dob: Date,
    gender: boolean,
    createdAt: Date,
    updatedAt: Date
}

export interface IUserLogin {
    email : string,
    password : string,
    remember: boolean,
}

export interface IUserResponse extends Omit<IUser, 'password'> {
    id: string
    accessToken?: string
    refreshToken?: string
}

export interface IUserRes {
    email : string,
    id : string
}

export interface IRefreshTokenReq {
    refreshToken: string
}

export interface IAccessTokenReq {
    accessToken: string
}

export interface IUserDB {
    email : string,
    password : string
    
}

export interface IUserUpdateProfile{
    name: string,
    phone: string,
    address: string,
}

export interface IUserUpdatePassword{
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
}

export interface ILogout {
    token : string
}