# Documento 4 — Modelo Entidade-Relacionamento (DER)

## Projeto: Cola Limpa

---

# 1. Objetivo do Documento

Este documento organiza as entidades do banco de dados do sistema Cola Limpa e seus relacionamentos principais, servindo como base para a modelagem física em PostgreSQL.

---

# 2. Entidades do Banco

As entidades centrais do sistema são:

* usuario
* post
* comentario
* like
* cronometro_historico

---

# 3. Entidade Usuario

## Campos

* id
* nome
* email
* telefone
* senha
* data_criacao
* foto_url
* xp
* is_admin

## Regras

* email deve ser único
* telefone deve ser único
* pelo menos um entre email e telefone deve existir
* senha deve ser criptografada
* usuario pode ser comum ou administrador

---

# 4. Entidade Post

## Campos

* id
* usuario_id
* titulo
* texto
* categoria
* materia
* qt_curtidas
* aprovado
* data_criacao

## Regras

* cada post pertence a um único usuário
* post precisa de aprovação
* post é textual
* categoria e matéria são listas pré-definidas
* post pode receber várias curtidas

---

# 5. Entidade Comentario

## Campos

* id
* post_id
* usuario_id
* texto
* qt_curtidas
* aprovado
* data_criacao

## Regras

* cada comentário pertence a um post
* cada comentário pertence a um usuário
* comentário precisa de aprovação
* comentário não possui resposta encadeada
* comentário pode receber curtidas

---

# 6. Entidade Like

## Campos

* id
* usuario_id
* post_id
* comentario_id
* data_criacao

## Regras

* um like pertence a um usuário
* um like deve estar ligado a um post ou a um comentário
* o mesmo usuário não pode curtir o mesmo post mais de uma vez
* o mesmo usuário não pode curtir o mesmo comentário mais de uma vez

## Observação estrutural

Para manter o controle correto, o like deve funcionar assim:

* ou possui `post_id`
* ou possui `comentario_id`

Nunca os dois ao mesmo tempo.

---

# 7. Entidade CronometroHistorico

## Campos

* id
* usuario_id
* tempo_segundos
* data_criacao

## Regras

* cada registro pertence a um usuário
* um usuário pode ter vários registros
* tempo não pode ser negativo
* tempo máximo contínuo é de 16 horas

---

# 8. Relacionamentos

## 8.1 Usuario 1:N Post

Um usuário pode criar muitos posts.

Cardinalidade:

* usuario 1
* post N

Chave estrangeira:

* post.usuario_id → usuario.id

---

## 8.2 Usuario 1:N Comentario

Um usuário pode criar muitos comentários.

Cardinalidade:

* usuario 1
* comentario N

Chave estrangeira:

* comentario.usuario_id → usuario.id

---

## 8.3 Post 1:N Comentario

Um post pode possuir vários comentários.

Cardinalidade:

* post 1
* comentario N

Chave estrangeira:

* comentario.post_id → post.id

---

## 8.4 Usuario 1:N Like

Um usuário pode realizar várias curtidas.

Cardinalidade:

* usuario 1
* like N

Chave estrangeira:

* like.usuario_id → usuario.id

---

## 8.5 Post 1:N Like

Um post pode receber várias curtidas.

Cardinalidade:

* post 1
* like N

Chave estrangeira:

* like.post_id → post.id

---

## 8.6 Comentario 1:N Like

Um comentário pode receber várias curtidas.

Cardinalidade:

* comentario 1
* like N

Chave estrangeira:

* like.comentario_id → comentario.id

---

## 8.7 Usuario 1:N CronometroHistorico

Um usuário pode possuir vários registros de cronômetro.

Cardinalidade:

* usuario 1
* cronometro_historico N

Chave estrangeira:

* cronometro_historico.usuario_id → usuario.id

---

# 9. Regras de Integridade Referencial

## 9.1 Exclusão de Usuário

Ao excluir um usuário, devem ser excluídos automaticamente:

* posts
* comentários
* likes
* cronometro_historico

Isso garante consistência entre as tabelas.

---

## 9.2 Exclusão de Post

Ao excluir um post, devem ser excluídos automaticamente:

* comentários do post
* likes do post
* likes dos comentários vinculados ao post, se aplicável

---

## 9.3 Exclusão de Comentário

Ao excluir um comentário, devem ser excluídos automaticamente:

* likes associados ao comentário

---

# 10. Restrições de Banco

## 10.1 Usuário

* nome obrigatório
* senha obrigatória
* email opcional, mas único quando informado
* telefone opcional, mas único quando informado
* is_admin padrão: false
* xp padrão: 0

---

## 10.2 Post

* titulo obrigatório
* texto obrigatório
* categoria obrigatória
* materia obrigatória
* aprovado padrão: false
* qt_curtidas padrão: 0

---

## 10.3 Comentario

* texto obrigatório
* aprovado padrão: false
* qt_curtidas padrão: 0

---

## 10.4 Like

* deve sempre estar vinculado a um usuário
* deve estar vinculado a um post ou comentário
* nunca aos dois ao mesmo tempo

---

## 10.5 CronometroHistorico

* tempo_segundos obrigatório
* valor mínimo: 0

---

# 11. Modelo de Relacionamento Textual

usuario 1 ----- N post
usuario 1 ----- N comentario
post 1 ----- N comentario
usuario 1 ----- N like
post 1 ----- N like
comentario 1 ----- N like
usuario 1 ----- N cronometro_historico

---

# 12. Conclusão

O DER do Cola Limpa foi definido com base em um modelo simples, consistente e adequado para um sistema acadêmico com características profissionais. Ele já está pronto para ser convertido em diagrama de classes e depois em esquema físico do banco.

Próxima etapa: Diagrama de Classes.

