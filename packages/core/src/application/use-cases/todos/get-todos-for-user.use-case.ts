import type { Todo } from '@nextjs-clean-architecture/core/entities/models/todo';
import type { IInstrumentationService } from '@nextjs-clean-architecture/core/application/services/instrumentation.service.interface';
import type { ITodosRepository } from '@nextjs-clean-architecture/core/application/repositories/todos.repository.interface';

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
