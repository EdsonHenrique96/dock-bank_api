import { v4 as uuidV4 } from 'uuid';

type AccountType = 'savings' | 'checking' | 'business';

export class Account {
  public readonly id: string;

  public readonly ownerId: string;

  public balance: number;

  public dailyWithdrawalLimit: number;

  public isActive: boolean;

  public accountType: AccountType;

  constructor({ id, ownerId, accountType }
    : { id?: string, ownerId: string, accountType: AccountType }) {
    this.id = id || uuidV4();
    this.ownerId = ownerId;
    this.balance = 0;
    this.dailyWithdrawalLimit = 100000; // FIXME
    this.isActive = true;
    this.accountType = accountType;
  }
}
