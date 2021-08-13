import { Account } from '../../models/account';

export interface AccountRepository {
  save(account: Account): Promise<boolean>;
  getByOwner(userId: string): Promise<Account|undefined>;
  getByid(id: string): Promise<Account|undefined>;
  update(account: Account): Promise<boolean>;
}
