import { Controller, Get, Post, Req, Res, UploadedFile, UseInterceptors, Param, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { Express, Request, Response } from 'express';
import path = require('path');




@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('POST/files')
  @UseInterceptors(FileInterceptor('file'))

  async storeFile(@UploadedFile() file: Express.Multer.File, @Req() request: Request, @Res() response: Response) {
    const res = await this.appService.storeFile(file);
    return response.send({ publicKey: res.public_id, privateKey: res._id });
  }
  @Get('GET/files/:publicKey')
  async getFile(@Param('publicKey') publicKey: number, @Res() response: Response) {
    const res = await this.appService.getFile(publicKey);
    return response.download(res)
  }

  @Delete('DELETE/files/:privateKey')
  async deleteFile(@Param('privateKey') privateKey: string, @Res() response: Response) {
    await this.appService.deleteFile(privateKey,process.env.PROVIDER);
    return response.send({ message: "File deleted" });
  }
}


