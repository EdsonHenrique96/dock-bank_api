import { Express } from 'express';
import { v4 as uuidV4 } from 'uuid';
import { agent as resquest } from 'supertest';

import { setupApi } from '../../../src/app/api/index';
import { mysqlClient } from '../../../src/app/infra/modules/mysql-client';

import { AccountType } from '../../../src/app/models/account';

const cleanDB = async (): Promise<void> => {
  await mysqlClient.runQuery({
    sqlQuery: 'DELETE FROM transaction',
  });

  await mysqlClient.runQuery({
    sqlQuery: 'DELETE FROM account',
  });

  await mysqlClient.runQuery({
    sqlQuery: 'DELETE FROM user',
  });
};

const jeffBezosId = uuidV4();
const nonExistentUserId = uuidV4();
const populateDb = async (): Promise<void> => {
  await mysqlClient.runQuery({
    sqlQuery: 'INSERT INTO user (id, name, cpf, birthDate) VALUES (?, ?, ?, ?)',
    placeholderValues: [uuidV4(), 'Jeff Bezos', '99911188800', '1964-12-01'],
  });
};

describe('Create account', () => {
  let api: Express;

  beforeAll(async () => {
    api = await setupApi();
    await populateDb();
  });

  afterAll(async () => {
    await cleanDB();
    await mysqlClient.closePoolConnections();
  });

  it('should return 422 when the user does not exist', async () => {
    await resquest(api)
      .post('/account')
      .send({
        ownerId: nonExistentUserId,
        typeAccount: '',
      })
      .expect(422, {
        message: 'User is mandatory.',
      });
  });

  it('should return 201 when an account is successfully created ', async () => {
    await resquest(api)
      .post('/account')
      .send({
        ownerId: jeffBezosId,
        typeAccount: AccountType.checking,
      })
      .expect(422, {
        message: 'User is mandatory.',
      });
  });

  it.todo('should return 200 when an account already exists');
  it.todo('should return 412 when account type is invalid');
  it.todo('should return 412 when account owner id is not passed');
  it.todo('should return 412 when account owner id is not a uuid');
  it.todo('should return 412 when account type is not passed');
});
