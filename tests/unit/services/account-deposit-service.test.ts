/* eslint max-classes-per-file: ["error", 3] */
import { Account, AccountType } from '../../../src/app/models/account';
import { Transaction, TransactionType } from '../../../src/app/models/transaction';
import { AccountDepositService } from '../../../src/app/services/account-deposit-service';
import { AppError } from '../../../src/app/services/errors/app-error';
import { AccountRepository, TransactionRepository } from '../../../src/app/services/protocols';

const makeAccRepository = () => {
  class AccRepositoryStub implements AccountRepository {
    async save(account: Account): Promise<boolean> {
      return true;
    }

    async getByOwner(ownerId: string): Promise<Account|undefined> {
      return undefined;
    }

    async getByid(id: string): Promise<Account|undefined> {
      return new Account({
        id: 'xptoxpto123',
        ownerId: 'owneridfake',
        accountType: AccountType.checking,
      });
    }

    async update(account: Account): Promise<boolean> {
      return true;
    }
  }

  return new AccRepositoryStub();
};

const makeTransactionRepository = () => {
  class TransactionRepositoryStub implements TransactionRepository {
    async getByAccount(accountId: string): Promise<Transaction[]> {
      return [
        {
          id: '123',
          accountId: '789',
          amount: 0,
          type: 'deposit',
          createdAt: new Date(),
        },
        {
          id: '456',
          accountId: '456',
          amount: 0,
          type: 'deposit',
          createdAt: new Date(),
        },
        {
          id: '789',
          accountId: '123',
          amount: 0,
          type: 'deposit',
          createdAt: new Date(),
        },
      ];
    }

    async getToday(accountId: string): Promise<Transaction[]> {
      return [
        {
          id: '123',
          accountId: '789',
          amount: 0,
          type: 'deposit',
          createdAt: new Date(),
        },
        {
          id: '456',
          accountId: '456',
          amount: 0,
          type: 'deposit',
          createdAt: new Date(),
        },
        {
          id: '789',
          accountId: '123',
          amount: 0,
          type: 'deposit',
          createdAt: new Date(),
        },
      ];
    }

    async create(accountId: string, amount: number, type: TransactionType): Promise<string> {
      return 'id123';
    }
  }

  return new TransactionRepositoryStub();
};

const makeSut = () => {
  const accRepository = makeAccRepository();
  const transactionRepository = makeTransactionRepository();
  const accountDepositService = new AccountDepositService(accRepository, transactionRepository);

  return {
    accRepository,
    transactionRepository,
    sut: accountDepositService,
  };
};

describe('AccountDepositService', () => {
  it('should throw an error when one does not exist', async () => {
    const { sut, accRepository } = makeSut();
    const accountId = 'fakeid123';
    const amount = 200;

    jest.spyOn(accRepository, 'getByid')
      .mockReturnValueOnce(Promise.resolve(undefined));

    const promise = sut.deposit(accountId, amount);
    expect(promise).rejects.toThrowError();
  });

  it('should throw an error when transaction failed', async () => {
    const { sut, transactionRepository } = makeSut();
    const accountId = 'fakeid123';
    const amount = 200;

    jest.spyOn(transactionRepository, 'create')
      .mockReturnValueOnce(Promise.resolve(''));

    const promise = sut.deposit(accountId, amount);
    expect(promise).rejects.toThrowError();
  });

  it('should throw an error when account update return false', async () => {
    const { sut, accRepository } = makeSut();
    const accountId = 'fakeid123';
    const amount = 200;

    jest.spyOn(accRepository, 'update')
      .mockReturnValueOnce(Promise.resolve(false));

    const promise = sut.deposit(accountId, amount);
    expect(promise).rejects.toThrowError();
  });

  it('should make a successful deposit', async () => {
    const { sut } = makeSut();
    const accountId = 'fakeid123';
    const amount = 200;

    const newBalance = await sut.deposit(accountId, amount);
    expect(newBalance.currentBalance).toEqual(200);
    expect(newBalance.transactionId).toBeTruthy();
  });
});
