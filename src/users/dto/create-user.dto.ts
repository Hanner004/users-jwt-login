import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Hanner' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'DLH' })
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({ example: 'hanner@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  @IsLowercase()
  email: string;

  @ApiProperty({ example: 'Qwerty123*' })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @IsNotEmpty()
  password: string;
}
