# Débitos técnicos
- Gerar data da criação da transação na aplicação.
- Remover sleep do command do docker, e criar um mecanismo mais aprimorado.
- Models devem ser uma interface ? dado que são somente utilizado para serem modelos de dados de uma entidade.
- Criar indice para cpf na tabela user.
- Mover a criação do id e da entidade para dentro do repository ?
- Garantir transação da atualização da conta e criação da transaction

IMPORTANTE:

- Adicionar middleware de validação de dados. A aplicação quase não valida tipo de dados que são fornecidos como
input. Usar o [Express Validator](https://express-validator.github.io/docs/index.html) é uma boa.