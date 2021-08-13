import { Express } from 'express';
import { agent as request } from 'supertest';

import { setupApi } from '../../../src/app/api/index';

import {
  cleanDB,
  closeConnection,
  createAccount,
  createUser,
  createTransaction,
  existingAccountId,
  cleanTransactions,
  updateBalance,
  getTransactionById,
} from '../helpers/db';

const populateDb = async (): Promise<void> => {
  await createUser();
  await createAccount();
};

describe('Withdraw', () => {
  let api: Express;

  beforeAll(async () => {
    api = await setupApi();
    await populateDb();
  });

  /**
   * this should be done to avoid side effects with future testing.
   */
  afterEach(async () => {
    // reset balance
    await cleanTransactions();
  });

  afterAll(async () => {
    await cleanDB();
    await closeConnection();
  });

  it('should return 200 for a withdrawal of 500 since the daily limit is 100,000 and was withheld today 99,500', async () => {
    await Promise.all([
      createTransaction({ accountId: existingAccountId, amount: 200000, type: 'deposit' }),
      createTransaction({ accountId: existingAccountId, amount: 99000, type: 'withdraw' }),
      createTransaction({ accountId: existingAccountId, amount: 500, type: 'withdraw' }),
      updateBalance(existingAccountId, 100500), // update balance based on above transactions
    ])
      .then(() => console.log('Transactions created'))
      .catch(() => console.log('Transaction creation fails'));

    await request(api)
      .patch(`/account/${existingAccountId}/balance`)
      .send({
        type: 'withdraw',
        amount: 500,
      })
      .expect(200)
      .then((response) => {
        const { currentBalance, transactionId } = response.body;
        expect(currentBalance).toEqual(100000);
        expect(transactionId).toBeTruthy();

        getTransactionById(transactionId)
          .then((transaction) => {
            expect(transaction.id).toEqual(transactionId);
            expect(transaction.amount).toEqual(500);
            expect(transaction.accountId).toEqual(existingAccountId);
            expect(transaction.type).toEqual('withdraw');
          });
      });
  });

  it('should return 400 for a withdrawal of 501 since the daily limit is 100,000 and was withheld today 99,500', async () => {
    await Promise.all([
      createTransaction({ accountId: existingAccountId, amount: 200000, type: 'deposit' }),
      createTransaction({ accountId: existingAccountId, amount: 99000, type: 'withdraw' }),
      createTransaction({ accountId: existingAccountId, amount: 500, type: 'withdraw' }),
      updateBalance(existingAccountId, 100500), // update balance based on above transactions
    ])
      .then(() => console.log('Transactions created'))
      .catch(() => console.log('Transaction creation fails'));

    await request(api)
      .patch(`/account/${existingAccountId}/balance`)
      .send({
        type: 'withdraw',
        amount: 501,
      })
      .expect(400);
  });
  it.todo('should return 400 when the withdrawal is greater than the daily limit');
  it.todo('must return 400 when the withdrawal is greater than the balance');
  it.todo('should return 412 if the amount is not a positive number.');
  it.todo('should create a transaction in the database when the withdrawal is successful');
});
