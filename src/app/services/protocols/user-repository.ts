import { User } from '../../models/user';

export interface UserRepository {
  save(user: User): Promise<User>;
  getById(id: string): Promise<User|undefined>;
  getByCpf(cpf: string): Promise<User|undefined>;
}
