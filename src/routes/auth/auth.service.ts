import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UserRepository } from 'src/database/repositories';

import { LoginUserDTO } from './dto/login-user.dto';
import { RegisterUserDTO } from './dto/register-user.dto';

import { comparePassword, encryptPassword } from 'src/utils/functions/bcrypt';

import { ITokenResponse, IAuth } from 'src/utils/interfaces/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private userRepository: UserRepository,
  ) {}

  private async getTokens(user_id: string): Promise<ITokenResponse> {
    const payload = { id: user_id };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_KEY'),
        expiresIn: '12h',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_KEY'),
        expiresIn: '7d',
      }),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async loginUser({ email, password }: LoginUserDTO): Promise<IAuth> {
    const userFound =
      await this.userRepository.getUserWithPasswordByEmail(email);

    if (
      !userFound ||
      userFound.deleted_at !== null ||
      (userFound && comparePassword(password, userFound.password) == false)
    )
      throw new BadRequestException('email or password invalid');

    delete userFound.password;

    const tokens = await this.getTokens(userFound.id);

    return { user: userFound, ...tokens };
  }

  async registerUser({ password, ...data }: RegisterUserDTO): Promise<IAuth> {
    const emailExists = await this.userRepository.findOne({
      where: { email: data.email },
    });
    if (emailExists) throw new BadRequestException('User email already exists');

    const hashedPassword = encryptPassword(password);
    const newUser = this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    const userSaved = await this.userRepository.save(newUser);

    const tokens = await this.getTokens(userSaved.id);

    return { user: userSaved, ...tokens };
  }

  async getProfile(user_id: string) {
    const userFound = await this.userRepository.findOne({
      where: { id: user_id },
    });
    if (!userFound) throw new NotFoundException('User not found');

    return userFound;
  }

  async refreshTokens(user_id: string): Promise<IAuth> {
    const userFound = await this.userRepository.findOne({
      where: { id: user_id },
    });
    if (!userFound) throw new NotFoundException('User not found');

    const tokens = await this.getTokens(userFound.id);

    return { user: userFound, ...tokens };
  }
}
