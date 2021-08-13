import { Express } from 'express';
import { agent as request } from 'supertest';

import { setupApi } from '../../../src/app/api/index';

import {
  cleanDB,
  closeConnection,
  createAccount,
  createUser,
  exitingAccountId,
  nonExistentAccountId,
  getTransactionById,
  getAccountById,
} from '../helpers/db';

const populateDb = async (): Promise<void> => {
  await createUser();
  await createAccount();
};

describe('Deposit', () => {
  let api: Express;

  beforeAll(async () => {
    api = await setupApi();
    await populateDb();
  });

  /**
   * this should be done to avoid side effects with future testing.
   */
  // beforeEach(async () => {
  //   reset balance
  //   delete transactions
  // });

  afterAll(async () => {
    await cleanDB();
    await closeConnection();
  });
  it('should return 200, create transaction correctly and update balance when the deposit is successful.', async () => {
    await request(api)
      .patch(`/account/${exitingAccountId}/balance`)
      .send({
        type: 'deposit',
        amount: 100,
      })
      .expect(200)
      .expect((response) => {
        const { currentBalance, transactionId } = response.body;
        expect(currentBalance).toEqual(100);
        expect(transactionId).toBeTruthy();

        getTransactionById(transactionId)
          .then((transaction) => {
            expect(transaction.id).toEqual(transactionId);
            expect(transaction.amount).toEqual(100);
            expect(transaction.accountId).toEqual(exitingAccountId);
            expect(transaction.type).toEqual('deposit');
          });

        getAccountById(exitingAccountId)
          .then((account) => {
            expect(account.id).toBeTruthy();
            expect(account.balance).toEqual(100);
          });
      });
  });
  it('should return 422 when account does not exist', async () => {
    await request(api)
      .patch(`/account/${nonExistentAccountId}/balance`)
      .send({
        type: 'deposit',
        amount: 100,
      })
      .expect(422, {
        message: 'Account not found.',
      });
  });
  it.todo('should return 412 when the amount to be deposited is equal to or less than 0');
  it.todo('should not save a transaction to the database when deposit fails');
});
