import { MysqlClient } from '../modules/mysql-client';

import { UserRepository } from '../../services/protocols';
import { User } from '../../models/user';

export class DbUserRepository implements UserRepository {
  private readonly mysqlClient: MysqlClient;

  private readonly TABLE_NAME = 'user';

  constructor(mysqlClient: MysqlClient) {
    this.mysqlClient = mysqlClient;
  }

  async save(user: User): Promise<User> {
    const sqlQuery = `INSERT INTO ${this.TABLE_NAME} (id, name, cpf, birthDate) VALUES (?, ?, ?, ?)`;

    const {
      id,
      name,
      cpf,
      birthDate,
    } = user;

    const savedUser = await this
      .mysqlClient
      .runQuery<User>({
        sqlQuery,
        placeholderValues: [
          id,
          name,
          cpf,
          birthDate.toUTCString(),
        ],
      });

    return savedUser;
  }

  async getById(id: string): Promise<User|undefined> {
    const sqlQuery = `SELECT * FROM ${this.TABLE_NAME} WHERE id=? LIMIT 1`;

    const [user] = await this
      .mysqlClient
      .runQuery<User[]>({
        sqlQuery,
        placeholderValues: [id],
      });

    return user;
  }

  async getByCpf(cpf: string): Promise<User|undefined> {
    const sqlQuery = `SELECT * FROM ${this.TABLE_NAME} WHERE cpf=?`;

    const [user] = await this
      .mysqlClient
      .runQuery<User[]>({
        sqlQuery,
        placeholderValues: [cpf],
      });

    return user;
  }
}
