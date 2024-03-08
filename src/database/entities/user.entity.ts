import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base-entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  lastname: string;

  @Column()
  @Index('IDX_USER_EMAIL', { unique: true, where: `(deleted_at is null)` })
  email: string;

  @Column({ select: false })
  password: string;
}
