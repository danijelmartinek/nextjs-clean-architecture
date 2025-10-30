import type { User, CreateUser } from '@nextjs-clean-architecture/core/entities/models/user';
import type { ITransaction } from '@nextjs-clean-architecture/core/entities/models/transaction.interface';

export interface IUsersRepository {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(input: CreateUser, tx?: ITransaction): Promise<User>;
}
