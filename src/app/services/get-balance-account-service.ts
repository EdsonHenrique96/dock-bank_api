import { AppError, ErrorType } from './errors/app-error';
import { AccountRepository } from './protocols';

export class GetBalanceAccountService {
  private readonly accountRepository: AccountRepository;

  constructor(accountRepository: AccountRepository) {
    this.accountRepository = accountRepository;
  }

  public async getBalance(accountId: string): Promise<number> {
    const account = await this
      .accountRepository
      .getByid(accountId);

    if (!account) {
      throw new AppError({
        message: 'Account not found.',
        type: ErrorType.AccountNotFoundError,
      });
    }

    return account.balance;
  }
}
