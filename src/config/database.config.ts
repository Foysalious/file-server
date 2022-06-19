import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { registerAs } from '@nestjs/config';

export default registerAs(
    'typeOrmConfig',
    (): TypeOrmModuleOptions => ({
        type: 'mongodb',
        url: "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false",
        database: "file_server",
        entities: [__dirname + '/../**/*.entity.{js,ts}']
    }),
);
