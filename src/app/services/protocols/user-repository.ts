import { User } from '../../models/user';

export interface UserRepository {
  add(user: User): Promise<User>;
  getById(id: string): Promise<User|null>;
  getByCpf(cpf: string): Promise<User|null>;
}
