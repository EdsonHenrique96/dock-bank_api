export class User {
  public id: string;

  public name: string;

  public cpf: string;

  public birthDate: Date;

  constructor(
    {
      id, name, cpf, birthDate,
    }
    : { id: string, name: string, cpf: string, birthDate: Date },
  ) {
    this.id = id;
    this.name = name;
    this.cpf = cpf;
    this.birthDate = birthDate;
  }
}
