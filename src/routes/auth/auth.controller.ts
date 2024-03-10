import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard, RefreshTokenGuard } from 'src/utils/guards/jwt';

import { AuthService } from './auth.service';

import { LoginUserDTO } from './dto/login-user.dto';
import { RegisterUserDTO } from './dto/register-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async loginUser(@Body() data: LoginUserDTO) {
    return await this.authService.loginUser(data);
  }

  @Post('/register')
  async registerUser(@Body() data: RegisterUserDTO) {
    return await this.authService.registerUser(data);
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @Get('/profile')
  async getProfile(@Request() res: any) {
    return await this.authService.getProfile(res.user.id);
  }

  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth()
  @Get('/refresh-tokens')
  async refreshTokens(@Request() res: any) {
    return await this.authService.refreshTokens(res.user.id);
  }
}
