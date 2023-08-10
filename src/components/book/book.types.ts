export interface IBook {
    title : string,
    description : string,
    author : string,
    publisher : string,
    categoryIds : string [],
    quantity : number,
    price : number,
    userId : string,
    createdAt : Date,
    updatedAt : Date
}

export interface IBookInput {
    title : string,
    description : string,
    author : string,
    publisher : string,
    categoryIds : string [],
    quantity : number,
    price : number,
    cover : string,
}

export interface IBookEditInput {
    title? : string,
    description? : string,
    author? : string,
    publisher? : string,
    categoryIds? : string[],
    quantity? : number,
    price? : number,
}