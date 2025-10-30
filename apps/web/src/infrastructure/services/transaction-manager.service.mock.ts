import { ITransactionManagerService } from '@repo/core/application/services/transaction-manager.service.interface';
import { ITransaction } from '@repo/core/entities/models/transaction.interface';

export class MockTransactionManagerService
  implements ITransactionManagerService
{
  public startTransaction<T>(
    clb: (tx: ITransaction) => Promise<T>
  ): Promise<T> {
    return clb({ rollback: () => {} });
  }
}
