import { Account } from '../../models/account';
import { AccountRepository } from '../../services/protocols/account-repository';
import { MysqlClient } from '../modules/mysql-client';

export class DbAccountRepository implements AccountRepository {
  private readonly mysqlClient: MysqlClient;

  private readonly TABLE_NAME = 'account';

  constructor(mysqlClient: MysqlClient) {
    this.mysqlClient = mysqlClient;
  }

  async save(account: Account): Promise<boolean> {
    const {
      id,
      userId,
      accountType,
      balance,
      dailyWithdrawalLimit,
      isActive,
    } = account;

    const sqlQuery = `
      INSERT INTO ${this.TABLE_NAME}
      (id, userId, balance, dailyWithdrawalLimit, isActive, accountType)
      VALUES (?, ?, ?, ?, ?, ?);
    `;

    const result :{ affectedRows: number } = await this
      .mysqlClient
      .runQuery({
        sqlQuery,
        placeholderValues: [
          id,
          userId,
          balance,
          dailyWithdrawalLimit,
          isActive,
          accountType,
        ],
      });

    return result.affectedRows === 1;
  }

  async getByOwner(userId: string): Promise<Account> {
    const sqlQuery = `SELECT * FROM ${this.TABLE_NAME} WHERE userId=?`;

    const [account] = await this
      .mysqlClient
      .runQuery<Account[]>({
        sqlQuery,
        placeholderValues: [userId],
      });

    return account;
  }

  async getByid(id: string): Promise<Account> {
    const sqlQuery = `
      SELECT * FROM ${this.TABLE_NAME}
      WHERE id=? LIMIT 1
    `;

    const [account] = await this
      .mysqlClient
      .runQuery<Account[]>({
        sqlQuery,
        placeholderValues: [id],
      });

    return account;
  }

  async update(account: Account): Promise<boolean> {
    const sqlQuery = `
      UPDATE ${this.TABLE_NAME}
      SET balance=?, dailyWithdrawalLimit=?, isActive=?, accountType=?
    `;

    const {
      balance,
      dailyWithdrawalLimit,
      isActive,
      accountType,
    } = account;

    const result :{ affectedRows: number } = await this
      .mysqlClient
      .runQuery({
        sqlQuery,
        placeholderValues: [balance, dailyWithdrawalLimit, isActive, accountType],
      });

    return result.affectedRows === 1;
  }
}
