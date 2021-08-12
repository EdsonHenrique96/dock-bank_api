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

export class AppError {
  public readonly type: ErrorType;

  public readonly message: string;

  constructor({ message, type }: AppErrorInterface) {
    this.message = message;
    this.type = type;
  }
}
