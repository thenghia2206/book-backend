export interface IAuthor {
    name : string,
    dob : Date,
    dod : Date,
    createdAt : Date,
    updatedAt : Date
}

export interface IAuthorInput {
    name : string,
    dob? : Date,
    dod? : Date,
}


