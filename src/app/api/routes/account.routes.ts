import { Request, Response, Router } from 'express';
import { mysqlClient } from '../../infra/modules/mysql-client';

import { DbAccountRepository } from '../../infra/repositories/account-repository';
import { DbUserRepository } from '../../infra/repositories/user-repository';

import { CreateAccountService } from '../../services/create-account-service';

import { AppError } from '../../services/errors/app-error';

enum HttpErrors {
  AccountNotFoundError = 422,
  AccountWithoutBalance = 400,
  UserAlreadExistsError = 422,
  UserNotFoundError = 422,
}

const accountRoutes = Router();

accountRoutes.post('/account', async (req: Request, res: Response) => {
  const accounRepository = new DbAccountRepository(mysqlClient);
  const userRepository = new DbUserRepository(mysqlClient);

  try {
    const accountDate = req.body;

    const createAccountService = new CreateAccountService(
      accounRepository,
      userRepository,
    );

    const accountCreated = await createAccountService.create(
      {
        ownerId: accountDate.ownerId,
        accountType: accountDate.accountType,
      },
    );

    return res.status(201).json(accountCreated);
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

export default accountRoutes;
