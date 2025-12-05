export type UserRole = 'admin' | 'user';

export interface User {
  id: number;
  email: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  consent: boolean;
}

export type NewUser = Omit<User, 'id'>;
