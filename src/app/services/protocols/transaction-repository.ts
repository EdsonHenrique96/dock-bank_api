import { Transaction, TransactionType } from '../../models/transaction';

export interface TransactionRepository {
  getByAccount(accountId: string): Promise<Transaction[]>;
  getToday(accountId: string): Promise<Transaction[]>;
  create(accountId: string, amount: number, type: TransactionType): Promise<string>;
}
