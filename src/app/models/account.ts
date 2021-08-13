import { v4 as uuidV4 } from 'uuid';

export enum AccountType {
  savings = 'savings',
  checking = 'checking',
  business = 'business'
}

export class Account {
  public readonly id: string;

  public readonly userId: string;

  public balance: number;

  public dailyWithdrawalLimit: number;

  public isActive: boolean;

  public accountType: AccountType;

  constructor({ id, userId, accountType }
    : { id?: string, userId: string, accountType: AccountType }) {
    this.id = id || uuidV4();
    this.userId = userId;
    this.balance = 0;
    this.dailyWithdrawalLimit = 100000; // FIXME
    this.isActive = true;
    this.accountType = accountType;
  }
}
