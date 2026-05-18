# Documento 10 — Estrutura Física do Banco de Dados PostgreSQL

## Projeto: Cola Limpa

---

# 1. Objetivo do Documento

Este documento define a estrutura física inicial do banco de dados PostgreSQL do sistema Cola Limpa.
Ele organiza tabelas, campos, tipos de dados, chaves primárias, chaves estrangeiras e restrições essenciais para a implementação.

---

# 2. Banco de Dados

O banco de dados será relacional e terá como finalidade armazenar:

* usuários;
* posts;
* comentários;
* curtidas;
* histórico de tempo estudado;
* dados de suporte para autenticação e recuperação de senha, quando necessário.

---

# 3. Convenções de Modelagem

Para manter padronização, serão adotadas as seguintes convenções:

* nomes de tabelas em minúsculo;
* nomes de campos em `snake_case`;
* chaves primárias do tipo `id`;
* chaves estrangeiras no formato `nome_tabela_id`;
* datas armazenadas com tipo adequado para data e hora;
* valores booleanos para flags de aprovação e administrador.

---

# 4. Tabela usuario

## Finalidade

Armazena os dados dos usuários do sistema.

## Campos

* id — `BIGSERIAL` — chave primária
* nome — `VARCHAR(120)` — obrigatório
* email — `VARCHAR(150)` — único, opcional
* telefone — `VARCHAR(20)` — único, opcional
* senha — `VARCHAR(255)` — obrigatório
* foto_url — `TEXT` — opcional
* xp — `INTEGER` — padrão 0
* is_admin — `BOOLEAN` — padrão false
* data_criacao — `TIMESTAMP` — obrigatório

## Restrições

* email deve ser único
* telefone deve ser único
* senha não pode ser nula
* xp não pode ser negativo
* pelo menos email ou telefone deve existir

---

# 5. Tabela post

## Finalidade

Armazena os posts criados pelos usuários.

## Campos

* id — `BIGSERIAL` — chave primária
* usuario_id — `BIGINT` — chave estrangeira
* titulo — `VARCHAR(150)` — obrigatório
* texto — `TEXT` — obrigatório
* categoria — `VARCHAR(60)` — obrigatório
* materia — `VARCHAR(60)` — obrigatório
* qt_curtidas — `INTEGER` — padrão 0
* aprovado — `BOOLEAN` — padrão false
* data_criacao — `TIMESTAMP` — obrigatório

## Chaves

* `usuario_id` referencia `usuario(id)`

## Restrições

* um post pertence a um único usuário
* post precisa de aprovação
* conteúdo é textual
* qt_curtidas não pode ser negativa

---

# 6. Tabela comentario

## Finalidade

Armazena os comentários feitos em posts.

## Campos

* id — `BIGSERIAL` — chave primária
* post_id — `BIGINT` — chave estrangeira
* usuario_id — `BIGINT` — chave estrangeira
* texto — `TEXT` — obrigatório
* qt_curtidas — `INTEGER` — padrão 0
* aprovado — `BOOLEAN` — padrão false
* data_criacao — `TIMESTAMP` — obrigatório

## Chaves

* `post_id` referencia `post(id)`
* `usuario_id` referencia `usuario(id)`

## Restrições

* comentário pertence a um post
* comentário pertence a um usuário
* comentário precisa de aprovação
* comentários não possuem respostas encadeadas
* qt_curtidas não pode ser negativa

---

# 7. Tabela like

## Finalidade

Controla curtidas em posts e comentários, impedindo duplicidade.

## Campos

* id — `BIGSERIAL` — chave primária
* usuario_id — `BIGINT` — chave estrangeira
* post_id — `BIGINT` — chave estrangeira, opcional
* comentario_id — `BIGINT` — chave estrangeira, opcional
* data_criacao — `TIMESTAMP` — obrigatório

## Chaves

* `usuario_id` referencia `usuario(id)`
* `post_id` referencia `post(id)`
* `comentario_id` referencia `comentario(id)`

## Restrições

* um like deve estar associado a um post ou a um comentário
* nunca aos dois ao mesmo tempo
* um usuário só pode curtir uma vez o mesmo post
* um usuário só pode curtir uma vez o mesmo comentário

## Observação

O ideal é criar restrições únicas para impedir duplicidade de curtidas.

---

# 8. Tabela cronometro_historico

## Finalidade

Armazena o histórico de tempo estudado por cada usuário.

## Campos

* id — `BIGSERIAL` — chave primária
* usuario_id — `BIGINT` — chave estrangeira
* tempo_segundos — `INTEGER` — obrigatório
* data_criacao — `TIMESTAMP` — obrigatório

## Chaves

* `usuario_id` referencia `usuario(id)`

## Restrições

* tempo_segundos não pode ser negativo
* tempo máximo contínuo é de 16 horas, equivalente a 57600 segundos
* cada registro pertence a um usuário

---

# 9. Tabela codigo_recuperacao

## Finalidade

Armazena temporariamente os códigos enviados para recuperação de senha ou verificação de conta, caso o sistema opte por persistir esse controle no banco.

## Campos

* id — `BIGSERIAL` — chave primária
* usuario_id — `BIGINT` — chave estrangeira
* codigo — `VARCHAR(20)` — obrigatório
* canal_envio — `VARCHAR(20)` — obrigatório
* expiracao — `TIMESTAMP` — obrigatório
* tentativas_envio — `INTEGER` — padrão 0
* data_criacao — `TIMESTAMP` — obrigatório

## Chaves

* `usuario_id` referencia `usuario(id)`

## Restrições

* código expira em 5 minutos
* limite de reenvio deve respeitar 30 segundos
* máximo de 4 códigos por dia

---

# 10. Relacionamentos entre Tabelas

## usuario 1:N post

Um usuário pode criar vários posts.

## usuario 1:N comentario

Um usuário pode criar vários comentários.

## post 1:N comentario

Um post pode possuir vários comentários.

## usuario 1:N like

Um usuário pode registrar vários likes.

## post 1:N like

Um post pode receber vários likes.

## comentario 1:N like

Um comentário pode receber vários likes.

## usuario 1:N cronometro_historico

Um usuário pode possuir vários registros de tempo.

## usuario 1:N codigo_recuperacao

Um usuário pode possuir vários códigos temporários.

---

# 11. Regras de Exclusão em Cascata

Ao remover um usuário, o banco deverá excluir automaticamente:

* posts;
* comentários;
* likes;
* histórico de cronômetro;
* códigos temporários, se existirem.

Ao remover um post, o banco deverá excluir automaticamente:

* comentários;
* likes associados ao post;
* likes dos comentários vinculados, quando aplicável.

Ao remover um comentário, o banco deverá excluir automaticamente:

* likes associados ao comentário.

---

# 12. Índices Recomendados

Para melhorar desempenho, recomenda-se criar índices para:

* usuario.email
* usuario.telefone
* post.usuario_id
* post.aprovado
* post.categoria
* post.materia
* comentario.post_id
* comentario.usuario_id
* comentario.aprovado
* like.usuario_id
* like.post_id
* like.comentario_id
* cronometro_historico.usuario_id

---

# 13. Restrições Importantes

O banco deve garantir:

* integridade referencial;
* unicidade de email e telefone;
* controle de aprovação;
* controle de curtidas duplicadas;
* exclusão em cascata;
* campos obrigatórios devidamente preenchidos.

---

# 14. Conclusão

A estrutura física do PostgreSQL para o Cola Limpa foi organizada para atender tanto às regras acadêmicas quanto às exigências de um sistema real.
A modelagem garante consistência, segurança, escalabilidade e facilidade de manutenção.

Próxima etapa: Estrutura do frontend React.

