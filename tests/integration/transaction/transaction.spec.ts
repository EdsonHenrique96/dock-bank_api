import { Express } from 'express';
import { v4 as uuidV4 } from 'uuid';
import { agent as request } from 'supertest';

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
const accountId = uuidV4();
const nonExistentAccountId = uuidV4();
const populateDb = async (): Promise<void> => {
  await mysqlClient.runQuery({
    sqlQuery: 'INSERT INTO user (id, name, cpf, birthDate) VALUES (?, ?, ?, ?)',
    placeholderValues: [jeffBezosId, 'Jeff Bezos', '99911188800', '1964-12-01'],
  });

  await mysqlClient.runQuery({
    sqlQuery: 'INSERT INTO account (id, userId, balance, dailyWithdrawalLimit, isActive, accountType) VALUES (?, ?, ?, ?, ?, ?)',
    placeholderValues: [accountId, jeffBezosId, 0, 100000, true, AccountType.checking],
  });
};

describe('Transaction', () => {
  let api: Express;

  beforeAll(async () => {
    api = await setupApi();
    await populateDb();
  });

  afterAll(async () => {
    await cleanDB();
    await mysqlClient.closePoolConnections();
  });

  it('should return 200 and a list of transactions', async () => {
    await request(api)
      .get(`/account/${accountId}/transaction`)
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
