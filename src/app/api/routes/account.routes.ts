import { Request, Response, Router } from 'express';
import { mysqlClient } from '../../infra/modules/mysql-client';

import { DbAccountRepository } from '../../infra/repositories/account-repository';
import { DbUserRepository } from '../../infra/repositories/user-repository';

import { CreateAccountService } from '../../services/create-account-service';
import { AccountDepositService } from '../../services/account-deposit-service';

import { AppError } from '../../services/errors/app-error';
import { DbTransactionRepository } from '../../infra/repositories/transaction-repository';

enum HttpErrors {
  AccountNotFoundError = 422,
  AccountWithoutBalance = 400,
  UserAlreadExistsError = 422,
  UserNotFoundError = 422,
}

const accountRoutes = Router();

const accounRepository = new DbAccountRepository(mysqlClient);
const userRepository = new DbUserRepository(mysqlClient);
const transactionRepository = new DbTransactionRepository(mysqlClient);

accountRoutes.post('/account', async (req: Request, res: Response) => {
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

accountRoutes.patch('/account/:accountId/balance', async (req: Request, res: Response) => {
  try {
    const { accountId } = req.params;
    const { amount } = req.body;

    const accountDepositService = new AccountDepositService(
      accounRepository,
      transactionRepository,
    );

    const depositTransaction = await accountDepositService.deposit(accountId, amount);

    return res.json(depositTransaction);
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
