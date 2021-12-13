## Transferência de dinheiro

Regras Funcionais X Regras de Negócio

**RF**:
* Deve ser possível realizar uma transferência de dinheiro

**RN**:

* Não deve ser possível enviar uma transferência, se o usuário remetente for o mesmo do receptor. (X)

* Não deve ser possível realizar uma transferência se o usuário receptor não existir. (X)

* Não deve ser possível realizar uma transferência, se a quantia a ser transferida for maior do que a do saldo do usuário remetente. (X)

* Ao realizar a transferência, deverá ser retirado do saldo do usuário remetente a quantia que está sendo transferida. (X)
