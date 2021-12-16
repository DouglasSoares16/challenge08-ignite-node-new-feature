import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { TransferStatementError } from "./TransferStatementError";

interface IRequest {
  receiver_id: string;
  sender_id: string;
  amount: number;
  description: string;
}

@injectable()
class TransferStatementUseCase {
  constructor(
    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository,

    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({ sender_id, receiver_id, amount, description }: IRequest) {
    if (sender_id === receiver_id) {
      throw new TransferStatementError.IncorrectTransfer();
    }

    const userReceiver = await this.usersRepository.findById(receiver_id);

    if (!userReceiver) {
      throw new TransferStatementError.UserReceiverNotFound();
    }

    const userSenderBalance = await this.statementsRepository.getUserBalance({ user_id: sender_id });

    if (amount > userSenderBalance.balance) {
      throw new TransferStatementError.InsufficientFunds();
    }

    const transfer = await this.statementsRepository.create({
      user_id: receiver_id,
      sender_id,
      type: OperationType.TRANSFER,
      amount,
      description
    });

    return transfer;
  }
}

export { TransferStatementUseCase };
