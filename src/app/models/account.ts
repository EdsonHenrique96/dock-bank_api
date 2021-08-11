type AccountType = 'savings' | 'checking' | 'business';

export class Account {
  public readonly id: string;

  public readonly ownerId: string;

  public balance: number;

  public dailyWithdrawlLimit: number;

  public isActive: boolean;

  public accountType: AccountType;

  constructor({ id, ownerId, accountType }
    : { id: string, ownerId: string, accountType: AccountType }) {
    this.id = id;
    this.ownerId = ownerId;
    this.balance = 0;
    this.dailyWithdrawlLimit = 0;
    this.isActive = true;
    this.accountType = accountType;
  }
}
