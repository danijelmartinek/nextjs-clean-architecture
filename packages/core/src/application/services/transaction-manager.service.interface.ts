import type { ITransaction } from '@nextjs-clean-architecture/core/entities/models/transaction.interface';

export interface ITransactionManagerService {
  startTransaction<T>(
    clb: (tx: ITransaction) => Promise<T>,
    parent?: ITransaction
  ): Promise<T>;
}
