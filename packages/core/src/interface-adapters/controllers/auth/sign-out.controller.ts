import { ISignOutUseCase } from '@repo/core/application/use-cases/auth/sign-out.use-case';
import { Cookie } from '@repo/core/entities/models/cookie';
import { InputParseError } from '@repo/core/entities/errors/common';
import type { IInstrumentationService } from '@repo/core/application/services/instrumentation.service.interface';
import { IAuthenticationService } from '@repo/core/application/services/authentication.service.interface';

export type ISignOutController = ReturnType<typeof signOutController>;

export const signOutController =
  (
    instrumentationService: IInstrumentationService,
    authenticationService: IAuthenticationService,
    signOutUseCase: ISignOutUseCase
  ) =>
  async (sessionId: string | undefined): Promise<Cookie> => {
    return await instrumentationService.startSpan(
      { name: 'signOut Controller' },
      async () => {
        if (!sessionId) {
          throw new InputParseError('Must provide a session ID');
        }
        const { session } =
          await authenticationService.validateSession(sessionId);

        const { blankCookie } = await signOutUseCase(session.id);
        return blankCookie;
      }
    );
  };
