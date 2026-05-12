# Documento 3 — Modelo Conceitual de Entidades

## Projeto: Cola Limpa

---

# 1. Objetivo do Documento

Este documento define as entidades principais do sistema Cola Limpa, seus atributos e seus relacionamentos. Ele serve como base para o DER, diagrama de classes e futura implementação do banco de dados.

---

# 2. Entidades Principais

O sistema possui como entidades centrais:

* Usuario
* Post
* Comentario
* Like
* CronometroHistorico

As funcionalidades de autenticação, aprovação e controle de interação serão modeladas a partir dessas entidades.

---

# 3. Entidade Usuario

## 3.1 Descrição

Representa qualquer pessoa cadastrada no sistema, seja usuário comum ou administrador.

## 3.2 Atributos

* id
* nome
* email
* telefone
* senha
* data_criacao
* foto_url
* xp
* is_admin

## 3.3 Observações

* email e telefone devem ser únicos
* pelo menos um entre email e telefone deve estar presente no cadastro
* senha deve ser criptografada
* xp representa a experiência total do usuário
* is_admin define se o usuário tem permissões administrativas

---

# 4. Entidade Post

## 4.1 Descrição

Representa uma publicação criada por um usuário na comunidade do sistema.

## 4.2 Atributos

* id
* usuario_id
* titulo
* texto
* categoria
* materia
* qt_curtidas
* aprovado
* data_criacao

## 4.3 Observações

* todo post pertence a um único usuário
* todo post precisa de aprovação
* posts não aprovados ficam invisíveis para os visitantes e usuários comuns
* os campos categoria e matéria devem seguir listas pré-definidas pelo sistema
* posts possuem apenas conteúdo textual

---

# 5. Entidade Comentario

## 5.1 Descrição

Representa uma resposta ou observação feita por um usuário em um post.

## 5.2 Atributos

* id
* post_id
* usuario_id
* texto
* qt_curtidas
* aprovado
* data_criacao

## 5.3 Observações

* todo comentário pertence a um post
* todo comentário pertence a um usuário
* comentários precisam de aprovação
* comentários não possuem respostas encadeadas
* comentários podem receber curtidas

---

# 6. Entidade Like

## 6.1 Descrição

Representa a curtida realizada por um usuário em um post ou comentário.

## 6.2 Atributos

* id
* usuario_id
* post_id ou comentario_id
* data_criacao

## 6.3 Observações

* o usuário só pode curtir uma vez o mesmo post
* o usuário só pode curtir uma vez o mesmo comentário
* a tabela de likes existe para impedir curtidas duplicadas
* um like deve estar associado a apenas um alvo por vez, ou post ou comentário

---

# 7. Entidade CronometroHistorico

## 7.1 Descrição

Representa cada registro de tempo estudado por um usuário.

## 7.2 Atributos

* id
* usuario_id
* tempo_segundos
* data_criacao

## 7.3 Observações

* um usuário pode ter vários registros de cronômetro
* o tempo não pode ser negativo
* o tempo máximo contínuo é de 16 horas
* os registros ficam armazenados para montar o histórico de estudo

---

# 8. Relacionamentos Entre Entidades

## 8.1 Usuario e Post

Relacionamento:

* um usuário cria muitos posts
* cada post pertence a um único usuário

Cardinalidade:

* 1 : N

---

## 8.2 Usuario e Comentario

Relacionamento:

* um usuário cria muitos comentários
* cada comentário pertence a um único usuário

Cardinalidade:

* 1 : N

---

## 8.3 Post e Comentario

Relacionamento:

* um post pode ter muitos comentários
* cada comentário pertence a um único post

Cardinalidade:

* 1 : N

---

## 8.4 Usuario e CronometroHistorico

Relacionamento:

* um usuário pode ter muitos registros de cronômetro
* cada registro pertence a um único usuário

Cardinalidade:

* 1 : N

---

## 8.5 Usuario e Like

Relacionamento:

* um usuário pode dar muitos likes
* cada like pertence a um único usuário

Cardinalidade:

* 1 : N

---

## 8.6 Like e Post

Relacionamento:

* um post pode receber muitos likes
* um like pode estar associado a um post

Cardinalidade:

* 1 : N

---

## 8.7 Like e Comentario

Relacionamento:

* um comentário pode receber muitos likes
* um like pode estar associado a um comentário

Cardinalidade:

* 1 : N

---

# 9. Regras Estruturais do Modelo

## 9.1 Exclusão em Cascata

Quando um usuário for removido, o sistema deverá remover:

* seus posts;
* seus comentários;
* seus registros de cronômetro;
* seus likes.

Quando um post for removido, o sistema deverá remover:

* seus comentários;
* seus likes relacionados.

---

## 9.2 Aprovação

Post e comentário possuem o atributo:

* aprovado

Esse atributo será booleano e indicará se o conteúdo pode ser exibido publicamente.

---

## 9.3 Controle de Curtidas

A quantidade total de curtidas será armazenada nas entidades:

* Post
* Comentario

A tabela Like servirá como controle para impedir curtidas duplicadas.

---

# 10. Estrutura Lógica do Modelo

## 10.1 Usuario

Entidade principal do sistema. Centraliza autenticação, permissões, criação de conteúdo e registro de estudo.

## 10.2 Post

Entidade de publicação da comunidade. Guarda conteúdo, classificação e estado de aprovação.

## 10.3 Comentario

Entidade vinculada a postagens, usada para interação entre usuários.

## 10.4 Like

Entidade de apoio para controle de curtidas e integridade de interação.

## 10.5 CronometroHistorico

Entidade de apoio para armazenamento do tempo estudado.

---

# 11. Resumo das Entidades e Atributos

## Usuario

* id
* nome
* email
* telefone
* senha
* data_criacao
* foto_url
* xp
* is_admin

## Post

* id
* usuario_id
* titulo
* texto
* categoria
* materia
* qt_curtidas
* aprovado
* data_criacao

## Comentario

* id
* post_id
* usuario_id
* texto
* qt_curtidas
* aprovado
* data_criacao

## Like

* id
* usuario_id
* post_id ou comentario_id
* data_criacao

## CronometroHistorico

* id
* usuario_id
* tempo_segundos
* data_criacao

---

# 12. Conclusão

Este modelo conceitual organiza a base estrutural do sistema Cola Limpa de forma compatível com um projeto acadêmico e próximo de uma aplicação real. A partir dele será possível construir o DER e, em seguida, o diagrama de classes com consistência entre os relacionamentos e regras do sistema.

