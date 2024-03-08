import * as bcryptjs from 'bcryptjs';

export function encryptPassword(password: string): string {
  return bcryptjs.hashSync(password, 10);
}

export function comparePassword(password: string, hash: string): boolean {
  return bcryptjs.compareSync(password, hash);
}
