import { Controller, Route, Tags, Post, Body, Get, Request, Security, Put, Query, Path, Delete, UploadedFiles,UploadedFile ,FormField } from "tsoa";
import { failedResponse, successResponse } from "../../utils/http";
import User from "../user/user.model";
import { IPublisherInput } from "./publisher.types";
import Publisher from "./publisher.model";



@Route("publisher")
@Tags("Publisher")
export class PublisherController extends Controller {

    @Security("jwt")
    @Post()
    public async createPubliser(@Body() data : IPublisherInput ,  
    @Request() request:any): Promise<any> {
    try{
        const token = request.headers.authorization.split(' ')[1];
        const user_id = await User.getIdFromToken(token);
        if (!user_id) {
            this.setStatus(401);
            return failedResponse('Unauthorized', 'Unauthorized');
        }

        const publiser = new Publisher({
            name : data.name,
            phoneNumber : data.phoneNumber,
            address : data.address,
            createdAt : new Date(),
            updatedAt : new Date()
        })
        await publiser.save()


        return successResponse(publiser);

    }catch (err){
        this.setStatus(500);
        return failedResponse('Execute service went wrong', 'ServiceException');
    }
    };

    @Security("jwt")
    @Get('/list-publisher')
    public async getListPublisher(
    @Request() request:any): Promise<any> {
    try{
        const token = request.headers.authorization.split(' ')[1];
        const user_id = await User.getIdFromToken(token);
        if (!user_id) {
            this.setStatus(401);
            return failedResponse('Unauthorized', 'Unauthorized');
        }

        const listPublisher = await Publisher.find()


        return successResponse(listPublisher);

    }catch (err){
        this.setStatus(500);
        return failedResponse('Execute service went wrong', 'ServiceException');
    }
    };


};
