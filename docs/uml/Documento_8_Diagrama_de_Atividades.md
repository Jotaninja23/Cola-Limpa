# Documento 8 — Diagrama de Atividades

## Projeto: Cola Limpa

---

# 1. Objetivo do Documento

Este documento descreve os principais fluxos de atividade do sistema Cola Limpa, representando o comportamento passo a passo das funcionalidades mais importantes.

---

# 2. Atividade — Cadastro de Usuário

## Fluxo

1. Usuário acessa a tela de cadastro.
2. Usuário informa nome, email ou telefone e senha.
3. Sistema valida os campos obrigatórios.
4. Sistema verifica duplicidade de email e telefone.
5. Sistema envia código de verificação.
6. Usuário informa o código recebido.
7. Sistema valida o código.
8. Sistema criptografa a senha.
9. Sistema cria a conta do usuário.
10. Sistema exibe confirmação de cadastro.

## Observação

Se o código for inválido, o cadastro não é concluído.

---

# 3. Atividade — Login

## Fluxo

1. Usuário acessa a tela de login.
2. Usuário informa email ou telefone e senha.
3. Sistema localiza o usuário no banco.
4. Sistema valida a senha.
5. Sistema gera token JWT.
6. Sistema libera acesso à área autenticada.

## Observação

Se os dados estiverem incorretos, o sistema exibe erro de autenticação.

---

# 4. Atividade — Recuperação de Senha

## Fluxo

1. Usuário acessa a opção de recuperação de senha.
2. Usuário escolhe email ou telefone.
3. Sistema envia código de recuperação.
4. Usuário informa o código.
5. Sistema valida o código.
6. Usuário informa nova senha.
7. Sistema criptografa a nova senha.
8. Sistema atualiza a senha no banco.
9. Sistema confirma a redefinição.

## Observação

O código possui validade de 5 minutos.

---

# 5. Atividade — Criar Post

## Fluxo

1. Usuário autenticado acessa a criação de post.
2. Usuário informa título, texto, categoria e matéria.
3. Sistema valida os dados.
4. Sistema cria o post com status pendente.
5. Sistema salva o post no banco.
6. Sistema exibe mensagem de aguardo de aprovação.

## Observação

O post não fica visível publicamente antes da aprovação.

---

# 6. Atividade — Aprovar Post

## Fluxo

1. Administrador acessa o painel administrativo.
2. Sistema exibe posts pendentes.
3. Administrador seleciona um post.
4. Administrador aprova ou remove o conteúdo.
5. Sistema atualiza o status no banco.
6. Sistema libera o post para visualização pública, se aprovado.

## Observação

Somente administradores podem realizar essa ação.

---

# 7. Atividade — Criar Comentário

## Fluxo

1. Usuário autenticado acessa um post aprovado.
2. Usuário escreve um comentário.
3. Sistema valida o conteúdo.
4. Sistema salva o comentário com status pendente.
5. Sistema informa que o comentário aguarda aprovação.

## Observação

Comentários não possuem respostas encadeadas.

---

# 8. Atividade — Aprovar Comentário

## Fluxo

1. Administrador acessa os comentários pendentes.
2. Sistema exibe a lista.
3. Administrador escolhe um comentário.
4. Administrador aprova ou remove o comentário.
5. Sistema atualiza o status.
6. Sistema disponibiliza o comentário no post, se aprovado.

---

# 9. Atividade — Curtir Post ou Comentário

## Fluxo

1. Usuário autenticado visualiza um conteúdo.
2. Usuário clica em curtir.
3. Sistema verifica se o usuário já curtiu aquele item.
4. Se não houver curtida anterior, sistema registra o like.
5. Sistema atualiza a contagem total de curtidas.
6. Sistema atualiza a interface.

## Observação

O usuário só pode curtir uma vez o mesmo conteúdo.

---

# 10. Atividade — Usar Cronômetro

## Fluxo

1. Usuário autenticado inicia o cronômetro.
2. Sistema começa a contar o tempo.
3. Usuário navega pelo site ou responde questões.
4. Usuário pausa o cronômetro.
5. Sistema calcula o tempo total.
6. Sistema salva o histórico.
7. Sistema atualiza o XP do usuário.

## Observação

Se a aba for fechada, o cronômetro pausa e o tempo permanece salvo.

---

# 11. Atividade — Gerar Questão com IA

## Fluxo

1. Usuário informa matéria, assunto e dificuldade.
2. Sistema envia solicitação para a API externa de IA.
3. API retorna a questão.
4. Sistema exibe enunciado e alternativas A, B, C, D e E.
5. Usuário responde.
6. Sistema libera a próxima questão.

## Observação

A questão não é salva no banco.

---

# 12. Atividade — Enviar Notificação Diária

## Fluxo

1. Sistema identifica usuários aptos a receber notificação.
2. Sistema solicita permissão do navegador.
3. Serviço de notificação dispara o aviso.
4. Navegador exibe a mensagem de incentivo ao estudo.

---

# 13. Atividade — Remover Usuário

## Fluxo

1. Administrador acessa o painel.
2. Administrador seleciona o usuário.
3. Sistema valida a permissão.
4. Sistema remove o usuário.
5. Sistema remove posts, comentários, likes e históricos relacionados.
6. Sistema confirma a exclusão.

---

# 14. Resumo dos Principais Diagramas de Atividade

Os fluxos de atividade essenciais do Cola Limpa são:

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
* notificação diária;
* remoção de usuário.

---

# 15. Conclusão

Os diagramas de atividades do Cola Limpa organizam o comportamento operacional do sistema em fluxos claros e sequenciais. Eles ajudam a visualizar decisões, validações, aprovações e ações principais do usuário, do administrador e dos serviços externos.

Próxima etapa: Arquitetura MVC e estrutura das camadas do sistema.

