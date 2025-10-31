import { UnauthorizedError } from '@repo/core/entities/errors/auth';
import { NotFoundError } from '@repo/core/entities/errors/common';
import type { Todo } from '@repo/core/entities/models/todo';
import type { ITransaction } from '@repo/core/entities/models/transaction.interface';
import type { IInstrumentationService } from '@repo/core/application/services/instrumentation.service.interface';
import type { ITodosRepository } from '@repo/core/application/repositories/todos.repository.interface';

export type IToggleTodoUseCase = ReturnType<typeof toggleTodoUseCase>;

export const toggleTodoUseCase =
  (
    instrumentationService: IInstrumentationService,
    todosRepository: ITodosRepository
  ) =>
  (
    input: {
      todoId: number;
    },
    userId: string,
    tx?: ITransaction
  ): Promise<Todo> => {
    return instrumentationService.startSpan(
      { name: 'toggleTodo Use Case', op: 'function' },
      async () => {
        const todo = await todosRepository.getTodo(input.todoId);

        if (!todo) {
          throw new NotFoundError('Todo does not exist');
        }

        if (todo.userId !== userId) {
          throw new UnauthorizedError(
            'Cannot toggle todo. Reason: unauthorized'
          );
        }

        const updatedTodo = await todosRepository.updateTodo(
          todo.id,
          {
            completed: !todo.completed,
          },
          tx
        );

        return updatedTodo;
      }
    );
  };
