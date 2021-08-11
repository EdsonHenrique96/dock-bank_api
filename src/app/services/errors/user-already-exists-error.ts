export class UserAlreadExistsError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'UserAlreadExistsError';
  }
}
