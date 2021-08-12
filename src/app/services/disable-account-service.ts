import { AppError, ErrorType } from './errors/app-error';
import { AccountRepository } from './protocols';

export class DisableAccountService {
  private readonly accountRepository: AccountRepository;

  constructor(accountRepository: AccountRepository) {
    this.accountRepository = accountRepository;
  }

  public async disable(accountId: string): Promise<boolean> {
    const account = await this
      .accountRepository
      .getByid(accountId);

    if (!account) {
      throw new AppError({
        message: 'Account not found.',
        type: ErrorType.AccountNotFoundError,
      });
    }

    account.isActive = false;

    const isUpdated = await this
      .accountRepository
      .update(account);

    return isUpdated;
  }
}
