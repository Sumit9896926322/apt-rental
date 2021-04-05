import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { loadEnvironmentVariables } from '../../app/cli/loader';
import UserEntity from '../entities/user.entity';
import { ConnectionModule } from '../../app/modules/connection.module';

async function bootstrap() {
  loadEnvironmentVariables();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ConnectionModule,
  );
  console.log('hello');
  const users: Partial<UserEntity>[] = [
    {
      username: 'admin1',
      email: 'admin1@gmail.com',
      password: 'admin1',
      role: 'admin',
    },
    {
      username: 'admin2',
      email: 'admin2@gmail.com',
      password: 'admin2',
      role: 'admin',
    },
  ];
  for (let a of users) {
    let seedUser: UserEntity = new UserEntity();

    seedUser.username = a.username;
    seedUser.email = a.email;
    seedUser.password = a.password;
    seedUser.role = a.role;

    console.log(seedUser);
    await seedUser.save();
  }
}
bootstrap();
