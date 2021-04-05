import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ConfigGlobalService from '../global-services/config-global.service';
import GlobalModule from './global.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigGlobalService) => {
        return config.loadTypeormConnection();
      },
      inject: [ConfigGlobalService],
    }),
    GlobalModule,
  ],
})
export class ConnectionModule {}
