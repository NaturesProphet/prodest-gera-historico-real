[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

# Gera Historico Real
Este serviço escuta no rabbit os veiculos que estão terminando uma viagem agora, faz um select na tabela de historico bruto com a viagem que temrinou, gerando assim o historico real registrado nessa viagem.

Ao gerar o histórico real, o serviço envia a viagem para outra fila, que será ouvida do outro lado por outro serviço que completará os buracos da viagem.


## Variaveis de ambiente

crie um arquivo chamado '.env' e o configure conforme o conteúdo de exemplo disponivel na raiz do repositório: .env.example.
