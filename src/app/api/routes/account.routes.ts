import {
  NextFunction,
  Request,
  Response,
  Router,
} from 'express';
import { mysqlClient } from '../../infra/modules/mysql-client';

import { DbAccountRepository } from '../../infra/repositories/account-repository';
import { DbUserRepository } from '../../infra/repositories/user-repository';

import { CreateAccountService } from '../../services/create-account-service';
import { AccountDepositService } from '../../services/account-deposit-service';

import { DbTransactionRepository } from '../../infra/repositories/transaction-repository';
import { AccountWithdrawService } from '../../services/account-withdraw-service';
import { GetBalanceAccountService } from '../../services/get-balance-account-service';
import { DisableAccountService } from '../../services/disable-account-service';
import { GetTransactionService } from '../../services/get-transaction-service';

const accountRoutes = Router();

const accounRepository = new DbAccountRepository(mysqlClient);
const userRepository = new DbUserRepository(mysqlClient);
const transactionRepository = new DbTransactionRepository(mysqlClient);

accountRoutes.post('/account', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accountDate = req.body;

    const createAccountService = new CreateAccountService(
      accounRepository,
      userRepository,
    );

    const accountCreated = await createAccountService.create(
      {
        userId: accountDate.userId,
        accountType: accountDate.accountType,
      },
    );

    return res.status(201).json(accountCreated);
  } catch (error) {
    return next(error);
  }
});

accountRoutes.patch('/account/:accountId/balance', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accountId } = req.params;
    const { amount, type } = req.body;

    if (type === 'deposit') {
      const accountDepositService = new AccountDepositService(
        accounRepository,
        transactionRepository,
      );
      const depositTransaction = await accountDepositService.deposit(accountId, amount);

      return res.json(depositTransaction);
    }

    if (type === 'withdraw') {
      const accountDepositService = new AccountWithdrawService(
        accounRepository,
        transactionRepository,
      );
      const withdrawTransaction = await accountDepositService.withdraw(accountId, amount);
      return res.json(withdrawTransaction);
    }

    return res.status(400).json({ message: 'Operation not allowed' });
  } catch (error) {
    return next(error);
  }
});

accountRoutes.get('/account/:accountId/balance', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accountId } = req.params;

    const getBalanceAccountService = new GetBalanceAccountService(accounRepository);

    const balance = await getBalanceAccountService
      .getBalance(accountId);

    return res.json({ balance });
  } catch (error) {
    return next(error);
  }
});

accountRoutes.patch('/account/:accountId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accountId } = req.params;

    const disableAccountService = new DisableAccountService(accounRepository);

    const isDisable = await disableAccountService
      .disable(accountId);

    return res.json({ accountId, isActive: !isDisable });
  } catch (error) {
    return next(error);
  }
});

accountRoutes.get('/account/:accountId/transaction', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accountId } = req.params;

    const getTransactionService = new GetTransactionService(
      accounRepository,
      transactionRepository,
    );

    const transactions = await getTransactionService
      .get(accountId);

    return res.json(transactions);
  } catch (error) {
    return next(error);
  }
});

export default accountRoutes;
