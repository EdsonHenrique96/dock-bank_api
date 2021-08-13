import { Account } from '../../models/account';

export interface AccountRepository {
  save(account: Account): Promise<boolean>;
  getByOwner(ownerId: string): Promise<Account|undefined>;
  getByid(id: string): Promise<Account|undefined>;
  update(account: Account): Promise<boolean>;
}
