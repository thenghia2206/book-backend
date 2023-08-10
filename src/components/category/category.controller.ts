import { Controller, Route, Tags, Post, Body, Get, Request, Security, Put, Query, Path, Delete, UploadedFiles,UploadedFile ,FormField } from "tsoa";
import { failedResponse, successResponse } from "../../utils/http";
import User from "../user/user.model";
import { ICategoryInput } from "./category.types";
import Category from "./category.model";


@Route("category")
@Tags("Categories")
export class CategoryController extends Controller {

    @Security("jwt")
    @Post()
    public async createCategory(@Body() data : ICategoryInput ,  
    @Request() request:any): Promise<any> {
    try{
        const token = request.headers.authorization.split(' ')[1];
        const user_id = await User.getIdFromToken(token);
        if (!user_id) {
            this.setStatus(401);
            return failedResponse('Unauthorized', 'Unauthorized');
        }

        const category = new Category({
            name : data.name,
            createdAt : new Date(),
            updatedAt : new Date()
        })
        await category.save()


        return successResponse(category);

    }catch (err){
        this.setStatus(500);
        return failedResponse('Execute service went wrong', 'ServiceException');
    }
    };

    @Security("jwt")
    @Get('/list-categories')
    public async getListCategory(
    @Request() request:any): Promise<any> {
    try{
        const token = request.headers.authorization.split(' ')[1];
        const user_id = await User.getIdFromToken(token);
        if (!user_id) {
            this.setStatus(401);
            return failedResponse('Unauthorized', 'Unauthorized');
        }

        const listCategory = await Category.find()


        return successResponse(listCategory);

    }catch (err){
        this.setStatus(500);
        return failedResponse('Execute service went wrong', 'ServiceException');
    }
    };


};
