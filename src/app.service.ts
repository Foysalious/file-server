import { InjectRepository } from '@nestjs/typeorm';
import path = require('path');
import { LocalFileServerRepository } from './app.repository';
import { LocalFileServerService } from './local-file-server.service';
import { GoogleFileServerService } from './google-file-server.service';


export class AppService {
  constructor(@InjectRepository(LocalFileServerRepository)
  private localFileServerRepository: LocalFileServerRepository, private readonly localFileService: LocalFileServerService, private readonly googleFileService: GoogleFileServerService) {
    this.localFileService = new LocalFileServerService(localFileServerRepository)
    this.googleFileService = new GoogleFileServerService(localFileServerRepository)
  }
  storeFile(file: Express.Multer.File, method: string = "local") {
    if (method === "local") {
      return this.localFileService.upload(file)
    }
    else {
      return this.googleFileService.upload(file)
    }

  }

  getFile(publicKey: number, method: string = "local") {
    if (method === "local") {
      return this.localFileService.get(publicKey)
    }
    else {
      return this.googleFileService.get(publicKey)
    }
  }

  deleteFile(privateKey: string, method: string = "local") {
    if (method === "local") {
      return this.localFileService.delete(privateKey)
    }
    else {
      return this.googleFileService.delete(privateKey)
    }
  }

}
