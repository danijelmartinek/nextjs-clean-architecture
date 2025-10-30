import { Cookie } from '@nextjs-clean-architecture/core/entities/models/cookie';
import { Session } from '@nextjs-clean-architecture/core/entities/models/session';
import { User } from '@nextjs-clean-architecture/core/entities/models/user';

export interface IAuthenticationService {
  generateUserId(): string;
  validateSession(
    sessionId: Session['id']
  ): Promise<{ user: User; session: Session }>;
  validatePasswords(
    inputPassword: string,
    usersHashedPassword: string
  ): Promise<boolean>;
  createSession(user: User): Promise<{ session: Session; cookie: Cookie }>;
  invalidateSession(sessionId: Session['id']): Promise<{ blankCookie: Cookie }>;
}
