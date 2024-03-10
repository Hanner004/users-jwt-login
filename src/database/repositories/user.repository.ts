import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createQueryRunnerExample(newUser: User): Promise<User> {
    const queryRunner = this.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const userSaved = await queryRunner.manager.save(newUser);
      await queryRunner.commitTransaction();
      return userSaved;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getUsersWithDeleted(): Promise<User[]> {
    return await this.createQueryBuilder('user')
      .withDeleted()
      .orderBy('user.created_at', 'DESC')
      .getMany();
  }

  async getUserWithPasswordByEmail(email: string): Promise<User> {
    return await this.createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }
}
