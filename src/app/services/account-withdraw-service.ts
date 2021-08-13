import { Account } from '../models/account';
import { AppError, ErrorType } from './errors/app-error';
import { AccountRepository, TransactionRepository } from './protocols';

interface WithdrawTransaction {
  currentBalance: number,
  transactionId: string,
}

export class AccountWithdrawService {
  private readonly accountRepository: AccountRepository

  private readonly transactionRespository: TransactionRepository;

  constructor(
    accountRepository: AccountRepository,
    transactionRespository: TransactionRepository,
  ) {
    this.accountRepository = accountRepository;
    this.transactionRespository = transactionRespository;
  }

  private async getDailyWithdrawalLimit(account: Account): Promise<number> {
    const transactions = await this
      .transactionRespository
      .getToday(account.id);

    if (transactions.length <= 0) {
      return account.dailyWithdrawalLimit;
    }

    const todayWithdrawalTotal = transactions.reduce((acc, current) => {
      let sum = acc;
      if (current.type === 'withdraw') {
        sum = acc + current.amount;
      }
      return sum;
    }, 0);

    return account.dailyWithdrawalLimit - todayWithdrawalTotal;
  }

  async withdraw(accountId: string, amount: number): Promise<WithdrawTransaction> {
    const account = await this.accountRepository.getByid(accountId);

    if (!account) {
      throw new AppError({
        message: 'Account not found.',
        type: ErrorType.AccountNotFoundError,
      });
    }

    const hasALimit = account.balance >= amount;
    if (!hasALimit) {
      throw new AppError({
        message: 'The withdrawal amount must be less than the account balance.',
        type: ErrorType.AccountWithoutBalance,
      });
    }

    const dailyLimit = await this.getDailyWithdrawalLimit(account);
    const hasDailyLimit = dailyLimit >= amount;

    if (!hasDailyLimit) {
      throw new AppError({
        message: `Exceeded the daily limit, your remaining daily limit ${dailyLimit}`,
        type: ErrorType.ExceededTheDailyLimit,
      });
    }

    account.balance -= amount;

    return Promise.all([
      this.transactionRespository.create(accountId, amount, 'withdraw'),
      this.accountRepository.update(account),
    ])
      .then(([transactionId, updatedAccount]): WithdrawTransaction => {
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
