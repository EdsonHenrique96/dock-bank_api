import { v4 as uuidV4 } from 'uuid';
import { MysqlClient } from '../modules/mysql-client';

import { TransactionRepository } from '../../services/protocols';
import { Transaction, TransactionType } from '../../models/transaction';

export class DbTransactionRepository implements TransactionRepository {
  private readonly mysqlClient: MysqlClient;

  private readonly TABLE_NAME = 'user';

  constructor(mysqlClient: MysqlClient) {
    this.mysqlClient = mysqlClient;
  }

  async getToday(accountId: string): Promise<Transaction[]> {
    const sqlQuery = `
      SELECT * FROM transaction
      WHERE accountId=? AND date(createdAt) = CURDATE()
    `;

    const savedUser = await this
      .mysqlClient
      .runQuery<Transaction[]>({
        sqlQuery,
        placeholderValues: [accountId],
      });

    return savedUser;
  }

  async create(accountId: string, amount: number, type: TransactionType): Promise<string> {
    const id = uuidV4();
    const sqlQuery = `
      INSERT INTO transaction (id, accountId, amount, type)
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
