import { AppError } from "../../../../shared/errors/AppError";

export namespace TransferStatementError {
  export class IncorrectTransfer extends AppError {
    constructor() {
      super("Incorrect Transfer", 400);
    }
  }

  export class UserReceiverNotFound extends AppError {
    constructor() {
      super('User Receiver not found', 404);
    }
  }

  export class InsufficientFunds extends AppError {
    constructor() {
      super('Insufficient funds', 400);
    }
  }
}
