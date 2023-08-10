import { Controller, Route, Tags, Post, Body, Get, Request, Security, Put, Query, Path, Delete, UploadedFiles,UploadedFile ,FormField } from "tsoa";
import { failedResponse, successResponse } from "../../utils/http";
import User from "../user/user.model";
import { IBookEditInput, IBookInput } from "./book.types";
import Book from "./book.model";
import { getAllBookByUserId, getBookById } from "./book.queries";
import fs from 'fs';
import * as path from "path";
import BookImage from "../bookImage/bookImage.model";

@Route("books")
@Tags("Books")
export class BookController extends Controller {

    @Security("jwt")
    @Post()
    public async createRate(@Body() data : IBookInput ,  
    @Request() request:any): Promise<any> {
    try{
        const token = request.headers.authorization.split(' ')[1];
        const user_id = await User.getIdFromToken(token);
        if (!user_id) {
            this.setStatus(401);
            return failedResponse('Unauthorized', 'Unauthorized');
        }
        const base64Data = data.cover.split(';base64,').pop();
        if (!base64Data) {
          this.setStatus(400);
          return failedResponse("Ảnh không hợp lệ","Bad Request")
        }
        const book = new Book({
            title : data.title,
            description : data.description,
            author : data.author,
            publisher : data.publisher,
            categoryIds : data.categoryIds,
            quantity : data.quantity,
            price : data.price,
            userId : user_id,
            createdAt : new Date(),
            updatedAt : new Date()
        })
        const fileName = `${book._id}.png`;
        const filePath = path.join('src/storage', fileName);
        const pathFile = `/storage/${fileName}`
        fs.writeFileSync(filePath, base64Data, { encoding: 'base64' });
        await book.save()
        const bookImage = {
            bookId : book._id,
            filePath : pathFile,
            createdAt : new Date(),
            updatedAt : new Date()
        }
        await new BookImage(bookImage).save()


        return successResponse(book);

    }catch (err){
        this.setStatus(500);
        console.log(err)
        return failedResponse('Execute service went wrong', 'ServiceException');
    }
    };

    @Security("jwt")
    @Get('/list-book')
    public async getListBook(
    @Request() request:any, @Query() size : number, @Query() offset : number,@Query() search? : string): Promise<any> {
    try{
        const token = request.headers.authorization.split(' ')[1];
        const user_id = await User.getIdFromToken(token);
        if (!user_id) {
            this.setStatus(401);
            return failedResponse('Unauthorized', 'Unauthorized');
        }

        let listBook = await Book.aggregate(getAllBookByUserId(user_id,size,offset,search))
        if(listBook.length > 0){
            listBook = listBook[0]
        }else{
            this.setStatus(404)
            return failedResponse("Không tìm thấy","Not Found")
        }
        return successResponse(listBook);

    }catch (err){
        this.setStatus(500); 
        return failedResponse('Execute service went wrong', 'ServiceException');
    }
    };


    @Security("jwt")
    @Get('/book/{id}')
    public async getBookById(
    @Request() request:any, @Path() id : string): Promise<any> {
    try{
        const token = request.headers.authorization.split(' ')[1];
        const user_id = await User.getIdFromToken(token);
        if (!user_id) {
            this.setStatus(401);
            return failedResponse('Unauthorized', 'Unauthorized');
        }

        let listBook = await Book.aggregate(getBookById(id,user_id))
        if(listBook.length > 0){
            listBook = listBook[0]
        }else{
            this.setStatus(404)
            return failedResponse("Không tìm thấy","Not Found")
        }
        return successResponse(listBook);

    }catch (err){
        this.setStatus(500); 
        return failedResponse('Execute service went wrong', 'ServiceException');
    }
    };


    @Security("jwt")
    @Put('/edit-book/{id}')
    public async editBookById(
    @Request() request:any, @Path() id : string,@Body() data : IBookEditInput ): Promise<any> {
    try{
        const token = request.headers.authorization.split(' ')[1];
        const user_id = await User.getIdFromToken(token);
        if (!user_id) {
            this.setStatus(401);
            return failedResponse('Unauthorized', 'Unauthorized');
        }
        const updateFields : any = {};
        if (data.title) {
          updateFields.title = data.title;
        }
        if (data.description) {
          updateFields.description = data.description;
        }
        if (data.author) {
          updateFields.author = data.author;
        }
        if (data.publisher) {
          updateFields.publisher = data.publisher;
        }
        if (data.categoryIds) {
          updateFields.categoryIds = data.categoryIds;
        }
        if (data.quantity) {
          updateFields.quantity = data.quantity;
        }
        if (data.price) {
          updateFields.price = data.price;
        }
        updateFields.updatedAt = new Date();
        await Book.findByIdAndUpdate(id, { $set: updateFields })
        let book = await Book.aggregate(getBookById(id,user_id))
        if( book.length >0){
            book = book[0]
        }else{
            this.setStatus(404)
            return failedResponse("Không tìm thấy","Not Found")
        }
        return successResponse(book);

    }catch (err){
        this.setStatus(500); 
        console.log(err)
        return failedResponse('Execute service went wrong', 'ServiceException');
    }
    };

    @Security("jwt")
    @Delete('/{id}')
    public async deleteBookById(
    @Request() request:any, @Path() id : string): Promise<any> {
    try{
        const token = request.headers.authorization.split(' ')[1];
        const user_id = await User.getIdFromToken(token);
        if (!user_id) {
            this.setStatus(401);
            return failedResponse('Unauthorized', 'Unauthorized');
        }
        const book = await Book.findById(id)
        if(book.userId != user_id){
            this.setStatus(400)
            return failedResponse("Bạn không có quyền xóa sách này","Bad Request")
        }
        await Book.findByIdAndDelete(id)

        return successResponse("Xóa sách thành công");

    }catch (err){
        this.setStatus(500); 
        return failedResponse('Execute service went wrong', 'ServiceException');
    }
    };

};
