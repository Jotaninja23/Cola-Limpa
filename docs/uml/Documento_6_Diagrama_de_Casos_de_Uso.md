# Documento 6 — Diagrama de Casos de Uso

## Projeto: Cola Limpa

---

# 1. Objetivo do Documento

Este documento descreve os casos de uso do sistema Cola Limpa, mostrando as principais interações entre os usuários e a plataforma.

---

# 2. Atores do Sistema

## 2.1 Visitante

Usuário não autenticado.

Pode:

* visualizar conteúdos públicos;
* acessar artigos e posts aprovados;
* visualizar comentários aprovados.

Não pode:

* comentar;
* curtir;
* postar;
* usar cronômetro;
* responder questões.

---

## 2.2 Usuário

Usuário autenticado no sistema.

Pode:

* cadastrar-se;
* fazer login;
* recuperar senha;
* editar perfil;
* criar post;
* comentar;
* curtir post;
* curtir comentário;
* usar cronômetro;
* responder questões geradas por IA;
* visualizar histórico de tempo;
* receber notificações.

---

## 2.3 Administrador

Usuário com permissões administrativas.

Pode:

* aprovar posts;
* aprovar comentários;
* remover posts;
* remover comentários;
* remover usuários;
* acessar painel administrativo.

---

## 2.4 Serviço de IA Externa

Sistema externo responsável pela geração de questões.

Participa de:

* geração de questão;
* envio da resposta gerada;
* retorno das alternativas.

---

## 2.5 Serviço de Notificação do Navegador

Recurso do navegador responsável por exibir alertas ao usuário.

Participa de:

* notificação diária de incentivo ao estudo.

---

# 3. Casos de Uso do Usuário

## 3.1 Cadastrar-se

Permite criar uma conta no sistema informando dados pessoais e um meio de contato.

Resultado:

* conta criada e validada por código.

---

## 3.2 Fazer Login

Permite autenticação no sistema com email ou telefone e senha.

Resultado:

* acesso liberado ao ambiente autenticado;
* token JWT gerado.

---

## 3.3 Recuperar Senha

Permite redefinir a senha por email ou telefone.

Resultado:

* nova senha cadastrada após validação do código.

---

## 3.4 Editar Perfil

Permite alterar dados do usuário, incluindo foto de perfil.

Resultado:

* perfil atualizado.

---

## 3.5 Criar Post

Permite publicar conteúdo textual na comunidade.

Resultado:

* post salvo como pendente de aprovação.

---

## 3.6 Comentar em Post

Permite responder um post aprovado.

Resultado:

* comentário salvo como pendente de aprovação.

---

## 3.7 Curtir Post

Permite marcar um post como curtido.

Resultado:

* quantidade de curtidas atualizada;
* duplicidade impedida.

---

## 3.8 Curtir Comentário

Permite marcar um comentário como curtido.

Resultado:

* quantidade de curtidas atualizada;
* duplicidade impedida.

---

## 3.9 Usar Cronômetro

Permite iniciar e pausar o controle de tempo de estudo.

Resultado:

* tempo salvo no histórico;
* XP atualizado conforme regra de negócio.

---

## 3.10 Responder Questão com IA

Permite ao usuário solicitar uma questão por matéria, assunto e dificuldade.

Resultado:

* questão exibida com alternativas A, B, C, D e E;
* ao responder, o sistema libera a próxima questão.

---

## 3.11 Visualizar Conteúdos

Permite ao usuário ou visitante ver posts, comentários e artigos aprovados.

Resultado:

* conteúdo exibido conforme permissões.

---

# 4. Casos de Uso do Administrador

## 4.1 Aprovar Post

Permite liberar um post para visualização pública.

Resultado:

* post marcado como aprovado.

---

## 4.2 Aprovar Comentário

Permite liberar um comentário para visualização pública.

Resultado:

* comentário marcado como aprovado.

---

## 4.3 Remover Post

Permite excluir um post do sistema.

Resultado:

* post removido;
* comentários e likes relacionados removidos em cascata.

---

## 4.4 Remover Comentário

Permite excluir um comentário do sistema.

Resultado:

* comentário removido;
* likes relacionados removidos.

---

## 4.5 Remover Usuário

Permite excluir um usuário da plataforma.

Resultado:

* usuário removido;
* posts, comentários, likes e históricos removidos.

---

# 5. Casos de Uso do Sistema

## 5.1 Enviar Notificação Diária

O sistema envia uma notificação no navegador para incentivar o estudo.

Resultado:

* notificação exibida ao usuário.

---

## 5.2 Gerar Questão com IA

O sistema consulta uma API externa e obtém uma questão com alternativas.

Resultado:

* pergunta exibida ao usuário.

---

## 5.3 Controlar Aprovação de Conteúdo

O sistema mantém conteúdos novos como pendentes até validação de um administrador.

Resultado:

* post ou comentário só fica visível após aprovação.

---

## 5.4 Controlar XP

O sistema atualiza a experiência do usuário com base em:

* tempo estudado;
* questões respondidas.

Resultado:

* XP total incrementado.

---

# 6. Relacionamento Entre Atores e Casos de Uso

## Visitante

* visualizar conteúdos públicos

## Usuário

* cadastrar-se
* fazer login
* recuperar senha
* editar perfil
* criar post
* comentar
* curtir post
* curtir टिप्पणी
* usar cronômetro
* responder questão com IA
* visualizar conteúdos
* receber notificação

## Administrador

* aprovar post
* aprovar comentário
* remover post
* remover comentário
* remover usuário
* acessar painel administrativo

## Serviço de IA Externa

* gerar questão

## Serviço de Notificação

* enviar notificação diária

---

# 7. Fluxos Principais dos Casos de Uso

## 7.1 Fluxo de Cadastro

1. Usuário informa dados de cadastro.
2. Sistema valida email ou telefone.
3. Sistema envia código de verificação.
4. Usuário confirma o código.
5. Sistema cria a conta.

---

## 7.2 Fluxo de Criação de Post

1. Usuário escreve título, texto, categoria e matéria.
2. Sistema salva o post como pendente.
3. Administrador avalia o conteúdo.
4. Sistema libera ou remove o post.

---

## 7.3 Fluxo de Comentário

1. Usuário seleciona um post.
2. Usuário escreve comentário.
3. Sistema salva como pendente.
4. Administrador aprova ou remove.

---

## 7.4 Fluxo de Cronômetro

1. Usuário inicia o cronômetro manualmente.
2. Sistema registra o tempo.
3. Usuário pausa o cronômetro.
4. Sistema grava o histórico e atualiza XP.

---

## 7.5 Fluxo de Questão com IA

1. Usuário informa matéria, assunto e dificuldade.
2. Sistema envia solicitação à IA externa.
3. IA retorna a questão com alternativas.
4. Usuário responde.
5. Sistema libera a próxima questão.

---

# 8. Diagrama de Casos de Uso em Texto

Abaixo está a estrutura resumida que deve aparecer no diagrama:

## Visitante

* Visualizar conteúdos públicos

## Usuário

* Cadastrar-se
* Fazer login
* Recuperar senha
* Editar perfil
* Criar post
* Comentar
* Curtir post
* Curtir comentário
* Usar cronômetro
* Responder questão com IA
* Visualizar conteúdos
* Receber notificação

## Administrador

* Aprovar post
* Aprovar comentário
* Remover post
* Remover comentário
* Remover usuário
* Acessar painel administrativo

## Sistema Externo de IA

* Gerar questão

## Navegador

* Exibir notificação diária

---

# 9. Conclusão

O diagrama de casos de uso do Cola Limpa mostra claramente as interações entre visitantes, usuários, administradores e serviços externos. Ele organiza as funcionalidades do sistema em um formato adequado para documentação acadêmica e também compatível com uma aplicação real.

Próxima etapa: Diagrama de Sequência.

