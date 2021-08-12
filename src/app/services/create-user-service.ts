import { v4 as uuidv4 } from 'uuid';

import { AppError, ErrorType } from './errors/app-error';

import { User } from '../models/user';

import { UserRepository } from './protocols';

interface UserDTO {
  name: string;
  cpf: string;
  birthDate: Date;
}

export class CreateUserService {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async create(user: UserDTO): Promise<User> {
    const existingUser = await this
      .userRepository
      .getByCpf(user.cpf);

    if (existingUser) {
      throw new AppError({
        message: 'User already exists.',
        type: ErrorType.UserAlreadExistsError,
      });
    }

    const newUser = new User({ id: uuidv4(), ...user });

    const createdUser = await this
      .userRepository
      .save(newUser);

    return createdUser;
  }
}
