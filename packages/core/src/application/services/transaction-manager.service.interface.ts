import type { ITransaction } from '@repo/core/entities/models/transaction.interface';

export interface ITransactionManagerService {
  startTransaction<T>(
    clb: (tx: ITransaction) => Promise<T>,
    parent?: ITransaction
  ): Promise<T>;
}
