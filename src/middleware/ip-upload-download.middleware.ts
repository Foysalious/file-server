
import { HttpException, HttpStatus, Injectable, Ip, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as requestIp from 'request-ip';
import { IpRepository } from 'src/ip.repository';

@Injectable()
export class IpFileUploadDownloadMiddleware implements NestMiddleware {
    constructor(private readonly ipRepository: IpRepository) { }
    async use(req: Request, res: Response, next: NextFunction) {
        const clientIp = (req.ip ?? requestIp.getClientIp(req)).replace('::ffff:', '');
        if (req.method == 'GET') next()
        const count = await this.ipRepository.count({ ip: clientIp, job: req.method })
        if (count < 10) {
            this.ipRepository.save({ ip: clientIp, job: req.method, route: req.baseUrl })
            next()
        }
        else {
            throw new HttpException('You have exceeded the limit of 10 requests', HttpStatus.UNAUTHORIZED);
        }
    }
}
