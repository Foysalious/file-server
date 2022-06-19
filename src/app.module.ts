import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import dbConfig from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalFileServerService } from './local-file-server.service';
import { LocalFileServerRepository } from './app.repository';
import { IpFileUploadDownloadMiddleware } from './middleware/ip-upload-download.middleware';
import { IpRepository } from './ip.repository';
import { GoogleFileServerService } from './google-file-server.service';

@Module({
  imports: [TypeOrmModule.forFeature([LocalFileServerRepository,IpRepository]), ConfigModule, ConfigModule.forRoot({
    isGlobal: true,
    ignoreEnvFile: false,
  }), TypeOrmModule.forRoot(dbConfig()),],
  controllers: [AppController],
  providers: [AppService, LocalFileServerService,GoogleFileServerService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IpFileUploadDownloadMiddleware).forRoutes('*')
      ;
  }
}
 