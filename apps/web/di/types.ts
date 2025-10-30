import { IAuthenticationService } from '@repo/core/application/services/authentication.service.interface';
import { ITransactionManagerService } from '@repo/core/application/services/transaction-manager.service.interface';
import { IInstrumentationService } from '@repo/core/application/services/instrumentation.service.interface';
import { ICrashReporterService } from '@repo/core/application/services/crash-reporter.service.interface';

import { ITodosRepository } from '@repo/core/application/repositories/todos.repository.interface';
import { IUsersRepository } from '@repo/core/application/repositories/users.repository.interface';

import { ICreateTodoUseCase } from '@repo/core/application/use-cases/todos/create-todo.use-case';
import { IDeleteTodoUseCase } from '@repo/core/application/use-cases/todos/delete-todo.use-case';
import { IGetTodosForUserUseCase } from '@repo/core/application/use-cases/todos/get-todos-for-user.use-case';
import { IToggleTodoUseCase } from '@repo/core/application/use-cases/todos/toggle-todo.use-case';
import { ISignInUseCase } from '@repo/core/application/use-cases/auth/sign-in.use-case';
import { ISignUpUseCase } from '@repo/core/application/use-cases/auth/sign-up.use-case';
import { ISignOutUseCase } from '@repo/core/application/use-cases/auth/sign-out.use-case';

import { ISignInController } from '@repo/core/interface-adapters/controllers/auth/sign-in.controller';
import { ISignOutController } from '@repo/core/interface-adapters/controllers/auth/sign-out.controller';
import { ISignUpController } from '@repo/core/interface-adapters/controllers/auth/sign-up.controller';
import { IBulkUpdateController } from '@repo/core/interface-adapters/controllers/todos/bulk-update.controller';
import { ICreateTodoController } from '@repo/core/interface-adapters/controllers/todos/create-todo.controller';
import { IGetTodosForUserController } from '@repo/core/interface-adapters/controllers/todos/get-todos-for-user.controller';
import { IToggleTodoController } from '@repo/core/interface-adapters/controllers/todos/toggle-todo.controller';

export const DI_SYMBOLS = {
  // Services
  IAuthenticationService: Symbol.for('IAuthenticationService'),
  ITransactionManagerService: Symbol.for('ITransactionManagerService'),
  IInstrumentationService: Symbol.for('IInstrumentationService'),
  ICrashReporterService: Symbol.for('ICrashReporterService'),

  // Repositories
  ITodosRepository: Symbol.for('ITodosRepository'),
  IUsersRepository: Symbol.for('IUsersRepository'),

  // Use Cases
  ICreateTodoUseCase: Symbol.for('ICreateTodoUseCase'),
  IDeleteTodoUseCase: Symbol.for('IDeleteTodoUseCase'),
  IGetTodosForUserUseCase: Symbol.for('IGetTodosForUserUseCase'),
  IToggleTodoUseCase: Symbol.for('IToggleTodoUseCase'),
  ISignInUseCase: Symbol.for('ISignInUseCase'),
  ISignOutUseCase: Symbol.for('ISignOutUseCase'),
  ISignUpUseCase: Symbol.for('ISignUpUseCase'),

  // Controllers
  ISignInController: Symbol.for('ISignInController'),
  ISignOutController: Symbol.for('ISignOutController'),
  ISignUpController: Symbol.for('ISignUpController'),
  IBulkUpdateController: Symbol.for('IBulkUpdateController'),
  ICreateTodoController: Symbol.for('ICreateTodoController'),
  IGetTodosForUserController: Symbol.for('IGetTodosForUserController'),
  IToggleTodoController: Symbol.for('IToggleTodoController'),
};

export interface DI_RETURN_TYPES {
  // Services
  IAuthenticationService: IAuthenticationService;
  ITransactionManagerService: ITransactionManagerService;
  IInstrumentationService: IInstrumentationService;
  ICrashReporterService: ICrashReporterService;

  // Repositories
  ITodosRepository: ITodosRepository;
  IUsersRepository: IUsersRepository;

  // Use Cases
  ICreateTodoUseCase: ICreateTodoUseCase;
  IDeleteTodoUseCase: IDeleteTodoUseCase;
  IGetTodosForUserUseCase: IGetTodosForUserUseCase;
  IToggleTodoUseCase: IToggleTodoUseCase;
  ISignInUseCase: ISignInUseCase;
  ISignOutUseCase: ISignOutUseCase;
  ISignUpUseCase: ISignUpUseCase;

  // Controllers
  ISignInController: ISignInController;
  ISignOutController: ISignOutController;
  ISignUpController: ISignUpController;
  IBulkUpdateController: IBulkUpdateController;
  ICreateTodoController: ICreateTodoController;
  IGetTodosForUserController: IGetTodosForUserController;
  IToggleTodoController: IToggleTodoController;
}
