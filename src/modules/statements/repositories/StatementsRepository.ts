import { getRepository, Repository } from "typeorm";

import { Statement } from "../entities/Statement";
import { ICreateStatementDTO } from "../useCases/createStatement/ICreateStatementDTO";
import { IGetBalanceDTO } from "../useCases/getBalance/IGetBalanceDTO";
import { IGetStatementOperationDTO } from "../useCases/getStatementOperation/IGetStatementOperationDTO";
import { IStatementsRepository } from "./IStatementsRepository";

export class StatementsRepository implements IStatementsRepository {
  private repository: Repository<Statement>;

  constructor() {
    this.repository = getRepository(Statement);
  }

  async create({
    user_id,
    amount,
    description,
    type,
    sender_id
  }: ICreateStatementDTO): Promise<Statement> {
    const statement = this.repository.create({
      user_id,
      amount,
      description,
      type,
      sender_id
    });

    return this.repository.save(statement);
  }

  async findStatementOperation({ statement_id, user_id }: IGetStatementOperationDTO): Promise<Statement | undefined> {
    return this.repository.findOne(statement_id, {
      where: { user_id }
    });
  }

  async getUserBalance({ user_id, with_statement = false }: IGetBalanceDTO):
    Promise<
      { balance: number } | { balance: number, statement: Statement[] }
    >
  {
    const statement = await this.repository
      .createQueryBuilder("stmt")
      .where('user_id = :user_id', { user_id })
      .orWhere('sender_id = :user_id', { sender_id: user_id })
      .getMany();

    function calc(statement: Statement[]) {
      const balance = statement.reduce((acc, operation) => {
        if (operation.type === 'withdraw' || operation.type === 'transfer' && operation.sender_id === user_id) {
          return acc - operation.amount;
        } else {
          return operation.type === 'deposit' ||
            operation.type === 'transfer' &&
            operation.user_id === user_id ?
            acc + Number(operation.amount) : 0;
        }
      }, 0);

      return balance;
    }

    if (with_statement) {
      return {
        statement,
        balance: calc(statement)
      }
    }

    return { balance: calc(statement) }
  }
}
