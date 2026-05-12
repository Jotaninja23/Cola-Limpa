# Documento 1 — Requisitos Funcionais e Não Funcionais

## Projeto: Cola Limpa

---

# 1. Introdução

O sistema Cola Limpa é uma plataforma web voltada para estudantes do ensino fundamental e médio que desejam melhorar seus estudos para vestibulares e provas acadêmicas.

O objetivo principal da plataforma é auxiliar estudantes através de:

* métodos de estudo baseados em pesquisas;
* comunidade de discussão;
* acompanhamento de tempo de estudo;
* geração de questões com inteligência artificial.

O sistema será desenvolvido utilizando arquitetura MVC e APIs REST, com foco em escalabilidade, acessibilidade e responsividade mobile.

---

# 2. Objetivo do Sistema

O sistema possui como objetivo:

* incentivar hábitos saudáveis de estudo;
* permitir interação entre estudantes;
* registrar tempo de estudo;
* disponibilizar questões geradas por IA;
* fornecer ambiente organizado para dúvidas e dicas de vestibular.

---

# 3. Tipo de Sistema

O projeto será desenvolvido como:

* aplicação web;
* arquitetura cliente-servidor;
* frontend separado do backend;
* comunicação via API REST;
* autenticação utilizando JWT.

---

# 4. Tecnologias Utilizadas

## 4.1 Frontend

* React
* HTML
* CSS
* TypeScript

## 4.2 Backend

* Node.js
* Express
* TypeScript

## 4.3 Banco de Dados

* PostgreSQL

## 4.4 Segurança

* JWT
* bcrypt

## 4.5 Serviços Externos

* API de Inteligência Artificial externa para geração de questões.

---

# 5. Tipos de Usuários

## 5.1 Visitante

Usuário não autenticado no sistema.

Permissões:

* visualizar posts aprovados;
* visualizar comentários aprovados;
* visualizar conteúdos educativos do site.

Restrições:

* não pode comentar;
* não pode postar;
* não pode utilizar cronômetro;
* não pode curtir;
* não pode responder questões.

---

## 5.2 Usuário Comum

Usuário autenticado na plataforma.

Permissões:

* criar posts;
* comentar;
* utilizar cronômetro;
* responder questões;
* editar perfil;
* curtir posts;
* curtir comentários.

---

## 5.3 Administrador

Usuário com permissões administrativas.

Permissões:

* aprovar posts;
* aprovar comentários;
* remover posts;
* remover comentários;
* remover usuários;
* acessar painel administrativo.

---

# 6. Funcionalidades Principais

## 6.1 Cadastro de Usuário

O sistema deverá permitir:

* cadastro utilizando email ou telefone;
* definição de senha;
* validação de código de verificação;
* armazenamento de senha criptografada.

Regras:

* email deve ser único;
* telefone deve ser único;
* pelo menos um dos dois deve ser obrigatório.

---

## 6.2 Login

O sistema deverá permitir:

* autenticação via email ou telefone;
* geração de token JWT;
* logout automático por tempo de sessão.

---

## 6.3 Recuperação de Senha

O sistema deverá:

* enviar código de recuperação;
* permitir escolha entre email ou telefone;
* permitir redefinição da senha.

Regras:

* código expira em 5 minutos;
* reenvio permitido a cada 30 segundos;
* máximo de 4 códigos por dia.

---

## 6.4 Sistema de Posts

Usuários autenticados poderão:

* criar posts;
* editar posts próprios;
* visualizar posts aprovados;
* pesquisar posts.

Cada post possuirá:

* título;
* texto;
* categoria;
* matéria;
* quantidade de curtidas;
* data de criação.

Regras:

* posts precisam de aprovação administrativa;
* posts não aprovados ficam invisíveis publicamente;
* usuário deve visualizar mensagem de “aguardando aprovação”.

---

## 6.5 Sistema de Comentários

Usuários autenticados poderão:

* comentar em posts;
* curtir comentários.

Regras:

* comentários precisam de aprovação;
* comentários não possuem respostas encadeadas;
* comentários removidos são apagados permanentemente.

---

## 6.6 Sistema de Curtidas

O sistema permitirá:

* curtidas em posts;
* curtidas em comentários.

Regras:

* usuário pode curtir apenas uma vez;
* curtidas serão controladas por tabela específica;
* sistema armazenará quantidade total de curtidas.

---

# 7. Sistema de Cronômetro

O sistema possuirá cronômetro manual de estudo.

Funcionalidades:

* iniciar cronômetro;
* pausar cronômetro;
* registrar histórico;
* registrar data e horário.

Regras:

* cronômetro não pode ser negativo;
* limite máximo de 16 horas;
* sistema exibe aviso de saúde ao atingir limite;
* cronômetro pausa ao fechar a aba;
* tempo permanece salvo para próxima sessão.

---

# 8. Sistema de Questões com IA

O sistema deverá:

* gerar questões individualmente;
* utilizar API externa de IA;
* exibir alternativas A, B, C, D e E.

O usuário deverá informar:

* matéria;
* assunto;
* dificuldade.

Regras:

* questões não serão armazenadas;
* não haverá histórico de desempenho;
* sistema apenas gera próxima questão.

---

# 9. Sistema de XP

O sistema possuirá mecânica de experiência (XP).

Regras:

* 1 XP a cada 3 minutos estudados;
* 1 XP por questão respondida.

O sistema exibirá:

* XP total do usuário.

---

# 10. Sistema de Busca e Filtros

O sistema deverá permitir:

* pesquisa por título;
* filtro por matéria;
* filtro por categoria;
* ordenação por popularidade;
* ordenação por data.

---

# 11. Sistema de Notificações

O sistema deverá enviar:

* uma notificação diária no navegador incentivando estudos.

---

# 12. Foto de Perfil

O usuário poderá:

* adicionar foto de perfil;
* alterar foto de perfil.

Regra:

* sistema armazenará apenas URL da imagem.

---

# 13. Regras de Remoção

## 13.1 Remoção de Usuário

Quando um usuário for removido:

* posts serão apagados;
* comentários serão apagados;
* históricos de cronômetro serão apagados.

---

## 13.2 Remoção de Posts

Quando um post for removido:

* comentários relacionados também serão removidos.

---

# 14. Requisitos Não Funcionais

## 14.1 Responsividade

O sistema deverá funcionar corretamente em:

* celulares;
* tablets;
* desktops.

---

## 14.2 Escalabilidade

O sistema deverá possuir estrutura compatível com:

* crescimento de usuários;
* expansão futura de funcionalidades;
* separação frontend/backend.

---

## 14.3 Segurança

O sistema deverá:

* utilizar senhas criptografadas;
* utilizar autenticação JWT;
* proteger rotas privadas;
* validar permissões administrativas.

---

## 14.4 Acessibilidade

O sistema deverá:

* possuir navegação responsiva;
* utilizar contraste adequado;
* permitir boa leitura em dispositivos móveis.

---

# 15. Arquitetura do Sistema

O sistema seguirá:

* arquitetura MVC;
* frontend React;
* backend Node.js;
* API REST;
* banco PostgreSQL.

Fluxo principal:
Frontend → API REST → Backend → Banco de Dados.

---

# 16. Considerações Finais

O sistema Cola Limpa será desenvolvido com estrutura próxima de aplicações profissionais reais, priorizando:

* organização;
* modularização;
* escalabilidade;
* segurança;
* experiência do usuário.

