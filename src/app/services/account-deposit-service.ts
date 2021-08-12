import { AppError, ErrorType } from './errors/app-error';
import { AccountRepository, TransactionRepository } from './protocols';

interface DepositTransaction {
  currentBalance: number,
  transactionId: string,
}

export class AccountDepositService {
  private readonly accountRepository: AccountRepository

  private readonly transactionRespository: TransactionRepository;

  constructor(
    accountRepository: AccountRepository,
    transactionRepository: TransactionRepository,
  ) {
    this.accountRepository = accountRepository;
    this.transactionRespository = transactionRepository;
  }

  private async insertTransaction(accountId:string, amount: number): Promise<string> {
    const transactionId = await this
      .transactionRespository
      .create(accountId, amount, 'deposit');

    return transactionId;
  }

  async deposit(accountId: string, amount: number): Promise<DepositTransaction> {
    const account = await this.accountRepository.getByid(accountId);

    if (!account) {
      throw new AppError({
        message: 'Account not found.',
        type: ErrorType.AccountNotFoundError,
      });
    }

    account.balance += amount;

    return Promise.all([
      this.insertTransaction(accountId, amount),
      this.accountRepository.update(account),
    ])
      .then(([transactionId, updatedAccount]): DepositTransaction => {
        if (!transactionId) {
          throw new Error('transaction creation failed');
        }

        if (!updatedAccount) {
          throw new Error('account update failed');
        }

        return {
          currentBalance: account.balance,
          transactionId,
        };
      })
      .catch((error) => {
        throw new Error(`an error occurred in the deposit: ${error.message}`);
      });
  }
}
