/* eslint max-classes-per-file: ["error", 3] */
import { Account, AccountType } from '../../../src/app/models/account';
import { User } from '../../../src/app/models/user';
import { CreateAccountService } from '../../../src/app/services/create-account-service';
import { AccountRepository, UserRepository } from '../../../src/app/services/protocols';

const fakeUser = new User({
  id: 'userIdfake',
  name: 'fakeUser',
  cpf: '99999999999',
  birthDate: new Date(),
});

const makeUserRepository = () => {
  class UserRepositoryStub implements UserRepository {
    async save(user: User): Promise<User> {
      return fakeUser;
    }

    async getById(id: string): Promise<User|undefined> {
      return fakeUser;
    }

    async getByCpf(cpf: string): Promise<User|undefined> {
      return fakeUser;
    }
  }

  return new UserRepositoryStub();
};

const existingAccount = new Account({
  id: '987654123',
  userId: 'userIdfake',
  accountType: AccountType.checking,
});

const fakeAccount = new Account({
  id: 'xptoxpto123',
  userId: 'userIdfake',
  accountType: AccountType.checking,
});

const makeAccRepository = () => {
  class AccRepositoryStub implements AccountRepository {
    async save(account: Account): Promise<boolean> {
      return true;
    }

    async getByOwner(userId: string): Promise<Account|undefined> {
      return undefined;
    }

    async getByid(id: string): Promise<Account|undefined> {
      return fakeAccount;
    }

    async update(account: Account): Promise<boolean> {
      return true;
    }
  }

  return new AccRepositoryStub();
};

const makeSut = (): {
  sut: CreateAccountService,
  accRepositoryStub: AccountRepository,
  userRepositoryStub: UserRepository
} => {
  const accRepositoryStub = makeAccRepository();
  const userRepositoryStub = makeUserRepository();
  const sut = new CreateAccountService(
    accRepositoryStub,
    userRepositoryStub,
  );

  return {
    sut,
    accRepositoryStub,
    userRepositoryStub,
  };
};

describe('CreateAccountService', () => {
  it('should throws when user not exist', () => {
    const { sut, userRepositoryStub } = makeSut();

    jest.spyOn(userRepositoryStub, 'getById')
      .mockReturnValueOnce(Promise.resolve(undefined));

    const promise = sut.create({ userId: fakeUser.id, accountType: AccountType.checking });
    expect(promise).rejects.toThrowError();
  });

  it('should return an account when account already exists', async () => {
    const { sut, accRepositoryStub } = makeSut();

    jest.spyOn(accRepositoryStub, 'getByOwner')
      .mockResolvedValueOnce(existingAccount);

    const account = await sut
      .create({
        userId: fakeUser.id,
        accountType: AccountType.checking,
      });

    expect(account).toEqual(existingAccount);
  });

  it('should return an account when successful creation', async () => {
    const { sut } = makeSut();

    const account = await sut
      .create({
        userId: fakeUser.id,
        accountType: AccountType.checking,
      });

    expect(account.id).toBeTruthy();
    expect(account.userId).toEqual(fakeUser.id);
    expect(account.balance).toEqual(0);
    // FIXME - this amount is currently broken
    expect(account.dailyWithdrawalLimit).toEqual(100000);
    expect(account.isActive).toBeTruthy();
    expect(account.accountType).toEqual('checking');
  });
});
