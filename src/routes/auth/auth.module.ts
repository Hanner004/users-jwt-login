import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { UserRepository } from 'src/database/repositories';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    AuthService, //s
    UserRepository, //r
  ],
})
export class AuthModule {}
