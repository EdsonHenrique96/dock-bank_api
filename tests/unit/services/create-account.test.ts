/* eslint max-classes-per-file: ["error", 3] */
import { Account } from '../../../src/app/models/account';
import { User } from '../../../src/app/models/user';
import { CreateAccountService } from '../../../src/app/services/create-account-service';
import { AccountRepository, UserRepository } from '../../../src/app/services/protocols';

const fakeUser = new User({
  id: 'owneridfake',
  name: 'fakeUser',
  cpf: '99999999999',
  birthDate: new Date(),
});

const makeUserRepository = () => {
  class UserRepositoryStub implements UserRepository {
    async add(user: User): Promise<User> {
      return fakeUser;
    }

    async getById(id: string): Promise<User|null> {
      return fakeUser;
    }

    async getByCpf(cpf: string): Promise<User|null> {
      return fakeUser;
    }
  }

  return new UserRepositoryStub();
};

const existingAccount = new Account({
  id: '987654123',
  ownerId: 'owneridfake',
  accountType: 'checking',
});

const fakeAccount = new Account({
  id: 'xptoxpto123',
  ownerId: 'owneridfake',
  accountType: 'checking',
});

const makeAccRepository = () => {
  class AccRepositoryStub implements AccountRepository {
    async add(account: Account): Promise<Account> {
      return fakeAccount;
    }

    async getByOwner(ownerId: string): Promise<Account|null> {
      return null;
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
  const sut = new CreateAccountService(accRepositoryStub, userRepositoryStub);

  return {
    sut,
    accRepositoryStub,
    userRepositoryStub,
  };
};

describe('CreateAccountService', () => {
  it('should throws when user not exist', async () => {
    const { sut, userRepositoryStub } = makeSut();

    jest.spyOn(userRepositoryStub, 'getById')
      .mockResolvedValueOnce(null);

    const promise = sut.create({ ownerId: fakeUser.id, accountType: 'checking' });
    expect(promise).rejects.toThrow();
  });

  it('should return an account when account already exists', async () => {
    const { sut, accRepositoryStub } = makeSut();

    jest.spyOn(accRepositoryStub, 'getByOwner')
      .mockResolvedValueOnce(existingAccount);

    const account = await sut
      .create({
        ownerId: fakeUser.id,
        accountType: 'checking',
      });

    expect(account).toEqual(existingAccount);
  });

  it('should return an account when successful creation', async () => {
    const { sut } = makeSut();

    const account = await sut
      .create({
        ownerId: fakeUser.id,
        accountType: 'checking',
      });

    expect(account).toEqual(fakeAccount);
  });
});
