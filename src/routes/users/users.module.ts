import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { UserRepository } from 'src/database/repositories';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [
    UsersService, //s
    UserRepository, //r
  ],
})
export class UsersModule {}
