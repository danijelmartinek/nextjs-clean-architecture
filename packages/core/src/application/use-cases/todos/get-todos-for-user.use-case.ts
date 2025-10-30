import type { Todo } from '@repo/core/entities/models/todo';
import type { IInstrumentationService } from '@repo/core/application/services/instrumentation.service.interface';
import type { ITodosRepository } from '@repo/core/application/repositories/todos.repository.interface';

export type IGetTodosForUserUseCase = ReturnType<typeof getTodosForUserUseCase>;

export const getTodosForUserUseCase =
  (
    instrumentationService: IInstrumentationService,
    todosRepository: ITodosRepository
  ) =>
  (userId: string): Promise<Todo[]> => {
    return instrumentationService.startSpan(
      { name: 'getTodosForUser UseCase', op: 'function' },
      async () => {
        return await todosRepository.getTodosForUser(userId);
      }
    );
  };
