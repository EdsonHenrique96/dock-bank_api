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
} from '../helpers/db';

const populateDb = async (): Promise<void> => {
  await createUser();
  await createAccount();
};

describe('Balance', () => {
  let api: Express;

  beforeAll(async () => {
    api = await setupApi();
    await populateDb();
  });

  afterAll(async () => {
    await cleanDB();
    await closeConnection();
  });
  it('should return 200 and the balance', async () => {
    await request(api)
      .get(`/account/${exitingAccountId}/balance`)
      .send()
      .expect(200, {
        balance: 0,
      });
  });

  it('should return 422 when account does not exist', async () => {
    await request(api)
      .get(`/account/${nonExistentAccountId}/balance`)
      .send()
      .expect(422, {
        message: 'Account not found.',
      });
  });
});
