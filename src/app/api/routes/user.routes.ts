import { Request, Response, Router } from 'express';
import { mysqlClient } from '../../infra/modules/mysql-client';
import { DbUserRepository } from '../../infra/repositories/user-repository';
import { CreateUserService } from '../../services/create-user-service';

import { AppError } from '../../services/errors/app-error';

enum HttpErrors {
  AccountNotFoundError = 422,
  AccountWithoutBalance = 400,
  UserAlreadExistsError = 422,
  UserNotFoundError = 422,
}

const userRoutes = Router();

const userRepository = new DbUserRepository(mysqlClient);

userRoutes.post('/user', async (req: Request, res: Response) => {
  try {
    const { name, cpf, birthDate } = req.body;

    const date = new Date(birthDate);

    const createUserService = new CreateUserService(userRepository);

    const user = await createUserService.create({
      name,
      cpf,
      birthDate: date,
    });

    return res.status(201).json(user);
  } catch (error) {
    console.error({ message: error.message });

    if (error instanceof AppError) {
      return res
        .status(HttpErrors[error.type])
        .json({ message: error.message });
    }

    return res
      .status(500)
      .json({ message: error.message });
  }
});

export default userRoutes;
