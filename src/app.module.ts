import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './env-validator';
import { JwtModule } from '@nestjs/jwt';

import {
  AccessTokenStrategy,
  RefreshTokenStrategy,
} from './utils/strategies/jwt';

import { DatabaseModule } from './database/database.module';
import { UsersModule } from './routes/users/users.module';
import { AuthModule } from './routes/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    { ...JwtModule.register({}), global: true },
    DatabaseModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService, //s
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AppModule {}
