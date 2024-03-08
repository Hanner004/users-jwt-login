import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './env-validator';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    { ...JwtModule.register({}), global: true },
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
