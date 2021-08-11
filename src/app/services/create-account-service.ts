import { v4 as uuidv4 } from 'uuid';

import { UserNotFoundError } from './errors';

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

  public async create(account: AccountDTO): Promise<Account> {
    const owner = await this
      .userRepository
      .getById(account.ownerId);

    if (!owner) {
      throw new UserNotFoundError('User is mandatory.');
    }

    const existingAccount = await this
      .accountRepository
      .getByOwner(owner.id);

    if (existingAccount) {
      return existingAccount;
    }

    const { ownerId, accountType } = account;

    const newAccount = new Account(
      {
        id: uuidv4(),
        ownerId,
        accountType,
      },
    );

    const savedAccount = await this
      .accountRepository
      .add(newAccount);

    return savedAccount;
  }
}
