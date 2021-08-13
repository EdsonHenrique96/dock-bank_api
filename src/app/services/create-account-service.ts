import { AppError, ErrorType } from './errors/app-error';
import { Account } from '../models/account';
import { AccountRepository, UserRepository } from './protocols';

interface AccountDTO {
  ownerId: string;
  accountType: 'savings' | 'checking' | 'business';
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
    const owner = await this.userRepository.getById(account.ownerId);

    if (!owner) {
      throw new AppError({
        message: 'User is mandatory.',
        type: ErrorType.UserNotFoundError,
      });
    }

    const existingAccount = await this
      .accountRepository
      .getByOwner(account.ownerId);

    if (existingAccount) {
      return existingAccount;
    }

    const { ownerId, accountType } = account;

    const newAccount = new Account(
      {
        ownerId,
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
