<div align="center">
  <h1>Cola Limpa</h1>
  <p><strong>Plataforma Web de Produtividade, Estudos Gamificados e Comunidade Acadêmica</strong></p>

  <p>
    <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Java_25-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 25" />
    <img src="https://img.shields.io/badge/Spring_Boot_3.3-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot 3.3" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/JSON_Web_Tokens-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
    <img src="https://img.shields.io/badge/Apache_Maven-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white" alt="Maven" />
    <img src="https://img.shields.io/badge/Oxlint-1A1A1A?style=for-the-badge&logo=oxc&logoColor=white" alt="Oxlint" />
  </p>
</div>

---

## 1. Visão Geral do Projeto

O **Cola Limpa** é uma solução de software desenvolvida para mitigar os impactos da dispersão digital e da procrastinação na rotina preparatória de estudantes do ensino fundamental, médio e pré-vestibular. A plataforma centraliza o gerenciamento do tempo, a aplicação de metodologias de estudo ativas e o suporte mútuo em um ambiente virtual estruturado.

O projeto foi concebido e estruturado como Trabalho de Conclusão de Curso (TCC) para obtenção do título de Técnico em Desenvolvimento de Sistemas pelo Centro Estadual de Educação Tecnológica Paula Souza (**ETEC**).

---

## 2. Pilares Funcionais

### 2.1. Gestão de Tempo e Técnica Pomodoro
- **Ciclos Temporizados Estruturados:** Automatização do intervalo clássico de 25 minutos de foco contínuo, intercalados por pausas curtas de 5 minutos e pausas estendidas de 15 minutos ao término de quatro blocos de foco.
- **Interface Visual Vetorial:** Indicador circular SVG com interpolação de progresso e alteração contextual de estado operacional.
- **Modalidades de Estudo:** Suporte alternativo entre regime de Pomodoro automatizado e estudo livre sem interrupção programada.
- **Mecanismos de Prevenção Biológica:** Travamento operacional de sessões contínuas após 16 horas cumulativas, exibindo alertas de preservação à saúde física e mental.

### 2.2. Gamificação e Sistema de Níveis
- **Cálculo de Experiência (XP):** Atribuição proporcional de 1 ponto de experiência a cada 3 minutos de dedicação em foco, com bonificação por encerramento de ciclos Pomodoro (+25 XP por bloco de foco e +10 XP por intervalo respeitado).
- **Progressão Linear:** Divisão de categorias de nível a cada marco de 500 XP acumulados, representada em barra de evolução persistente.
- **Feedback Estético Imediato:** Disparo de notificações visuais com renderização de partículas dinâmicas no cumprimento de metas.

### 2.3. Comunidade Acadêmica e Fórum Colaborativo
- **Publicação e Categorização Temática:** Compartilhamento de notas, sínteses e dúvidas acadêmicas indexadas por área do conhecimento (Matemática, Português, Química, História, Física e Biologia).
- **Interações Unívocas:** Mecanismo de curtidas e réplicas por comentários com integridade de unicidade transacional.
- **Moderação Comunitária Distribuída:** Publicação em tempo real sem barreira prévia de moderação; conteúdos com volume de denúncias acima do limiar operacional (`qt_denuncias >= X`) são ocultados preventivamente até despacho por um administrador.

### 2.4. Painel Analítico de Desempenho
- **Estatísticas Consolidadas:** Registro e agregação de tempo diário dedicado, total de sessões concluídas e índice de assiduidade contínua (*streak* de dias consecutivos).
- **Mapeamento Semanal:** Gráfico analítico comparativo da carga de estudos ao longo dos dias da semana para mensuração de consistência.

### 2.5. Autenticação e Gestão de Acessos
- **Arquitetura Passwordless:** Autenticação sem persistência de credenciais fixas (senhas), viabilizada pelo envio de códigos numéricos de uso único (OTP) de 6 dígitos ao endereço de e-mail verificado (tempo de expiração de 5 minutos, intervalo de reenvio de 30 segundos e teto de 4 requisições diárias).
- **Single Sign-On (SSO):** Delegação federada de identidade via protocolo OAuth2 com Google e GitHub.
- **Sessões Stateless:** Autorização controlada por tokens criptográficos padrão JWT (JSON Web Token) acompanhada de cifras bcrypt para dados sensíveis.

---

## 3. Arquitetura do Sistema e Stack Tecnológica

O sistema foi modelado sob a arquitetura Cliente-Servidor adotando o padrão arquitetural MVC (Model-View-Controller) com desacoplamento rigoroso entre as camadas de apresentação, controle, serviço e persistência de dados.

```
                      +-----------------------------+
                      |   Cliente Web (Frontend)    |
                      |   React 19 + TypeScript     |
                      +--------------+--------------+
                                     |
                                     | Protocolo HTTPS / REST API
                                     v
                      +-----------------------------+
                      |    Controladores REST       |
                      |      Spring Boot 3.3        |
                      +--------------+--------------+
                                     |
                                     v
                      +-----------------------------+
                      |    Camada de Serviços       |
                      |    Regras de Negócio e XP   |
                      +--------------+--------------+
                                     |
                                     v
                      +-----------------------------+
                      |   Camada de Persistência    |
                      |     Spring Data JPA         |
                      +--------------+--------------+
                                     |
                                     v
                      +-----------------------------+
                      |    Banco de Dados           |
                      |    PostgreSQL               |
                      +-----------------------------+
```

### 3.1. Frontend
- **Interface e Tipagem:** React 19, TypeScript
- **Ferramental de Construção:** Vite
- **Iconografia e Efeitos:** Lucide React, Canvas-Confetti
- **Análise Estática de Código:** Oxlint
- **Estilização:** CSS modular e semântico com variáveis nativas e adequação responsiva multi-dispositivo

### 3.2. Backend
- **Ambiente de Execução:** Java 25 (OpenJDK)
- **Framework Principal:** Spring Boot 3.3.2
  - `spring-boot-starter-web`: Implementação dos endpoints REST e mapeamento de DTOs
  - `spring-boot-starter-data-jpa`: Mapeamento Objeto-Relacional (ORM via Hibernate)
  - `spring-boot-starter-test`: Testes unitários e determinísticos
- **Gerenciamento de Dependências:** Apache Maven

### 3.3. Banco de Dados
- **SGBDR:** PostgreSQL
- **Modelagem Relacional:** Tabelas `usuario`, `post`, `comentario`, `like`, `cronometro_historico` e `codigo_autenticacao`.
- **Integridade:** Chaves primárias, chaves estrangeiras com regras de remoção em cascata (`ON DELETE CASCADE`), restrições de unicidade e indexação de campos de alta cardinalidade de busca.

---

## 4. Estrutura de Diretórios

```text
Cola-Limpa/
├── docs/                                # Documentação técnica e especificações acadêmicas
│   ├── etec/
│   │   └── TCC_Cola_Limpa.md            # Monografia nos padrões acadêmicos
│   └── uml/
│       ├── Requisitos.md                # Requisitos Funcionais e Não Funcionais
│       ├── Arquitetura_do_Sistema.md    # Decomposição MVC e mapeamento de camadas
│       ├── Diagrama_de_Casos_de_Uso.md  # Atores e interações formais
│       ├── Diagrama_de_Classes.md       # Diagramação orientada a objetos das entidades
│       ├── Diagrama_de_Sequencia.md     # Representação temporal dos fluxos principais
│       ├── Diagrama_de_Atividades.md    # Árvores de decisão e regras do sistema
│       └── Estrutura_Fisica_Banco_de_Dados.md # DDL e restrições relacionais PostgreSQL
├── frontend/                            # Aplicação cliente (Single Page Application)
│   ├── src/
│   │   ├── components/
│   │   │   ├── PomodoroTimer.tsx        # Componente interativo do temporizador
│   │   │   ├── CommunityFeed.tsx        # Feed de postagens, filtros e interações
│   │   │   └── Dashboard.tsx            # Visualização analítica de métricas semanais
│   │   ├── hooks/
│   │   │   └── usePomodoro.ts           # Hook customizado de controle do temporizador
│   │   ├── App.tsx                      # Orquestração de estado global, níveis e rotas
│   │   ├── App.css                      # Regras de estilo da aplicação
│   │   └── main.tsx                     # Ponto de inicialização da árvore React
│   ├── package.json                     # Metadados de dependências do frontend
│   └── vite.config.ts                   # Parâmetros de compilação do Vite
├── src/                                 # Aplicação servidora (API RESTful)
│   ├── main/
│   │   ├── java/com/colalimpa/
│   │   │   └── ColaLimpaApplication.java# Ponto de entrada Spring Boot
│   │   └── resources/
│   │       └── application.properties   # Parâmetros de infraestrutura e persistência
│   └── test/                            # Bateria de testes automatizados
├── Dockerfile                           # Especificação de contêiner do backend
├── docker-compose.yml                   # Orquestração dos serviços (PostgreSQL, Backend, Frontend)
├── pom.xml                              # Manifesto de dependências do Maven
└── README.md                            # Guia mestre do repositório
```

---

## 5. Instruções para Execução em Ambiente de Desenvolvimento

### 5.1. Pré-requisitos de Ambiente
- Node.js (versão 18.x ou superior)
- Java Development Kit (JDK 21 ou 25)
- Apache Maven (versão 3.8.x ou superior)
- PostgreSQL (versão 14.x ou superior)

---

### 5.2. Configuração da Base de Dados

Execute a criação do esquema no console do PostgreSQL:

```sql
CREATE DATABASE colalimpa;
```

Certifique-se de que os parâmetros de acesso no arquivo `src/main/resources/application.properties` correspondam ao seu ambiente:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/colalimpa
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=update
```

---

### 5.3. Execução do Servidor Backend

A partir da raiz do repositório:

```bash
# Compilação e resolução das dependências do Maven
mvn clean package

# Inicialização do serviço Spring Boot
mvn spring-boot:run
```

O serviço da API REST será exposto em `http://localhost:8080`.

---

### 5.4. Execução da Aplicação Frontend

A partir do diretório `frontend`:

```bash
cd frontend

# Instalação dos pacotes de dependências
npm install

# Inicialização do servidor de desenvolvimento
npm run dev
```

A interface estará acessível via navegador em `http://localhost:5173`.

Rotinas auxiliares disponíveis:
```bash
npm run build    # Compilação TypeScript e empacotamento para distribuição
npm run lint     # Análise estática com Oxlint
npm run preview  # Execução local do pacote compilado de produção
```

---

### 5.5. Execução Completa via Docker Compose

Para subir toda a infraestrutura (Banco PostgreSQL, Backend Spring Boot e Frontend React) de forma orquestrada e automatizada:

```bash
# Inicialização de todos os serviços em segundo plano
docker compose up -d --build
```

Endpoints disponíveis após a inicialização:
- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:8080`
- **PostgreSQL:** `localhost:5432`

> **Nota:** Caso você já possua uma instância local do PostgreSQL em execução na porta `5432` da máquina hospedeira, defina uma porta alternativa para o banco no arquivo `.env` ou via comando:
> ```bash
> POSTGRES_PORT=5433 docker compose up -d --build
> ```

Para interromper os serviços:
```bash
docker compose down
```

---

## 6. Documentação Técnica

Para consulta às especificações formais de engenharia, consulte os documentos localizados no diretório `docs/`:

- [Especificação de Requisitos Funcionais e Não Funcionais](docs/uml/Requisitos.md)
- [Arquitetura de Camadas e Modelo MVC](docs/uml/Arquitetura_do_Sistema.md)
- [Diagrama e Especificação de Casos de Uso](docs/uml/Diagrama_de_Casos_de_Uso.md)
- [Diagrama de Classes e Responsabilidade de Domínio](docs/uml/Diagrama_de_Classes.md)
- [Estrutura Física do Banco de Dados PostgreSQL](docs/uml/Estrutura_Fisica_Banco_de_Dados.md)
- [Diagramas de Sequência de Operações](docs/uml/Diagrama_de_Sequencia.md)
- [Diagramas de Atividades e Tomada de Decisão](docs/uml/Diagrama_de_Atividades.md)
- [Monografia Acadêmica do Trabalho de Conclusão de Curso](docs/etec/TCC_Cola_Limpa.md)

---

## 7. Corpo Discente e Orientação

- **João Vitor Godinho Barbosa**
- **Mariane Marcelle Mineiro**
- **Thiago Paes Tristão**
- **Yasmin Pietra Massarutti**

**Orientação Acadêmica:** Prof.ª Patrícia Moreno Simões Viana  
**Instituição de Ensino:** Centro Estadual de Educação Tecnológica Paula Souza - ETEC

---

## 8. Termos de Uso e Licença

Desenvolvido para fins de pesquisa, qualificação técnica e desenvolvimento educacional. Direitos de propriedade intelectual reservados aos autores e à instituição formadora.
