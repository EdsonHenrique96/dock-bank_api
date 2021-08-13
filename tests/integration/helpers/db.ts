import { v4 as uuidV4 } from 'uuid';

import { mysqlClient } from '../../../src/app/infra/modules/mysql-client';
import { Account, AccountType } from '../../../src/app/models/account';
import { Transaction, TransactionType } from '../../../src/app/models/transaction';

export const cleanTransactions = async (): Promise<void> => {
  await mysqlClient.runQuery({
    sqlQuery: 'DELETE FROM transaction',
  });
};

export const cleanDB = async (): Promise<void> => {
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

export const existingUserId = uuidV4();
export const nonExistentUserId = uuidV4();
export const existingAccountId = uuidV4();
export const nonExistentAccountId = uuidV4();

export const createUser = async (): Promise<void> => {
  await mysqlClient.runQuery({
    sqlQuery: 'INSERT INTO user (id, name, cpf, birthDate) VALUES (?, ?, ?, ?)',
    placeholderValues: [existingUserId, 'Jeff Bezos', '99911188800', '1964-12-01'],
  });
};

export const createAccount = async () : Promise<void> => {
  await mysqlClient.runQuery({
    sqlQuery: 'INSERT INTO account (id, userId, balance, dailyWithdrawalLimit, isActive, accountType) VALUES (?, ?, ?, ?, ?, ?)',
    placeholderValues: [existingAccountId, existingUserId, 0, 100000, true, AccountType.checking],
  });
};

export const getTransactionById = async (id: string) : Promise<Transaction> => {
  const [transaction] = await mysqlClient.runQuery<Transaction[]>({
    sqlQuery: 'SELECT * FROM transaction WHERE id=? LIMIT 1',
    placeholderValues: [id],
  });

  return transaction;
};

export const getTransactionByAccountId = async (id: string) : Promise<Transaction[]> => {
  const transaction = await mysqlClient.runQuery<Transaction[]>({
    sqlQuery: 'SELECT * FROM transaction WHERE accountId=?',
    placeholderValues: [id],
  });

  return transaction;
};

export const getAccountById = async (id: string) : Promise<Account> => {
  const [account] = await mysqlClient.runQuery<Account[]>({
    sqlQuery: 'SELECT * FROM account WHERE id=? LIMIT 1',
    placeholderValues: [id],
  });

  return account;
};

export const updateBalance = async (accountId: string, balance: number) : Promise<Account> => {
  const [account] = await mysqlClient.runQuery<Account[]>({
    sqlQuery: 'UPDATE account SET balance=? WHERE id=?',
    placeholderValues: [balance, accountId],
  });

  return account;
};

export const createTransaction = async ({
  accountId,
  type,
  amount,
}: {
  accountId: string,
  type: TransactionType,
  amount: number
}) : Promise<boolean> => {
  const result :{ affectedRows: number } = await mysqlClient.runQuery({
    sqlQuery: 'INSERT INTO transaction (id, accountId, amount, type) VALUES (?, ?, ?, ?)',
    placeholderValues: [uuidV4(), accountId, amount, type],
  });

  return result.affectedRows === 1;
};

export const closeConnection = async (): Promise<void> => {
  await mysqlClient.closePoolConnections();
};
