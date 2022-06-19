import { HttpException, HttpStatus, Injectable, NotFoundException, UseInterceptors } from '@nestjs/common';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';
import { unlinkSync, writeFile } from 'fs';
import { FilerServerInterface } from './interface/file-server.interface';
import { LocalFileServerRepository } from './app.repository';
import * as mongodb from "mongodb";
import { Cron, CronExpression } from '@nestjs/schedule';

export class LocalFileServerService implements FilerServerInterface {
    constructor(private localFileServerRepository: LocalFileServerRepository) { }
    upload(file: Express.Multer.File) {
        const base64 = file.buffer.toString('base64');
        const fileName: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4()
        const extension: string = path.parse(file.originalname).ext;
        const fullFilePath = process.env.FOLDER + "/" + fileName + extension
        writeFile(fullFilePath, base64, 'base64', function (err) {
            if (err) {
                console.log(err)
            }
        });
        return this.localFileServerRepository.save({ path: fullFilePath, public_id: Math.floor(100000 + Math.random() * 900000), client: 'local' })
    }

    async get(publicKey: number) {
        const res = await this.localFileServerRepository.findOne({ public_id: Number(publicKey), client: 'local' })
        if (res == undefined) { throw new NotFoundException("File not found") }
        return res.path
    }

    async delete(privateKey: string) {
        if (privateKey.match(/^[0-9a-fA-F]{24}$/)) {
            const res = await this.localFileServerRepository.findOne({ _id: new mongodb.ObjectId(privateKey),client: 'local' })
            if (res == undefined) { throw new NotFoundException("File not found") }
            unlinkSync(res.path)
            await this.localFileServerRepository.delete({ _id: new mongodb.ObjectId(privateKey) })
            return res
        } else {
            throw new HttpException('Please Provide a valid Private Key', HttpStatus.UNAUTHORIZED);
        }

    }

    @Cron(CronExpression.EVERY_DAY_AT_1AM)
    async removePreviousNotification() {
        const date = new Date();
        date.setDate(date.getDate() - 3);
        const data = await this.localFileServerRepository.find({
            where: { created_at: { $lt: date } },
        });
        for (let i = 0; i < data.length; i++) {
            this.delete(data[i]._id)
        }
    }
}
