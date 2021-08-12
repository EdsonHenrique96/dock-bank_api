import { Transaction } from '../models/transaction';
import { AppError, ErrorType } from './errors/app-error';
import { AccountRepository, TransactionRepository } from './protocols';

export class GetTransactionService {
  private readonly accountRepository: AccountRepository;

  private readonly transactionRepository: TransactionRepository;

  constructor(
    accountRepository: AccountRepository,
    transactionRepository: TransactionRepository,
  ) {
    this.accountRepository = accountRepository;
    this.transactionRepository = transactionRepository;
  }

  public async get(accountId: string): Promise<Transaction[]> {
    const account = await this
      .accountRepository
      .getByid(accountId);

    if (!account) {
      throw new AppError({
        message: 'Account not found.',
        type: ErrorType.AccountNotFoundError,
      });
    }

    const transactions = await this
      .transactionRepository
      .getToday(accountId);

    return transactions;
  }
}
