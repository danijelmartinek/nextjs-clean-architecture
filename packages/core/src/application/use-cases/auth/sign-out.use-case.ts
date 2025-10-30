import { Cookie } from '@repo/core/entities/models/cookie';
import type { IInstrumentationService } from '@repo/core/application/services/instrumentation.service.interface';
import type { IAuthenticationService } from '@repo/core/application/services/authentication.service.interface';

export type ISignOutUseCase = ReturnType<typeof signOutUseCase>;

export const signOutUseCase =
  (
    instrumentationService: IInstrumentationService,
    authenticationService: IAuthenticationService
  ) =>
  (sessionId: string): Promise<{ blankCookie: Cookie }> => {
    return instrumentationService.startSpan(
      { name: 'signOut Use Case', op: 'function' },
      async () => {
        return await authenticationService.invalidateSession(sessionId);
      }
    );
  };
