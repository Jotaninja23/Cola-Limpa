# Documento 7 — Diagrama de Sequência

## Projeto: Cola Limpa

---

# 1. Objetivo do Documento

Este documento descreve os principais fluxos de interação entre usuário, frontend, backend, banco de dados e serviços externos do sistema Cola Limpa.

Os diagramas de sequência serão apresentados em forma textual, com foco nos cenários mais importantes do sistema.

---

# 2. Participantes Gerais

Os elementos que participam dos fluxos são:

* Usuário
* Interface Web
* API Backend
* Banco de Dados
* Serviço de Autenticação
* Serviço de IA Externa
* Serviço de Notificação do Navegador
* Administrador

---

# 3. Sequência — Cadastro de Usuário

## Fluxo

1. O usuário acessa a tela de cadastro.
2. A interface web envia os dados para a API backend.
3. O backend valida se email ou telefone foi informado.
4. O backend verifica se o email ou telefone já existe no banco.
5. Se estiver tudo correto, o backend gera um código de verificação.
6. O backend envia o código por email ou telefone.
7. O usuário informa o código recebido.
8. O backend valida o código.
9. O backend cria o usuário no banco de dados.
10. A interface exibe confirmação de cadastro.

## Observações

* senha é criptografada antes de ser salva;
* cadastro só é concluído após validação do código.

---

# 4. Sequência — Login

## Fluxo

1. O usuário informa email ou telefone e senha.
2. A interface envia os dados para a API backend.
3. O backend localiza o usuário no banco.
4. O backend valida a senha com bcrypt.
5. Se os dados estiverem corretos, o backend gera um JWT.
6. O JWT é enviado para a interface.
7. A interface armazena o token.
8. O usuário passa a ter acesso às áreas autenticadas.

## Observações

* se a autenticação falhar, o sistema retorna mensagem de erro;
* o token será usado nas requisições protegidas.

---

# 5. Sequência — Recuperação de Senha

## Fluxo

1. O usuário acessa a opção de recuperação de senha.
2. A interface solicita email ou telefone.
3. O backend verifica o cadastro do usuário.
4. O backend gera um código de redefinição.
5. O código é enviado por email ou telefone.
6. O usuário informa o código recebido.
7. O backend valida o código.
8. O usuário informa a nova senha.
9. O backend criptografa a nova senha.
10. O backend atualiza a senha no banco.
11. A interface confirma a alteração.

## Observações

* o código expira em 5 minutos;
* o reenvio respeita o intervalo de 30 segundos;
* existe limite diário de 4 códigos.

---

# 6. Sequência — Criar Post

## Fluxo

1. O usuário autenticado acessa a tela de criação de post.
2. A interface coleta título, texto, categoria e matéria.
3. A interface envia os dados para o backend.
4. O backend valida os campos obrigatórios.
5. O backend cria o post com status pendente.
6. O backend salva o post no banco.
7. A interface exibe a mensagem “esperando aprovação de um admin”.

## Observações

* o post não aparece publicamente antes da aprovação;
* o conteúdo é textual.

---

# 7. Sequência — Aprovar Post

## Fluxo

1. O administrador acessa o painel administrativo.
2. A interface solicita a lista de posts pendentes.
3. O backend busca os posts no banco.
4. O administrador seleciona um post.
5. A interface envia a ação de aprovação ao backend.
6. O backend atualiza o status do post para aprovado.
7. O backend salva a alteração no banco.
8. O post passa a ficar visível publicamente.

## Observações

* apenas administradores têm permissão para aprovar;
* posts recusados podem ser removidos.

---

# 8. Sequência — Criar Comentário

## Fluxo

1. O usuário autenticado visualiza um post aprovado.
2. O usuário escreve um comentário.
3. A interface envia o comentário para o backend.
4. O backend valida o conteúdo.
5. O backend salva o comentário com status pendente.
6. O backend grava no banco de dados.
7. A interface exibe confirmação de envio.

## Observações

* o comentário só aparece publicamente após aprovação;
* comentários não possuem respostas encadeadas.

---

# 9. Sequência — Aprovar Comentário

## Fluxo

1. O administrador acessa os comentários pendentes.
2. A interface mostra a lista ao administrador.
3. O administrador escolhe um comentário.
4. A interface envia a aprovação ao backend.
5. O backend altera o status para aprovado.
6. O comentário fica visível no post relacionado.

---

# 10. Sequência — Curtir Post ou Comentário

## Fluxo

1. O usuário autenticado clica no botão de curtir.
2. A interface envia o pedido ao backend.
3. O backend verifica se o usuário já curtiu o conteúdo.
4. Se ainda não tiver curtido, o backend cria o registro de like.
5. O backend atualiza a contagem total de curtidas.
6. O backend salva as alterações no banco.
7. A interface atualiza a quantidade exibida.

## Observações

* um usuário só pode curtir uma vez o mesmo conteúdo;
* o controle é feito pela tabela de likes.

---

# 11. Sequência — Usar Cronômetro

## Fluxo

1. O usuário autenticado inicia o cronômetro manualmente.
2. A interface começa a medir o tempo.
3. O usuário pausa o cronômetro.
4. A interface envia o tempo total ao backend.
5. O backend valida o valor.
6. O backend salva o registro em cronometro_historico.
7. O backend atualiza o XP do usuário conforme a regra.
8. A interface exibe o tempo registrado.

## Observações

* o cronômetro é pausado se a aba for fechada;
* o tempo permanece salvo para retomada futura;
* o limite máximo é de 16 horas.

---

# 12. Sequência — Gerar Questão com IA

## Fluxo

1. O usuário informa matéria, assunto e dificuldade.
2. A interface envia os parâmetros ao backend.
3. O backend monta a solicitação para a API externa de IA.
4. A IA retorna a questão com alternativas A, B, C, D e E.
5. O backend repassa a questão para a interface.
6. O usuário responde a questão.
7. A interface apenas permite avançar para a próxima questão.

## Observações

* a questão não é salva no banco;
* não existe histórico de desempenho;
* não há correção automática exibida ao usuário.

---

# 13. Sequência — Enviar Notificação Diária

## Fluxo

1. O sistema identifica usuários com permissão para notificações.
2. O backend solicita liberação do navegador.
3. O serviço de notificação envia o aviso diário.
4. A interface do navegador exibe a mensagem ao usuário.

## Observações

* a notificação tem objetivo de incentivar o estudo.

---

# 14. Sequência — Remover Usuário

## Fluxo

1. O administrador seleciona um usuário no painel.
2. A interface envia a solicitação de exclusão ao backend.
3. O backend valida a permissão administrativa.
4. O backend remove o usuário do banco.
5. O backend remove posts, comentários, likes e históricos relacionados.
6. A interface confirma a exclusão.

---

# 15. Estrutura Resumida dos Principais Fluxos

Os fluxos mais importantes do sistema são:

* cadastro;
* login;
* recuperação de senha;
* criação de post;
* aprovação de post;
* criação de comentário;
* aprovação de comentário;
* curtida;
* cronômetro;
* geração de questão com IA;
* notificação;
* remoção de usuário.

---

# 16. Conclusão

Os diagramas de sequência do Cola Limpa demonstram como as camadas do sistema interagem em cada funcionalidade principal. Eles reforçam a separação entre interface, backend, banco de dados e serviços externos, mantendo coerência com a arquitetura MVC e com uma aplicação web profissional.

Próxima etapa: Diagrama de Atividades.

