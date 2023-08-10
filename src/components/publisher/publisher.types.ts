export interface IPublisher {
    name : string,
    phoneNumber : string,
    address : string,
    createdAt : Date,
    updatedAt : Date
}

export interface IPublisherInput {
    name : string,
    phoneNumber : string,
    address : string,
}