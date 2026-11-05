# CAPA

**CENTRO ESTADUAL DE EDUCAÇÃO TECNOLÓGICA PAULA SOUZA**  
**ETEC PROFª ILZA NASCIMENTO PINTUS**  
**Curso Técnico em Desenvolvimento de Sistemas**  

<br /><br />

**João Vitor Godinho Barbosa**  
**Mariane Marcelle Mineiro**  
**Thiago Paes Tristão**  
**Yasmin Pietra Massarutti**  

<br /><br /><br />

# COLA LIMPA: PLATAFORMA WEB DE PRODUTIVIDADE, ESTUDOS GAMIFICADOS E COMUNIDADE ACADÊMICA

<br /><br /><br />

**São José dos Campos - SP**  
**2026**

---

# FOLHA DE ROSTO

**João Vitor Godinho Barbosa**  
**Mariane Marcelle Mineiro**  
**Thiago Paes Tristão**  
**Yasmin Pietra Massarutti**  

<br /><br />

# COLA LIMPA: PLATAFORMA WEB DE PRODUTIVIDADE, ESTUDOS GAMIFICADOS E COMUNIDADE ACADÊMICA

<br /><br />

Trabalho de Conclusão de Curso apresentado ao Curso Técnico em Desenvolvimento de Sistemas da Escola Técnica Estadual Professora Ilza Nascimento Pintus, Centro Estadual de Educação Tecnológica Paula Souza, como requisito parcial para a obtenção do título de Técnico em Desenvolvimento de Sistemas.

**Área de Concentração:** Engenharia de Software e Desenvolvimento Web  
**Orientadora:** Prof.ª Patrícia Moreno Simões Viana  

<br /><br />

**São José dos Campos - SP**  
**2026**

---

# RESUMO

O presente trabalho apresenta o projeto e desenvolvimento do sistema **Cola Limpa**, uma aplicação web completa concebida para mitigar os efeitos da dispersão digital e da procrastinação na rotina preparatória de estudantes do ensino fundamental, médio e pré-vestibular. A plataforma combina três pilares complementares: gerenciamento estruturado do tempo por meio da Técnica Pomodoro e modalidade de Estudo Livre, mecânicas de gamificação baseadas em acúmulo de experiência (XP), progressão de níveis e monitoramento de assiduidade (*streak*), e um ambiente de comunidade colaborativa para troca de sínteses e resolução mútua de dúvidas temáticas por área do conhecimento. O projeto foi arquitetado sob o modelo Cliente-Servidor e padrão MVC desacoplado: a camada servidora foi desenvolvida em **Java 21/25** utilizando o framework **Spring Boot 3.3**, com persistência relacional em **PostgreSQL** via Spring Data JPA, documentação OpenAPI/Swagger e segurança criptográfica sem senhas (*Passwordless* OTP) integrada a tokens **JWT** (*stateless*); a interface cliente foi construída em **React 19** com **TypeScript**, empacotamento Vite e design responsivo com foco em acessibilidade e fidelidade visual. Os testes automatizados (unitários, de persistência e de integração de ponta a ponta) garantem resiliência contra vulnerabilidades comuns como IDOR e ataques de repetição (*replay attack*). O resultado final consolida uma plataforma funcional, escalável e alinhada às exigências da indústria de tecnologia e aos padrões de excelência pedagógica.

**Palavras-chave:** Produtividade Acadêmica. Técnica Pomodoro. Gamificação. Desenvolvimento Web. Spring Boot. React. Segurança Passwordless.

---

# ABSTRACT

This paper presents the design and implementation of the **Cola Limpa** web application, developed to mitigate digital distraction and procrastination among elementary, high school, and college preparatory students. The platform integrates three complementary pillars: structured time management using the Pomodoro Technique and Free Study modes, gamification mechanics powered by experience points (XP), level progression, and study streak tracking, and a collaborative community forum for sharing academic summaries and mutual peer learning indexed by subject areas. The architecture follows the decoupled Client-Server Model-View-Controller (MVC) paradigm: the backend service is built with **Java 21/25** and **Spring Boot 3.3**, relational persistence in **PostgreSQL** via Spring Data JPA, interactive OpenAPI/Swagger documentation, and stateless security leveraging passwordless One-Time Password (OTP) verification and **JSON Web Tokens (JWT)**; the client single-page application is implemented using **React 19**, **TypeScript**, Vite tooling, and accessible mobile-first styling. Comprehensive test suites (unit, repository, and end-to-end integration tests) ensure strict defense against Insecure Direct Object References (IDOR) and OTP replay attacks. The resulting software represents a robust, secure, and production-ready solution that bridges technological engineering with evidence-based study methodologies.

**Keywords:** Academic Productivity. Pomodoro Technique. Gamification. Web Development. Spring Boot. React. Passwordless Security.

---

# LISTA DE ABREVIATURAS E SIGLAS

- **ABNT** - Associação Brasileira de Normas Técnicas
- **API** - *Application Programming Interface* (Interface de Programação de Aplicação)
- **CORS** - *Cross-Origin Resource Sharing*
- **CSS** - *Cascading Style Sheets*
- **DDL** - *Data Definition Language*
- **DTO** - *Data Transfer Object*
- **ENEM** - Exame Nacional do Ensino Médio
- **ETEC** - Escola Técnica Estadual
- **HTML** - *HyperText Markup Language*
- **HTTP** - *HyperText Transfer Protocol*
- **IDOR** - *Insecure Direct Object Reference*
- **JPA** - *Java Persistence API*
- **JWT** - *JSON Web Token*
- **MVC** - *Model-View-Controller*
- **OTP** - *One-Time Password* (Senha de Uso Único)
- **REST** - *Representational State Transfer*
- **SGBD** - Sistema de Gerenciamento de Banco de Dados
- **SPA** - *Single Page Application*
- **SQL** - *Structured Query Language*
- **SSO** - *Single Sign-On*
- **TCC** - Trabalho de Conclusão de Curso
- **UML** - *Unified Modeling Language*
- **XP** - *Experience Points* (Pontos de Experiência)

---

# 1 INTRODUÇÃO

## 1.1 Contextualização e Justificativa

No ecossistema educacional contemporâneo, a transição entre o ensino fundamental, o ensino médio e os exames de acesso ao ensino superior (vestibulares e ENEM) representa um dos períodos de maior pressão cognitiva e emocional na trajetória formativa do estudante. O advento das redes sociais, a fragmentação da atenção gerada por algoritmos de recompensa imediata e a multiplicidade de fontes dispersas de informação resultam em índices alarmantes de dispersão digital, estresse crônico e procrastinação disfuncional.

Pesquisas em psicologia educacional e neurociência cognitiva demonstram que metodologias de estudo ativas — tais como a segmentação de blocos temporais com pausas programadas (Técnica Pomodoro) e o reforço positivo por meio de metas quantificáveis (Gamificação) — elevam consideravelmente a retenção de conteúdo e a sustentabilidade da rotina discente. Paralelamente, o aprendizado colaborativo mediado por pares (*peer-to-peer learning*) estimula a autoconfiança e democratiza o acesso a sínteses acadêmicas de qualidade.

Nesse cenário, evidencia-se a carência de soluções tecnológicas unificadas que combinem disciplina operacional, métricas claras de desempenho e um espaço social seguro e livre de toxicidade para troca de conhecimento. O projeto **Cola Limpa** surge como uma resposta prática e rigorosamente fundamentada a essa demanda.

## 1.2 Problematização

Como projetar e construir uma plataforma de software web escalável, intuitiva e acessível que centralize a técnica de estudos intervalados, converta a dedicação temporal em métricas gamificadas tangíveis e proporcione um ambiente comunitário autogerido e protegido contra fraudes e vulnerabilidades cibernéticas?

## 1.3 Objetivos

### 1.3.1 Objetivo Geral
Projetar, desenvolver e validar a plataforma web **Cola Limpa**, integrando módulos de temporização de estudos Pomodoro, gamificação por níveis de experiência, comunidade acadêmica e painel analítico de métricas, apoiada em uma arquitetura de microsserviços/REST moderna e padrões de alta segurança.

### 1.3.2 Objetivos Específicos
1. Modelar a arquitetura completa do sistema seguindo a decomposição MVC e notação UML (Casos de Uso, Classes, Sequência e Atividades);
2. Construir o banco de dados relacional PostgreSQL garantindo integridade referencial com ações em cascata e restrições de unicidade;
3. Desenvolver a API RESTful em Java 21/25 e Spring Boot 3.3 com validações de entrada, blindagem contra IDOR e tratamento global de exceções conforme o padrão RFC 7807 (*Problem Details*);
4. Implementar mecanismo de autenticação sem senhas fixas (*Passwordless OTP*) com validade temporal e tokens criptográficos JWT *stateless*;
5. Implementar a aplicação frontend *Single Page Application* em React 19 e TypeScript, garantindo acessibilidade (ARIA), responsividade mobile e integração assíncrona;
6. Validar a confiabilidade do sistema por meio de suítes de testes automatizados com medição de cobertura de código.

---

# 2 FUNDAMENTAÇÃO TEÓRICA

## 2.1 A Técnica Pomodoro e a Gestão Eficiente do Foco

Criada pelo italiano Francesco Cirillo no final da década de 1980, a Técnica Pomodoro fundamenta-se no princípio de que a mente humana mantém seu ápice de concentração e absorção em intervalos contínuos de curta e média duração. O método padronizado divide o trabalho em ciclos de 25 minutos de foco ininterrupto (*sprints* operacionais), intercalados por pausas curtas de 5 minutos destinadas à descompressão sináptica, seguidos por um intervalo prolongado de 15 a 30 minutos a cada quatro ciclos concluídos.

No sistema Cola Limpa, além do modelo clássico, incorporou-se a modalidade de **Estudo Livre**, permitindo cronometragens contínuas para sessões de simulados longos, aliada a um mecanismo de **prevenção biológica**: ao atingir 16 horas cumulativas contínuas, o temporizador bloqueia automaticamente a continuidade e emite alertas formais de preservação da integridade física e mental do estudante.

## 2.2 Gamificação e Recompensas Extrínsecas na Aprendizagem

A gamificação (*gamification*) consiste na aplicação de dinâmicas, mecânicas e elementos característicos de jogos (pontuações, conquistas, níveis de progressão e *feedback* sensorial) em contextos externos aos jogos propriamente ditos. Conforme as formulações teóricas da Psicologia Comportamental e da Teoria da Autodeterminação (Deci e Ryan), recompensas extrínsecas imediatas — quando alinhadas a objetivos claros — atuam como catalisadores para a consolidação de hábitos positivos duradouros.

No Cola Limpa, a gamificação é regida por fórmulas determinísticas:
- **1 Ponto de Experiência (XP)** a cada 3 minutos dedicados em foco;
- **Bonificação por Ciclo:** +25 XP pela conclusão de um bloco Pomodoro e +10 XP pelo respeito integral ao intervalo de descanso;
- **Evolução de Níveis:** Divisão progressiva em marcos de 500 XP acumulados, exibidos em uma barra de progresso visual persistente.

## 2.3 Arquitetura de Software: Padrão MVC e APIs RESTful

A arquitetura Cliente-Servidor com desacoplamento via API REST (*Representational State Transfer*) estabelece contratos estritos de comunicação via protocolo HTTP e payloads JSON. O padrão MVC (*Model-View-Controller*) garante a separação nítida de preocupações (*Separation of Concerns*):
- **Model:** Entidades de domínio JPA mapeadas no PostgreSQL e encapsulamento das regras de persistência;
- **View:** Componentes declarativos React responsáveis pela renderização da interface e manipulação do DOM virtual;
- **Controller:** Controladores RESTful Spring Boot encarregados de receber requisições HTTP, despachar para os serviços e devolver respostas com códigos de status padronizados.

## 2.4 Segurança da Informação: Passwordless OTP e JWT Stateless

A persistência de credenciais tradicionais (senhas alfanuméricas) constitui um dos principais vetores de vulnerabilidade em aplicações web (vazamentos em lote, senhas fracas, ataques de dicionário e reutilização de credenciais). Em conformidade com as recomendações do NIST SP 800-63B, o Cola Limpa adotou uma arquitetura **Passwordless OTP (One-Time Password)**:
1. O usuário informa seu e-mail cadastrado;
2. O sistema gera um código criptograficamente seguro de 6 dígitos com janela de expiração estrita de 5 minutos, limite de 4 solicitações diárias e trava de reenvio em 30 segundos;
3. O código é validado via hash e imediatamente consumido (*flag* `utilizado = true`), impedindo ataques de repetição (*replay attack*);
4. O servidor emite um token **JWT (JSON Web Token)** assinado digitalmente com chave simétrica HMAC-SHA256, contendo identificador, e-mail e papéis administrativos (`ROLE_USER`, `ROLE_ADMIN`). As requisições subsequentes são validadas de maneira estritamente *stateless* via filtro interceptador.

---

# 3 METODOLOGIA E ENGENHARIA DE SOFTWARE

## 3.1 Processo de Desenvolvimento

O projeto foi conduzido com base em métodos ágeis de engenharia de software (Scrum adaptado combinado a Kanban), com iterações curtas (Sprints), revisões contínuas e planos formais de implementação técnica (IP - *Implementation Plans*).

## 3.2 Elicitação de Requisitos

A análise de requisitos delimitou rigorosamente o escopo do sistema entre requisitos funcionais e não funcionais:

### Requisitos Funcionais de Destaque:
- **[RF01] Autenticação Passwordless:** Cadastro e login via código numérico de 6 dígitos enviado ao e-mail ou integração com SSO Google.
- **[RF02] Cronômetro Pomodoro e Livre:** Gestão temporal de ciclos com contagem regressiva e progressiva, persistência de histórico e limite biológico de segurança.
- **[RF03] Atribuição e Progressão de XP:** Cálculo e persistência automática de pontos de experiência e níveis de perfil.
- **[RF04] Fórum Colaborativo (Feed):** Publicação, edição, exclusão e pesquisa de notas temáticas organizadas por matérias (Matemática, Português, Química, História, Física, Biologia).
- **[RF05] Sistema de Comentários Interativo:** Interação textual unívoca por publicação com ordenação cronológica e contadores dinâmicos.
- **[RF06] Curtidas e Engajamento:** Sistema de likes unívocos para posts e comentários com proteção transacional contra votos duplicados.
- **[RF07] Moderação Comunitária Distribuída:** Publicação em tempo real com ocultação preventiva automatizada quando o volume de denúncias atinge o limiar operacional, submetendo o conteúdo ao Painel Administrativo.
- **[RF08] Painel Analítico (Dashboard):** Mapeamento gráfico da carga horária semanal de estudos, monitoramento de metas diárias e cálculo dinâmico de assiduidade (*streak* de dias consecutivos).

### Requisitos Não Funcionais de Destaque:
- **[RNF01] Responsividade Multiplataforma:** Adequação perfeita de layouts para smartphones, tablets e computadores de mesa.
- **[RNF02] Segurança e Blindagem contra IDOR:** Proibição de injeção manual de chaves de usuário em payloads mutantes; a identidade é resolvida via contexto de autenticação do token JWT.
- **[RNF03] Baixa Latência e Sessões Stateless:** Servidor desprovido de estado em memória de sessão HTTP, garantindo escalabilidade horizontal.
- **[RNF04] Documentação Viva:** Disponibilização da especificação interativa da API via OpenAPI 3.0 / Swagger UI.

## 3.3 Modelagem Física de Dados (PostgreSQL)

O esquema relacional é estruturado em seis tabelas essenciais interligadas por chaves estrangeiras com remoção em cascata (`ON DELETE CASCADE`):

| Tabela | Finalidade Operacional | Chaves e Restrições Principais |
| :--- | :--- | :--- |
| `usuario` | Registro de perfil, e-mail, telefone, XP e meta de estudo diária | `PRIMARY KEY (id)`, `UNIQUE (email)`, `UNIQUE (telefone)` |
| `codigo_autenticacao` | Códigos numéricos OTP, prazo de expiração e flag de consumo | `FOREIGN KEY (usuario_id) REFERENCES usuario(id)` |
| `post` | Publicações temáticas do feed, curtidas e denúncias acumuladas | `FOREIGN KEY (usuario_id) REFERENCES usuario(id)` |
| `comentario` | Respostas e colaborações vinculadas aos posts | `FOREIGN KEY (post_id)`, `FOREIGN KEY (usuario_id)` |
| `like` | Votos unívocos associados a um post ou a um comentário | `UNIQUE (usuario_id, post_id)`, `UNIQUE (usuario_id, comentario_id)` |
| `cronometro_historico` | Registro detalhado de sessões temporizadas e XP obtido | `FOREIGN KEY (usuario_id) REFERENCES usuario(id)` |

---

# 4 IMPLEMENTAÇÃO DO SISTEMA

## 4.1 Camada Servidora (Backend)

Construído sob o ecossistema Spring Boot 3.3:
- **`SecurityConfig` e `JwtAuthenticationFilter`:** Filtro de interceptação que decodifica o cabeçalho `Authorization: Bearer <token>`, carrega o `UsuarioPrincipal` no `SecurityContextHolder` e assegura que apenas usuários autenticados invoquem operações de mutação.
- **Documentação Swagger / OpenAPI (`OpenApiConfig`):** Integração com `springdoc-openapi` expondo endpoints e modelos documentados no caminho `/swagger-ui.html`.
- **Serviço de Mensageria:** Abstração `EmailSenderService` com implementação em log para ambiente local (`ConsoleEmailSenderService`) e despacho real via protocolo SMTP (`SmtpEmailSenderService`) acionado condicionalmente via propriedades de ambiente.
- **Tratamento de Exceções Centralizado:** `GlobalExceptionHandler` anotado com `@RestControllerAdvice`, padronizando erros de validação e regras de negócio no formato estruturado `ProblemDetail` (RFC 7807).

## 4.2 Camada Cliente (Frontend)

Construído com React 19 e TypeScript:
- **Componentização Modular:** Separação estrita entre componentes apresentacionais puros (`PostCard`, `CommentItem`, `Dashboard`) e orquestradores de estado (`App`, `CommunityFeed`).
- **Custom Hooks Reutilizáveis:**
  - `usePomodoro`: Gerenciamento do temporizador em memória, cálculo progressivo/regressivo de segundos, efeitos visuais com confetes e disparo de notificações sonoras e nativas do navegador via Web Notification API.
  - `useComments`: Isolamento de chamadas assíncronas de listagem, inserção, curtida e denúncia de comentários.
  - `useAuth`: Gerenciamento centralizado de autenticação, persistência de token no `localStorage` e escuta a eventos globais de encerramento de sessão.
- **Design System Temático e Responsivo:** Folha de estilos sem dependências pesadas, utilizando variáveis nativas CSS com paleta de cores institucional em tons terrosos e dourados (#362317, #C57D1E, #FAF5ED), inspirada em materiais de estudo tradicionais combinados com modernidade digital.

---

# 5 RESULTADOS, TESTES E DISCUSSÕES

## 5.1 Demonstração dos Módulos Funcionais

1. **Página Inicial (Landing Page):** Apresentação visual da proposta de valor, estatísticas da plataforma e botões diretos de ação rápida ("Iniciar Pomodoro" e "Ver Publicações").
2. **Temporizador Pomodoro e Estudo Livre:** Mostrador vetorial SVG circular com transição suave, seletor de modalidades (Foco, Pausa Curta, Pausa Longa e Estudo Livre) e painel com contadores de sessões diárias.
3. **Feed Acadêmico e Seção de Comentários:** Campo de busca em tempo real por título, texto ou autor, barra de filtros temáticos por disciplina, ordenação por mais recentes ou populares e expansão retrátil da seção de comentários em cada postagem.
4. **Painel Analítico de Desempenho:** Cards com métricas consolidadas (XP total, sessões cumpridas, minutos de foco diário, sequência de dias consecutivos calculada dinamicamente) e gráfico semanal responsivo de dedicação.
5. **Painel de Moderação Administrativa:** Interface restrita a usuários com perfil de administrador (`ROLE_ADMIN`), exibindo filas segregadas de publicações e comentários com alto índice de denúncias, permitindo a restauração ou exclusão definitiva com um único clique.

## 5.2 Validação por Testes Automatizados

A robustez da solução foi aferida por meio de rigorosa suíte de testes:
- **Backend:** Testes unitários com Mockito cobrindo regras de negócio e cálculo de XP nos serviços, testes de camada web com `MockMvc` validando códigos de status HTTP, testes de repositório contra banco em memória H2 em modo compatível com PostgreSQL, e testes de integração de ponta a ponta (`SecurityIntegrationE2ETest`) certificando o fluxo completo de emissão e consumo de OTP e proteção contra ataques de repetição.
- **Frontend:** Testes de componentes e hooks executados via Vitest e React Testing Library, atestando renderização correta de cards, formulários de autenticação, validação de entradas numéricas e acessibilidade.

---

# 6 CONSIDERAÇÕES FINAIS E TRABALHOS FUTUROS

O projeto **Cola Limpa** atingiu integralmente seus objetivos pedagógicos e técnicos, consolidando-se como uma plataforma robusta, elegante e de alto impacto social para estudantes. A combinação harmoniosa entre metodologias consagradas de estudo (Pomodoro), incentivo psicológico por gamificação e apoio mútuo em comunidade comprovou ser uma resposta viável e eficaz aos desafios contemporâneos da procrastinação juvenil.

Como perspectivas de evolução para versões futuras da plataforma, apontam-se:
1. **Aplicativo Mobile Nativo:** Desenvolvimento de versão mobile em React Native ou Flutter com sincronização em segundo plano de sessões offline;
2. **Recomendação Inteligente de Cronogramas:** Incorporação de modelos de inteligência artificial generativa para montagem de planos de revisão customizados com base no histórico de matérias mais estudadas;
3. **Salas de Estudo Coletivas em Tempo Real:** Criação de salas virtuais com Pomodoro sincronizado via WebSockets para grupos de estudo simultâneos.

---

# REFERÊNCIAS BIBLIOGRÁFICAS

ASSOCIATION FOR COMPUTING MACHINERY. **ACM Code of Ethics and Professional Conduct**. New York: ACM, 2018. Disponível em: https://www.acm.org/code-of-ethics. Acesso em: 15 out. 2026.

BRASIL. Ministério da Educação. **Base Nacional Comum Curricular (BNCC)**. Brasília: MEC, 2018.

CIRILLO, Francesco. **The Pomodoro Technique: The Acclaimed Time-Management System That Has Transformed How We Work**. New York: Currency, 2018.

DECI, Edward L.; RYAN, Richard M. **Self-Determination Theory: Basic Psychological Needs in Motivation, Development, and Wellness**. New York: Guilford Press, 2017.

GAMMA, Erich; HELM, Richard; JOHNSON, Ralph; VLISSIDES, John. **Padrões de Projeto: Soluções Reutilizáveis de Software Orientado a Objetos**. Porto Alegre: Bookman, 2000.

GOOGLE INC. **Google Identity Services: Sign In With Google Reference**. Mountain View: Google Developers, 2026. Disponível em: https://developers.google.com/identity/gsi/web. Acesso em: 20 out. 2026.

IETF - INTERNET ENGINEERING TASK FORCE. **RFC 7519: JSON Web Token (JWT)**. Fremont: IETF Trust, 2015. Disponível em: https://datatracker.ietf.org/doc/html/rfc7519. Acesso em: 22 out. 2026.

IETF - INTERNET ENGINEERING TASK FORCE. **RFC 7807: Problem Details for HTTP APIs**. Fremont: IETF Trust, 2016. Disponível em: https://datatracker.ietf.org/doc/html/rfc7807. Acesso em: 24 out. 2026.

MARTIN, Robert C. **Clean Architecture: A Craftsman's Guide to Software Structure and Design**. Boston: Prentice Hall, 2017.

META PLATFORMS. **React Documentation: The Library for Web and Native User Interfaces**. Menlo Park: Meta Open Source, 2026. Disponível em: https://react.dev/. Acesso em: 18 out. 2026.

NIST - NATIONAL INSTITUTE OF STANDARDS AND TECHNOLOGY. **Special Publication 800-63B: Digital Identity Guidelines - Authentication and Lifecycle Management**. Gaithersburg: U.S. Department of Commerce, 2020. Disponível em: https://pages.nist.gov/800-63-3/sp800-63b.html. Acesso em: 28 out. 2026.

POSTGRESQL GLOBAL DEVELOPMENT GROUP. **PostgreSQL 16 Documentation**. [S. l.]: PostgreSQL, 2026. Disponível em: https://www.postgresql.org/docs/16/index.html. Acesso em: 25 out. 2026.

PRESSMAN, Roger S.; MAXIM, Bruce R. **Engenharia de Software: Uma Abordagem Profissional**. 9. ed. Porto Alegre: AMGH, 2021.

SPRING BOOT TEAM. **Spring Boot Reference Documentation: Version 3.3.x**. San Francisco: VMware Tanzu, 2026. Disponível em: https://docs.spring.io/spring-boot/docs/current/reference/html/. Acesso em: 10 out. 2026.

SWAGGER OPENAPI. **OpenAPI Specification v3.0.3**. SmartBear Software, 2026. Disponível em: https://swagger.io/specification/. Acesso em: 12 out. 2026.
