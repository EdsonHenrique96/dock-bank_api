import { NextFunction, Request, Response } from 'express';

import { AppError } from '../../services/errors/app-error';

enum HttpErrors {
  AccountNotFoundError = 422,
  AccountWithoutBalance = 400,
  ExceededTheDailyLimit = 400,
  UserAlreadExistsError = 422,
  UserNotFoundError = 422,
}

export default (
  error: AppError,
  req: Request,
  res: Response,
  _: NextFunction,
): Response => {
  console.error({ message: error.message });

  if (error.type) {
    return res
      .status(HttpErrors[error.type])
      .json({ message: error.message });
  }

  return res
    .status(500)
    .json({ message: error.message });
};
