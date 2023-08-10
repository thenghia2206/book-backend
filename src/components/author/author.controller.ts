import { Controller, Route, Tags, Post, Body, Get, Request, Security, Put, Query, Path, Delete, UploadedFiles,UploadedFile ,FormField } from "tsoa";
import { failedResponse, successResponse } from "../../utils/http";
import User from "../user/user.model";
import { IAuthorInput } from "./author.types";
import Author from "./author.model";


@Route("authors")
@Tags("Athors")
export class AuthorController extends Controller {

    @Security("jwt")
    @Post()
    public async createRate(@Body() data : IAuthorInput ,  
    @Request() request:any): Promise<any> {
    try{
        const token = request.headers.authorization.split(' ')[1];
        const user_id = await User.getIdFromToken(token);
        if (!user_id) {
            this.setStatus(401);
            return failedResponse('Unauthorized', 'Unauthorized');
        }

        const author = new Author({
            name : data.name,
            dob : data.dob,
            dod : data.dod,
            createdAt : new Date(),
            updatedAt : new Date()
        })
        await author.save()


        return successResponse(author);

    }catch (err){
        this.setStatus(500);
        return failedResponse('Execute service went wrong', 'ServiceException');
    }
    };

    @Security("jwt")
    @Get('/list-author')
    public async getListAuthor(
    @Request() request:any): Promise<any> {
    try{
        const token = request.headers.authorization.split(' ')[1];
        const user_id = await User.getIdFromToken(token);
        if (!user_id) {
            this.setStatus(401);
            return failedResponse('Unauthorized', 'Unauthorized');
        }

        const listAuthor = await Author.find()


        return successResponse(listAuthor);

    }catch (err){
        this.setStatus(500);
        return failedResponse('Execute service went wrong', 'ServiceException');
    }
    };


};
