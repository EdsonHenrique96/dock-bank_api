import {
  NextFunction,
  Request,
  Response,
  Router,
} from 'express';
import { mysqlClient } from '../../infra/modules/mysql-client';
import { DbUserRepository } from '../../infra/repositories/user-repository';
import { CreateUserService } from '../../services/create-user-service';

const userRoutes = Router();

const userRepository = new DbUserRepository(mysqlClient);

userRoutes.post('/user', async (req: Request, res: Response, next: NextFunction) => {
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
    return next();
  }
});

export default userRoutes;
