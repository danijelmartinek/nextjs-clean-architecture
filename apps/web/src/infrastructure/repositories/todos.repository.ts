import { getPayloadClient } from '@repo/payload';
import { ITodosRepository } from '@repo/core/application/repositories/todos.repository.interface';
import { DatabaseOperationError } from '@repo/core/entities/errors/common';
import { TodoInsert, Todo } from '@repo/core/entities/models/todo';
import type { IInstrumentationService } from '@repo/core/application/services/instrumentation.service.interface';
import type { ICrashReporterService } from '@repo/core/application/services/crash-reporter.service.interface';

const COLLECTION = 'todos';

type TodoDocument = {
  id: string;
  todoId: number;
  todo: string;
  completed: boolean;
  userId: string;
};

function toTodo(doc: TodoDocument): Todo {
  return {
    id: doc.todoId,
    todo: doc.todo,
    completed: doc.completed,
    userId: doc.userId,
  };
}

export class TodosRepository implements ITodosRepository {
  constructor(
    private readonly instrumentationService: IInstrumentationService,
    private readonly crashReporterService: ICrashReporterService
  ) {}

  async createTodo(todo: TodoInsert, _tx?: unknown): Promise<Todo> {
    return await this.instrumentationService.startSpan(
      { name: 'TodosRepository > createTodo' },
      async () => {
        try {
          const payload = await getPayloadClient();

          const existing = await payload.find({
            collection: COLLECTION,
            limit: 1,
            sort: '-todoId',
          });

          const existingDocs = existing.docs as TodoDocument[];
          const nextId = (existingDocs[0]?.todoId ?? 0) + 1;

          const created = (await payload.create({
            collection: COLLECTION,
            data: {
              todoId: nextId,
              todo: todo.todo,
              completed: todo.completed,
              userId: todo.userId,
            },
          })) as TodoDocument;

          return toTodo(created);
        } catch (err) {
          this.crashReporterService.report(err);
          throw err; // TODO: convert to Entities error
        }
      }
    );
  }

  async getTodo(id: number): Promise<Todo | undefined> {
    return await this.instrumentationService.startSpan(
      { name: 'TodosRepository > getTodo' },
      async () => {
        try {
          const payload = await getPayloadClient();
          const result = await payload.find({
            collection: COLLECTION,
            where: {
              todoId: {
                equals: id,
              },
            },
            limit: 1,
          });

          const docs = result.docs as TodoDocument[];
          const todo = docs[0];

          return todo ? toTodo(todo) : undefined;
        } catch (err) {
          this.crashReporterService.report(err);
          throw err; // TODO: convert to Entities error
        }
      }
    );
  }

  async getTodosForUser(userId: string): Promise<Todo[]> {
    return await this.instrumentationService.startSpan(
      { name: 'TodosRepository > getTodosForUser' },
      async () => {
        try {
          const payload = await getPayloadClient();
          const result = await payload.find({
            collection: COLLECTION,
            where: {
              userId: {
                equals: userId,
              },
            },
            sort: 'todoId',
          });

          const docs = result.docs as TodoDocument[];

          return docs.map(toTodo);
        } catch (err) {
          this.crashReporterService.report(err);
          throw err; // TODO: convert to Entities error
        }
      }
    );
  }

  async updateTodo(
    id: number,
    input: Partial<TodoInsert>,
    _tx?: unknown
  ): Promise<Todo> {
    return await this.instrumentationService.startSpan(
      { name: 'TodosRepository > updateTodo' },
      async () => {
        try {
          const payload = await getPayloadClient();
          const existing = await payload.find({
            collection: COLLECTION,
            where: {
              todoId: {
                equals: id,
              },
            },
            limit: 1,
          });

          const docs = existing.docs as TodoDocument[];
          const doc = docs[0];

          if (!doc) {
            throw new DatabaseOperationError('Cannot update todo');
          }

          const updated = (await payload.update({
            collection: COLLECTION,
            id: doc.id,
            data: {
              todoId: doc.todoId,
              todo: input.todo ?? doc.todo,
              completed: input.completed ?? doc.completed,
              userId: doc.userId,
            },
          })) as TodoDocument;

          return toTodo(updated);
        } catch (err) {
          this.crashReporterService.report(err);
          throw err; // TODO: convert to Entities error
        }
      }
    );
  }

  async deleteTodo(id: number, _tx?: unknown): Promise<void> {
    await this.instrumentationService.startSpan(
      { name: 'TodosRepository > deleteTodo' },
      async () => {
        try {
          const payload = await getPayloadClient();
          const existing = await payload.find({
            collection: COLLECTION,
            where: {
              todoId: {
                equals: id,
              },
            },
            limit: 1,
          });

          const docs = existing.docs as TodoDocument[];
          const doc = docs[0];

          if (!doc) {
            throw new DatabaseOperationError('Cannot delete todo');
          }

          await payload.delete({
            collection: COLLECTION,
            id: doc.id,
          });
        } catch (err) {
          this.crashReporterService.report(err);
          throw err; // TODO: convert to Entities error
        }
      }
    );
  }
}
