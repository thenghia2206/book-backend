import { Controller, Route, Tags, Post, Body, Get, Request, Security, Put, Query, Path, Delete, UploadedFiles,UploadedFile ,FormField } from "tsoa";
import { failedResponse, successResponse } from "../../utils/http";
import User from "../user/user.model";
import fs from 'fs';
import * as multer from "multer";
import * as path from "path";
import { IBookInput } from "../book/book.types";
import BookImage from "./bookImage.model";

@Route("bookimage")
@Tags("BookImage")
export class BookImageController extends Controller {

    @Security("jwt")
    @Post()
    public async createCover(@FormField() bookId : string  ,@UploadedFile() file : File ,@Request() request : any): Promise<any> {
    try{
        const token = request.headers.authorization.split(' ')[1];
        const user_id = await User.getIdFromToken(token);
        if (!user_id) {
            this.setStatus(401);
            return failedResponse('Unauthorized', 'Unauthorized');
        }
        const file_in: any = file
        const fileName = `${bookId}.png`;
        const content = file_in.buffer
        const filePath = path.join('src/storage', fileName);
        const pathFile = `/storage/${fileName}`
        fs.writeFile(filePath, content, 'binary', function(err) {
          if (err) {
            console.log('Lỗi khi tải xuống file đính kèm:', err);
          } else {
            console.log(`Đã tải xuống file đính kèm ${fileName}`);
          }
        });
        const bookImage = {
            bookId : bookId,
            filePath : pathFile,
            createdAt : new Date(),
            updatedAt : new Date()
        }
        await new BookImage(bookImage).save()

        return successResponse("OK");

    }catch (err){
        this.setStatus(500);
        return failedResponse('Execute service went wrong', 'ServiceException');
    }
    };


};

