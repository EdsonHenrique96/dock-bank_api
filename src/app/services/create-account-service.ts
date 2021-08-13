import { AppError, ErrorType } from './errors/app-error';
import { Account, AccountType } from '../models/account';
import { AccountRepository, UserRepository } from './protocols';

interface AccountDTO {
  userId: string;
  accountType: AccountType;
}

export class CreateAccountService {
  private readonly accountRepository: AccountRepository;

  private readonly userRepository: UserRepository;

  constructor(
    accountRepository: AccountRepository,
    userRepository: UserRepository,
  ) {
    this.accountRepository = accountRepository;
    this.userRepository = userRepository;
  }

  async create(account: AccountDTO): Promise<Account> {
    const owner = await this.userRepository.getById(account.userId);

    if (!owner) {
      throw new AppError({
        message: 'User is mandatory.',
        type: ErrorType.UserNotFoundError,
      });
    }

    const existingAccount = await this
      .accountRepository
      .getByOwner(account.userId);

    if (existingAccount) {
      return existingAccount;
    }

    const { userId, accountType } = account;

    const newAccount = new Account(
      {
        userId,
        accountType,
      },
    );

    const created = await this
      .accountRepository
      .save(newAccount);

    if (!created) {
      throw new Error('Account creation fails');
    }

    return newAccount;
  }
}
