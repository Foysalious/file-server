import { InjectRepository } from '@nestjs/typeorm';
import path = require('path');
import { LocalFileServerRepository } from './app.repository';
import { LocalFileServerService } from './local-file-server.service';
import { Cron, CronExpression } from '@nestjs/schedule';


export class AppService {
  constructor(@InjectRepository(LocalFileServerRepository)
  private localFileServerRepository: LocalFileServerRepository, private readonly localFileService: LocalFileServerService) {
    this.localFileService = new LocalFileServerService(localFileServerRepository)
  }
  storeFile(file: Express.Multer.File, method: string = "local") {
    return this.localFileService.upload(file)
  }

  getFile(publicKey: number, method: string = "local") {
    return this.localFileService.get(publicKey)
  }

  deleteFile(privateKey:string,method: string = "local") {
    return this.localFileService.delete(privateKey)
  }

}
