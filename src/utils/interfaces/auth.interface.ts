export interface IAuth {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

interface IUser {
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  id: string;
  name: string;
  lastname: string;
  email: string;
}

export interface ITokenResponse {
  accessToken: string;
  refreshToken: string;
}
