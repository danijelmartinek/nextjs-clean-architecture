import { hash } from 'bcrypt-ts';

import { getPayloadClient } from '@repo/payload';
import { IUsersRepository } from '@repo/core/application/repositories/users.repository.interface';
import { DatabaseOperationError } from '@repo/core/entities/errors/common';
import type { CreateUser, User } from '@repo/core/entities/models/user';
import type { IInstrumentationService } from '@repo/core/application/services/instrumentation.service.interface';
import type { ICrashReporterService } from '@repo/core/application/services/crash-reporter.service.interface';
import { PASSWORD_SALT_ROUNDS } from '@/config';

type UserDocument = {
  id: string;
  appUserId: string;
  username: string;
  password_hash: string;
};

const COLLECTION = 'users';

function toUser(doc: UserDocument): User {
  return {
    id: doc.appUserId,
    username: doc.username,
    password_hash: doc.password_hash,
  };
}

export class UsersRepository implements IUsersRepository {
  constructor(
    private readonly instrumentationService: IInstrumentationService,
    private readonly crashReporterService: ICrashReporterService
  ) {}
  async getUser(id: string): Promise<User | undefined> {
    return await this.instrumentationService.startSpan(
      { name: 'UsersRepository > getUser' },
      async () => {
        try {
          const payload = await getPayloadClient();
          const result = await payload.find<UserDocument>({
            collection: COLLECTION,
            where: {
              appUserId: {
                equals: id,
              },
            },
            limit: 1,
          });

          const doc = result.docs[0];

          return doc ? toUser(doc) : undefined;
        } catch (err) {
          this.crashReporterService.report(err);
          throw err; // TODO: convert to Entities error
        }
      }
    );
  }
  async getUserByUsername(username: string): Promise<User | undefined> {
    return await this.instrumentationService.startSpan(
      { name: 'UsersRepository > getUserByUsername' },
      async () => {
        try {
          const payload = await getPayloadClient();
          const result = await payload.find<UserDocument>({
            collection: COLLECTION,
            where: {
              username: {
                equals: username,
              },
            },
            limit: 1,
          });

          const doc = result.docs[0];

          return doc ? toUser(doc) : undefined;
        } catch (err) {
          this.crashReporterService.report(err);
          throw err; // TODO: convert to Entities error
        }
      }
    );
  }
  async createUser(input: CreateUser): Promise<User> {
    return await this.instrumentationService.startSpan(
      { name: 'UsersRepository > createUser' },
      async () => {
        try {
          const password_hash = await this.instrumentationService.startSpan(
            { name: 'hash password', op: 'function' },
            () => hash(input.password, PASSWORD_SALT_ROUNDS)
          );

          const newUser: User = {
            id: input.id,
            username: input.username,
            password_hash,
          };
          const payload = await getPayloadClient();
          const created = await payload.create<UserDocument>({
            collection: COLLECTION,
            data: {
              appUserId: newUser.id,
              username: newUser.username,
              password_hash: newUser.password_hash,
            },
          });

          if (!created) {
            throw new DatabaseOperationError('Cannot create user.');
          }

          return toUser(created);
        } catch (err) {
          this.crashReporterService.report(err);
          throw err; // TODO: convert to Entities error
        }
      }
    );
  }
}
