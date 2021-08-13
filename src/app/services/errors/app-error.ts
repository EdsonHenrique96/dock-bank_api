export enum ErrorType {
  AccountNotFoundError = 'AccountNotFoundError',
  AccountWithoutBalance = 'AccountWithoutBalance',
  ExceededTheDailyLimit = 'ExceededTheDailyLimit',
  UserAlreadExistsError = 'UserAlreadExistsError',
  UserNotFoundError = 'UserNotFoundError',
}
interface AppErrorInterface {
  message: string,
  type: ErrorType
}

export class AppError extends Error {
  public readonly type: ErrorType;

  constructor({ message, type }: AppErrorInterface) {
    super(message);
    this.type = type;
  }
}
