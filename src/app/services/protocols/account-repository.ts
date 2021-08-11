import { Account } from '../../models/account';

export interface AccountRepository {
  add(account: Account): Promise<Account>;
  getByOwner(ownerId: string): Promise<Account|null>;
}
