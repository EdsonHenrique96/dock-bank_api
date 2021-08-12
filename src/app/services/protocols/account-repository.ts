import { Account } from '../../models/account';

export interface AccountRepository {
  save(account: Account): Promise<boolean>;
  getByOwner(ownerId: string): Promise<Account>;
  getByid(id: string): Promise<Account>;
  update(account: Account): Promise<boolean>;
}
