import { Controller, Route, Tags, Post, Body, Get, Request, Security, Put, Query, Path, Delete, UploadedFiles,UploadedFile ,FormField, Response } from "tsoa";
import { failedResponse, successResponse } from "../../utils/http";
import * as fs from 'fs';

@Route("storage")
@Tags("Storage")
export class StorageController extends Controller { 

    @Get('{fileName}')
    public async getImage(fileName: string ): Promise<any> {
      try {
        const imagePath = `src/storage/${fileName}`; // Đường dẫn tới ảnh của bạn
        const imageStream = fs.createReadStream(imagePath);
        this.setHeader('Content-Type', 'image/jpeg')
        return imageStream
      } catch (err) {
        this.setStatus(500);
        return failedResponse('Execute service went wrong', 'ServiceException');
      }
    }


}