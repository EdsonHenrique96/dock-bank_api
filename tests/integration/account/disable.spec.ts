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

describe('Disable', () => {
  let api: Express;

  beforeAll(async () => {
    api = await setupApi();
    await populateDb();
  });

  afterAll(async () => {
    await cleanDB();
    await closeConnection();
  });
  it('should return 200 and isActive = false when an account is successfully disabled', async () => {
    await request(api)
      .patch(`/account/${exitingAccountId}`)
      .send()
      .expect(200)
      .then((response) => {
        const { accountId, isActive } = response.body;
        expect(accountId).toBeTruthy();
        expect(isActive).toBe(false);
      });
  });
  it('should return 422 when account does not exist', async () => {
    await request(api)
      .patch(`/account/${nonExistentAccountId}`)
      .send()
      .expect(422, {
        message: 'Account not found.',
      });
  });
});
