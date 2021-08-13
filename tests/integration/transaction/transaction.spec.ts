import { Express } from 'express';
import { agent as request } from 'supertest';

import { setupApi } from '../../../src/app/api/index';

import {
  cleanDB,
  createUser,
  createAccount,
  exitingAccountId,
  nonExistentAccountId,
  closeConnection,
} from '../helpers/db';

const populateDb = async (): Promise<void> => {
  await createUser();

  await createAccount();
};

describe('Transaction', () => {
  let api: Express;

  beforeAll(async () => {
    api = await setupApi();
    await populateDb();
  });

  afterAll(async () => {
    await cleanDB();
    await closeConnection();
  });

  it('should return 200 and a list of transactions', async () => {
    await request(api)
      .get(`/account/${exitingAccountId}/transaction`)
      .send()
      .expect(200);
  });

  it('should return 422 when account does not exist', async () => {
    await request(api)
      .get(`/account/${nonExistentAccountId}/transaction`)
      .send()
      .expect(422);
  });

  it.todo('should return 200 and an empty transaction list when there is no transaction');
});
