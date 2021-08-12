import { v4 as uuidV4 } from 'uuid';
import { MysqlClient } from '../modules/mysql-client';

import { TransactionRepository } from '../../services/protocols';
import { Transaction, TransactionType } from '../../models/transaction';

export class DbTransactionRepository implements TransactionRepository {
  private readonly mysqlClient: MysqlClient;

  private readonly TABLE_NAME = 'transaction';

  constructor(mysqlClient: MysqlClient) {
    this.mysqlClient = mysqlClient;
  }

  async getByAccount(accountId: string): Promise<Transaction[]> {
    const sqlQuery = `
      SELECT * FROM ${this.TABLE_NAME}
      WHERE accountId=?
    `;

    const transactions = await this
      .mysqlClient
      .runQuery<Transaction[]>({
        sqlQuery,
        placeholderValues: [accountId],
      });

    return transactions;
  }

  async getToday(accountId: string): Promise<Transaction[]> {
    const sqlQuery = `
      SELECT * FROM ${this.TABLE_NAME}
      WHERE accountId=? AND date(createdAt) = CURDATE()
    `;

    const transactions = await this
      .mysqlClient
      .runQuery<Transaction[]>({
        sqlQuery,
        placeholderValues: [accountId],
      });

    return transactions;
  }

  async create(accountId: string, amount: number, type: TransactionType): Promise<string> {
    const id = uuidV4();
    const sqlQuery = `
      INSERT INTO ${this.TABLE_NAME} (id, accountId, amount, type)
      VALUES (?, ?, ?, ?)
    `;

    const result :{ affectedRows: number } = await this
      .mysqlClient
      .runQuery({
        sqlQuery,
        placeholderValues: [id, accountId, amount, type],
      });

    return result.affectedRows === 1 ? id : '';
  }
}
