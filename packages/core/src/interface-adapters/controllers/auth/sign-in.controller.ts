import { z } from 'zod';

import { ISignInUseCase } from '@repo/core/application/use-cases/auth/sign-in.use-case';
import { InputParseError } from '@repo/core/entities/errors/common';
import { Cookie } from '@repo/core/entities/models/cookie';
import type { IInstrumentationService } from '@repo/core/application/services/instrumentation.service.interface';

const inputSchema = z.object({
  username: z.string().min(3).max(31),
  password: z.string().min(6).max(31),
});

export type ISignInController = ReturnType<typeof signInController>;

export const signInController =
  (
    instrumentationService: IInstrumentationService,
    signInUseCase: ISignInUseCase
  ) =>
  async (input: Partial<z.infer<typeof inputSchema>>): Promise<Cookie> => {
    return await instrumentationService.startSpan(
      { name: 'signIn Controller' },
      async () => {
        const { data, error: inputParseError } = inputSchema.safeParse(input);

        if (inputParseError) {
          throw new InputParseError('Invalid data', { cause: inputParseError });
        }

        const { cookie } = await signInUseCase(data);
        return cookie;
      }
    );
  };
