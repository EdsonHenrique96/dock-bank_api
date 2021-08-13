import { Express } from 'express';
import { agent as request } from 'supertest';

import { setupApi } from '../../../src/app/api/index';

import { AccountType } from '../../../src/app/models/account';

import {
  cleanDB,
  closeConnection,
  createUser,
  existingUserId,
  nonExistentUserId,
} from '../helpers/db';

const populateDb = async (): Promise<void> => {
  await createUser();
};

describe('Create account', () => {
  let api: Express;

  beforeAll(async () => {
    api = await setupApi();
    await populateDb();
  });

  afterAll(async () => {
    await cleanDB();
    await closeConnection();
  });

  it('should return 422 when the user does not exist', async () => {
    await request(api)
      .post('/account')
      .send({
        userId: nonExistentUserId,
        typeAccount: '',
      })
      .expect(422, {
        message: 'User is mandatory.',
      });
  });

  it('should return 201 when an account is successfully created ', async () => {
    await request(api)
      .post('/account')
      .send({
        userId: existingUserId,
        accountType: AccountType.checking,
      })
      .expect(201)
      .then((response) => {
        const {
          id,
          userId,
          balance,
          isActive,
        } = response.body;

        expect(id).toBeTruthy();
        expect(userId).toEqual(existingUserId);
        expect(balance).toEqual(0);
        expect(isActive).toBe(true);
      });
  });

  it.todo('should return 200 when an account already exists');
  it.todo('should return 412 when account type is invalid');
  it.todo('should return 412 when account owner id is not passed');
  it.todo('should return 412 when account owner id is not a uuid');
  it.todo('should return 412 when account type is not passed');
});
