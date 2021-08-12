/**
 * @see: https://www.npmjs.com/package/mysql
 */
import * as mysql from 'mysql';

type MysqlError = {
  message: string;
  executedSqlQuery?: string;
  isFatal: boolean;
  mysqlServerErrorMessage?: string;
};

const buildMysqlError = (error: mysql.MysqlError): MysqlError => ({
  message: error.message,
  executedSqlQuery: error.sql,
  isFatal: error.fatal,
  mysqlServerErrorMessage: error.sqlMessage,
});

class MysqlClient {
  host?: string;

  database?: string;

  user?: string;

  maxNumOfConnections?: number;

  connectTimeoutInMs?: number;

  defaultQueryTimeoutInMs?: number;

  private driver?: mysql.Pool;

  setupConnectionsPool({
    host,
    database,
    user,
    password,
    maxNumOfConnections,
    connectTimeoutInMs,
    defaultQueryTimeoutInMs,
  }: {
    host: string;
    database?: string;
    user: string;
    password: string;
    maxNumOfConnections: number;
    connectTimeoutInMs: number;
    defaultQueryTimeoutInMs: number;
  }): Promise<void> {
    if (this.driver) {
      console.warn('Connections pool already set up!');
      return Promise.resolve();
    }

    console.info('Setting up a connections pool..');

    this.host = host;
    this.database = database;
    this.user = user;
    this.maxNumOfConnections = maxNumOfConnections;
    this.connectTimeoutInMs = connectTimeoutInMs;
    this.defaultQueryTimeoutInMs = defaultQueryTimeoutInMs;

    // Connections are lazily created by the pool
    let connectionPool: mysql.Pool;

    try {
      connectionPool = mysql.createPool({
        host,
        database,
        user,
        password,

        connectionLimit: maxNumOfConnections,
        connectTimeout: connectTimeoutInMs,
        acquireTimeout: connectTimeoutInMs,

        supportBigNumbers: true,
        dateStrings: true,
      });
    } catch (error) {
      error.message = `Failure creating connection pool: ${error.message}`;
      return Promise.reject(error);
    }

    connectionPool.on('enqueue', () => {
      console.info('Waiting for available connection slot..');
    });

    /**
     * @see: https://www.npmjs.com/package/mysql#error-handling
     */
    connectionPool.on('error', (error: mysql.MysqlError) => {
      const customErr = buildMysqlError(error);
      customErr.message = `Error on a non-pending callback: ${error.message}`;
      console.error(customErr);
    });

    this.driver = connectionPool;

    // Perform a test query
    return this.runQuery({
      sqlQuery: 'SELECT 1',
    });
  }

  runQuery<T>({
    sqlQuery,
    placeholderValues = [],
    timeoutInMs = this.defaultQueryTimeoutInMs,
  }: {
    sqlQuery: string;
    timeoutInMs?: number;
    placeholderValues?: Array<string | number | boolean>;
  }): Promise<T> {
    const promise = new Promise<T>((resolve, reject) => {
      if (!this.driver) {
        reject(
          new Error('MysqlClient not started: call method setupConnectionsPool'),
        );

        return;
      }

      this.driver.query({
        sql: sqlQuery,
        values: placeholderValues,
        timeout: timeoutInMs,
      }, (error: mysql.MysqlError | null, results: T) => {
        if (error) {
          reject(
            buildMysqlError(error),
          );

          return;
        }

        resolve(results);
      });
    });

    return promise;
  }

  closePoolConnections(): Promise<void> {
    console.info('Closing connections pool..');

    const promise = new Promise<void>((resolve, reject) => {
      if (!this.driver) {
        console.warn('Cannot close connections: no connection pool set up');

        resolve();
        return;
      }

      this.driver.end((error: mysql.MysqlError | null) => {
        if (error) {
          reject(
            buildMysqlError(error),
          );

          return;
        }

        resolve();
      });

      delete this.driver;
    });

    return promise;
  }
}

// Exports a singleton
const mysqlClient = new MysqlClient();

export {
  /**
   * This is a singleton.
   * Just import it and use its methods.
   *
   * 1. Ensure method "setupConnectionsPool" was called once to initialize to connection pool
   * 2. Once set up, just call "runQuery" to execute your SQL queries
   * 3. You may use "closePoolConnections" to gracefully shutdown your connection pool
   */
  mysqlClient,

  /**
   * Specialized error emitted by this service methods.
   */
  MysqlError,

  /**
   * mysqlClient's class, for typing
   */
  MysqlClient,

};
