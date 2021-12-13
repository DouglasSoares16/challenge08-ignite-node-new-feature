import { Request, Response } from "express";
import { container } from "tsyringe";
import { TransferStatementUseCase } from "./TransferStatementUseCase";

class TransferStatementController {
  async handle(request: Request, response: Response) {
    const { id: user_sender } = request.user;
    const { user_receiver } = request.params;

    const {
      amount,
      description
    } = request.body;

    const transferStatementUseCase = container.resolve(TransferStatementUseCase);

    const transfer = await transferStatementUseCase.execute({
      sender_id: user_sender,
      receiver_id: user_receiver as string,
      amount,
      description
    });

    return response.json(transfer);
  }
}

export { TransferStatementController };
