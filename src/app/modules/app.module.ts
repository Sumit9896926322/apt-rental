import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import ConfigGlobalService from '../global-services/config-global.service';
import { AllExceptionFilter } from '../interceptors/all-exception.filter';
import { ApartmentModule } from './apartment.module';
import GlobalModule from './global.module';
import { UserModule } from './user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import UtilitiesModule from './utilities.module';
import { join } from 'path';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigGlobalService) => {
        return config.loadTypeormConnection();
      },
      inject: [ConfigGlobalService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'build'),
    }),
    GlobalModule,
    UserModule,
    ApartmentModule,
    UtilitiesModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule {}
