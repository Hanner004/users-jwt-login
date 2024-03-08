import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { UserRepository } from 'src/database/repositories';

import { encryptPassword } from 'src/functions/bcrypt';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async create({ password, ...data }: CreateUserDto) {
    const emailExists = await this.userRepository.findOne({
      where: { email: data.email },
    });
    if (emailExists) throw new BadRequestException('User email already exists');

    const hashedPassword = encryptPassword(password);
    const newUser = this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    return await this.userRepository.save(newUser);
  }

  async findAll() {
    return await this.userRepository.getUsers();
  }

  async findOne(id: string) {
    const userFound = await this.userRepository.findOne({ where: { id } });
    if (!userFound) throw new NotFoundException('User not found');

    return userFound;
  }

  async update(id: string, data: UpdateUserDto) {
    const userFound = await this.userRepository.findOne({ where: { id } });
    if (!userFound) throw new NotFoundException('User not found');

    if (data.password) {
      data.password = encryptPassword(data.password);
    }

    await this.userRepository.update(id, data);

    return await this.userRepository.findOne({ where: { id } });
  }

  async remove(id: string) {
    const userFound = await this.userRepository.findOne({ where: { id } });
    if (!userFound) throw new NotFoundException('User not found');

    await this.userRepository.softRemove(userFound);
    return { message: 'User removed successfully' };
  }
}
