import { ITransactionManagerService } from '@nextjs-clean-architecture/core/application/services/transaction-manager.service.interface';
import { ITransaction } from '@nextjs-clean-architecture/core/entities/models/transaction.interface';

export class MockTransactionManagerService
  implements ITransactionManagerService
{
  public startTransaction<T>(
    clb: (tx: ITransaction) => Promise<T>
  ): Promise<T> {
    return clb({ rollback: () => {} });
  }
}
