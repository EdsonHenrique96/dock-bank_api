export class UserNotFoundError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'UserNotFoundError';
  }
}
