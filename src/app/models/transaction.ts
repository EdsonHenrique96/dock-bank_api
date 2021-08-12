export type TransactionType = 'deposit' | 'withdraw';

export class Transaction {
  public readonly id: string;

  public readonly accountId: string;

  public amount: number;

  public type: TransactionType;

  public createdAt: Date;

  constructor({
    id,
    accountId,
    amount,
    type,
    createdAt,
  }
  : {
    id: string,
    accountId: string,
    amount: number,
    type: TransactionType,
    createdAt: Date,
  }) {
    this.id = id;
    this.accountId = accountId;
    this.amount = amount;
    this.type = type;
    this.createdAt = createdAt;
  }
}
