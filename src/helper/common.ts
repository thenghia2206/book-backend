export interface IPaginationCommon {
    offset?: number
    size?: number
}

export enum ActiveStatus{
    InActive = 0,
    Active = 1,
    Banned = 2
}
