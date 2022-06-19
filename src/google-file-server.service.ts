import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';
import { unlinkSync, writeFile } from 'fs';
import { FilerServerInterface } from './interface/file-server.interface';
import { LocalFileServerRepository } from './app.repository';
import * as mongodb from "mongodb";
import { GoogleCloudCredential } from './constants/google-cloud-credential';
const { Storage } = require('@google-cloud/storage');

export class GoogleFileServerService implements FilerServerInterface {
    constructor(private localFileServerRepository: LocalFileServerRepository) {

    }

    async upload(file: Express.Multer.File) {
        const base64 = file.buffer.toString('base64');
        const fileName: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4()
        const extension: string = path.parse(file.originalname).ext;
        const fullFilePath = process.env.FOLDER + "/" + fileName + extension
        writeFile(fullFilePath, base64, 'base64', function (err) {
            if (err) {
                console.log(err)
            }
        });
        const storage = new Storage()
        await storage.bucket(GoogleCloudCredential.bucketName).upload(process.env.FOLDER + "/", {
            destination: fileName + extension,
        });
        unlinkSync(fullFilePath)
        return this.localFileServerRepository.save({ path: fullFilePath, public_id: Math.floor(100000 + Math.random() * 900000), client: 'google' })
    }

    async get(publicKey: number) {
        const res = await this.localFileServerRepository.findOne({ public_id: Number(publicKey), client: 'google' })
        if (res == undefined) { throw new NotFoundException("File not found") }
        const storage = new Storage()
        return await storage.bucket(GoogleCloudCredential.bucketName).download(res.path);
    }

    async delete(privateKey: string) {
        if (privateKey.match(/^[0-9a-fA-F]{24}$/)) {
            const res = await this.localFileServerRepository.findOne({ _id: new mongodb.ObjectId(privateKey), client: 'google' })
            if (res == undefined) { throw new NotFoundException("File not found") }
            const storage = new Storage()
            await storage.bucket(GoogleCloudCredential.bucketName).file(res.path).delete();
            await this.localFileServerRepository.delete({ _id: new mongodb.ObjectId(privateKey), client: 'google' })
            return res
        } else {
            throw new HttpException('Please Provide a valid Private Key', HttpStatus.UNAUTHORIZED);
        }
    }

}
