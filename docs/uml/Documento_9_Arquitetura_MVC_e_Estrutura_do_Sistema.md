# Documento 9 — Arquitetura MVC e Estrutura do Sistema

## Projeto: Cola Limpa

---

# 1. Objetivo do Documento

Este documento descreve a arquitetura geral do sistema Cola Limpa, organizando as camadas da aplicação em um modelo MVC com frontend separado do backend e comunicação por API REST.

---

# 2. Visão Geral da Arquitetura

O sistema será estruturado da seguinte forma:

* frontend em React;
* backend em Node.js com Express;
* banco de dados PostgreSQL;
* autenticação com JWT;
* criptografia de senha com bcrypt;
* integração com API externa de IA.

O modelo adotado favorece:

* organização;
* manutenção;
* escalabilidade;
* separação de responsabilidades;
* facilidade de evolução futura.

---

# 3. Padrão MVC

A arquitetura backend seguirá o padrão MVC.

## 3.1 Model

Responsável por representar as entidades e acessar os dados do banco.

Exemplos:

* Usuario
* Post
* Comentario
* Like
* CronometroHistorico

## 3.2 View

Na aplicação web, a view será representada pelas telas do frontend em React.

Exemplos:

* tela de login;
* tela de cadastro;
* tela de posts;
* painel administrativo;
* tela do cronômetro;
* tela de questões com IA.

## 3.3 Controller

Responsável por receber requisições, validar dados, chamar serviços e retornar respostas.

Exemplos:

* AuthController;
* PostController;
* ComentarioController;
* LikeController;
* CronometroController;
* IAController;
* NotificacaoController;
* AdminController.

---

# 4. Separação em Camadas

O sistema será dividido em camadas para evitar acoplamento excessivo.

## 4.1 Camada de Apresentação

Responsável pela interface com o usuário.

Inclui:

* páginas React;
* componentes reutilizáveis;
* formulários;
* navegação;
* estado visual.

## 4.2 Camada de Controle

Responsável por receber as requisições da interface e encaminhá-las para a lógica correta.

Inclui:

* controllers;
* validações iniciais;
* tratamento de erros;
* resposta HTTP.

## 4.3 Camada de Serviço

Responsável pelas regras de negócio do sistema.

Inclui:

* autenticação;
* aprovação;
* pontuação XP;
* controle de likes;
* cronômetro;
* integração com IA;
* notificações.

## 4.4 Camada de Persistência

Responsável por comunicação com o banco de dados.

Inclui:

* repositórios;
* consultas;
* inserções;
* atualizações;
* remoções;
* relacionamentos.

---

# 5. Fluxo Geral da Aplicação

O fluxo principal será:

1. O usuário interage com o frontend.
2. O frontend envia a requisição para a API.
3. O controller recebe a requisição.
4. O service aplica a regra de negócio.
5. O repository acessa o banco de dados.
6. O banco retorna os dados.
7. A resposta volta até o frontend.

Esse fluxo se repete em todas as funcionalidades principais.

---

# 6. Estrutura do Backend

O backend poderá ser organizado em pastas como:

* controllers
* services
* models
* repositories
* middlewares
* routes
* validators
* config
* utils

Essa estrutura mantém o projeto mais limpo e facilita a manutenção.

---

# 7. Estrutura do Frontend

O frontend em React poderá ser organizado em:

* pages
* components
* routes
* services
* hooks
* contexts
* assets
* styles

Essa separação ajuda na reutilização de componentes e na manutenção visual da interface.

---

# 8. Autenticação e Segurança

A autenticação será feita com JWT.

O fluxo seguirá:

* usuário faz login;
* backend valida credenciais;
* backend gera token JWT;
* frontend armazena o token;
* requisições protegidas passam a enviar o token;
* backend valida o token em cada acesso protegido.

A senha será protegida com bcrypt antes do armazenamento.

---

# 9. Módulos Principais do Sistema

## 9.1 Módulo de Usuário

Responsável por:

* cadastro;
* login;
* recuperação de senha;
* edição de perfil;
* remoção de conta.

## 9.2 Módulo de Comunidade

Responsável por:

* posts;
* comentários;
* curtidas;
* aprovação de conteúdo;
* pesquisa e filtros.

## 9.3 Módulo de Cronômetro

Responsável por:

* iniciar;
* pausar;
* registrar tempo;
* calcular XP;
* armazenar histórico.

## 9.4 Módulo de Questões com IA

Responsável por:

* receber matéria, assunto e dificuldade;
* enviar solicitação à IA externa;
* exibir a questão gerada.

## 9.5 Módulo Administrativo

Responsável por:

* aprovar posts;
* aprovar comentários;
* remover usuários;
* remover conteúdos;
* acessar painel de administração.

## 9.6 Módulo de Notificações

Responsável por:

* envio de notificações diárias no navegador.

---

# 10. Integração com API Externa de IA

O sistema consumirá uma API externa para geração de questões.

Fluxo:

1. Usuário informa matéria, assunto e dificuldade.
2. Backend monta a requisição.
3. API externa retorna a questão.
4. Backend entrega a questão ao frontend.

Essa integração não exige armazenamento da questão no banco.

---

# 11. Integração com Banco de Dados

O banco PostgreSQL armazenará:

* usuários;
* posts;
* comentários;
* likes;
* cronômetros;
* registros de autenticação e suporte ao fluxo de recuperação de senha, se necessário.

Os dados deverão ser relacionados por chaves estrangeiras e com exclusões em cascata quando aplicável.

---

# 12. Responsividade, Acessibilidade e Escalabilidade

## 12.1 Responsividade

A interface será adaptada para:

* celular;
* tablet;
* desktop.

## 12.2 Acessibilidade

O sistema deverá facilitar:

* leitura clara;
* navegação simples;
* contraste adequado;
* uso prático em dispositivos móveis.

## 12.3 Escalabilidade

A estrutura deverá permitir:

* aumento de usuários;
* crescimento da base de dados;
* adição futura de novos módulos;
* manutenção sem grande retrabalho.

---

# 13. Visão de Alto Nível da Solução

A aplicação Cola Limpa será uma solução web organizada em camadas, com separação clara entre interface, regras de negócio e banco de dados. Isso garante um sistema mais próximo de um software real e profissional, sem perder a clareza exigida em um projeto acadêmico.

---

# 14. Conclusão

A arquitetura MVC do Cola Limpa fornece uma base sólida para implementação, testes e evolução do sistema. Com frontend em React, backend em Node.js e banco PostgreSQL, o projeto mantém estrutura moderna, clara e escalável.

Próxima etapa: Estrutura física do banco de dados PostgreSQL.

