import { mysqlClient } from '../../infra/modules/mysql-client';

export const initSchema = (): Promise<void> => mysqlClient.runQuery({
  sqlQuery: `
    CREATE TABLE IF NOT EXISTS user (
      id VARCHAR(36) NOT NULL,
      name VARCHAR(250) NOT NULL,
      cpf VARCHAR(11) NOT NULL,
      birthDate DATE NOT NULL,
      createdAt TIMESTAMP(6) NOT NULL DEFAULT NOW(6),
      PRIMARY KEY (id)
    );
  `,
}).then(() => mysqlClient.runQuery({
  sqlQuery: `
    CREATE TABLE IF NOT EXISTS account (
      id VARCHAR(36) NOT NULL,
      userId VARCHAR(36) NOT NULL,
      balance DECIMAL(10,2) NOT NULL,
      dailyWithdrawalLimit DECIMAL(10,2),
      isActive BOOLEAN NOT NULL DEFAULT TRUE,
      accountType VARCHAR(100) NOT NULL,
      createdAt TIMESTAMP(6) NOT NULL DEFAULT NOW(6),
      PRIMARY KEY (id),
      FOREIGN KEY (userId) REFERENCES user(id)
    );
  `,
})).then(() => mysqlClient.runQuery({
  sqlQuery: `
    CREATE TABLE IF NOT EXISTS transaction (
      id VARCHAR(36) NOT NULL,
      accountId VARCHAR(36) NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      type VARCHAR(36) NOT NULL,
      createdAt TIMESTAMP(6) NOT NULL DEFAULT NOW(6),
      PRIMARY KEY (id),
      FOREIGN KEY (accountId) REFERENCES account(id)
    );
  `,
}));

// FIXME - PUT DB CONFIGS IN ENS
export const setupDb = async (): Promise<void> => {
  try {
    await mysqlClient.setupConnectionsPool({
      connectTimeoutInMs: 9000,
      defaultQueryTimeoutInMs: 4000,
      host: 'mysql-local',
      maxNumOfConnections: 3,
      password: 'fake',
      user: 'fake',
      database: 'dock-bank',
    });
  } catch (e) {
    console.error(`Closing db connections: ${e.message}`);
    await mysqlClient.closePoolConnections();
    throw e;
  }
};
