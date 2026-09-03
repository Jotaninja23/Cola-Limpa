# CAPA

CENTRO ESTADUAL DE EDUCAÇÃO TECNOLÓGICA PAULA SOUZA
ETEC PROFª ILZA NASCIMENTO PINTUS
Técnico em Desenvolvimento de Sistemas

João Vitor Godinho Barbosa
Mariane Marcelle Mineiro
Thiago Paes Tristão
Yasmin Pietra Massarutti

COLA LIMPA

São José dos Campos-SP
2026

---

# FOLHA DE ROSTO

João Vitor Godinho Barbosa
Mariane Marcelle Mineiro
Thiago Paes Tristão
Yasmin Pietra Massarutti

COLA LIMPA

Trabalho de Conclusão de Curso apresentado ao Curso Técnico em Desenvolvimento de Sistemas da Etec Profª Ilza Nascimento Pintus de São José dos Campos, orientado pela Prof.ª Patrícia Moreno Simões Viana, como requisito parcial para obtenção do título de Técnico em Desenvolvimento de Sistemas.

São José dos Campos-SP
2026

---

# RESUMO

O presente trabalho descreve o desenvolvimento do sistema "Cola Limpa", uma plataforma web voltada para estudantes do ensino fundamental e médio que desejam otimizar sua preparação para vestibulares e exames acadêmicos. O objetivo principal do projeto é incentivar hábitos saudáveis de estudo e reduzir a procrastinação por meio de uma comunidade colaborativa, onde os usuários podem compartilhar dicas, tirar dúvidas e registrar seu tempo de dedicação. A plataforma integra a técnica Pomodoro, metas de estudo diárias ou semanais e uma mecânica de gamificação com sistema de experiência (XP) e gráficos de desempenho, visando manter o engajamento contínuo dos alunos. Do ponto de vista técnico, o sistema foi estruturado em uma arquitetura cliente-servidor (MVC) utilizando React e TypeScript no frontend, Java com Spring Boot no backend, e PostgreSQL como banco de dados relacional. A comunicação entre as camadas é feita via API REST, com segurança garantida por tokens JWT e autenticação Single Sign-On (SSO). O resultado é uma aplicação moderna, responsiva, escalável e focada na experiência do usuário e acessibilidade.

Palavras-chave: Educação. Pomodoro. Gamificação. Desenvolvimento Web. Comunidade.

---

# ABSTRACT

The present work describes the development of the "Cola Limpa" system, a web platform aimed at elementary and high school students who wish to optimize their preparation for university entrance exams and academic tests. The main objective of the project is to encourage healthy study habits and reduce procrastination through a collaborative community where users can share tips, ask questions, and record their study time. The platform integrates the Pomodoro technique, daily or weekly study goals, and a gamification mechanic with an experience system (XP) and performance graphs, aiming to maintain continuous student engagement. From a technical standpoint, the system was structured in a client-server architecture (MVC) using React and TypeScript on the frontend, Java with Spring Boot on the backend, and PostgreSQL as the relational database. Communication between the layers is handled via REST API, with security ensured by JWT tokens and Single Sign-On (SSO) authentication. The result is a modern, responsive, scalable application focused on user experience and accessibility.

Keywords: Education. Pomodoro. Gamification. Web Development. Community.

---

# 1 INTRODUÇÃO

No cenário educacional contemporâneo, a preparação para exames acadêmicos e vestibulares é um dos momentos mais desafiadores para estudantes do ensino fundamental e médio. A quantidade massiva de conteúdos a serem absorvidos, combinada com as distrações digitais constantes, frequentemente resulta em procrastinação e desmotivação. É comum que os alunos encontrem dificuldades não apenas em organizar sua rotina de estudos, mas também em manter a disciplina necessária para alcançar suas metas acadêmicas.

Diante dessa problemática, surge a necessidade de ferramentas tecnológicas que auxiliem na gestão do tempo e promovam o engajamento dos estudantes. O projeto "Cola Limpa" foi idealizado como uma solução para esses desafios. Trata-se de uma plataforma web interativa que combina metodologias de estudo comprovadas, como a técnica Pomodoro, com mecânicas de gamificação. Ao transformar o ato de estudar em uma experiência mais dinâmica e recompensadora, o sistema busca incentivar a criação de hábitos saudáveis e consistentes.

Além do gerenciamento de tempo e das recompensas (XP), a plataforma se destaca por seu viés social. O "Cola Limpa" oferece um espaço de comunidade colaborativa onde os usuários podem criar publicações, compartilhar dicas e interagir, fomentando um ambiente organizado e focado na aprendizagem mútua.

## 1.1 Objetivo
O objetivo central deste trabalho é desenvolver uma plataforma web acessível e responsiva que auxilie os estudantes a melhorarem seu rendimento acadêmico. Especificamente, o sistema visa:
- Implementar a técnica Pomodoro para gestão de tempo de estudo;
- Aplicar conceitos de gamificação (pontuação por tempo estudado) para aumentar o engajamento;
- Criar um ambiente colaborativo (fórum/posts) para troca de conhecimento;
- Utilizar tecnologias modernas de mercado para garantir escalabilidade e segurança.

---

# 2 DESENVOLVIMENTO

O desenvolvimento do sistema "Cola Limpa" foi pautado em boas práticas de engenharia de software e na utilização de ferramentas modernas que garantissem a entrega de uma aplicação robusta, escalável e segura.

## 2.1 Arquitetura do Sistema e Tecnologias
O sistema foi projetado com base em uma arquitetura MVC (Model-View-Controller) e no modelo cliente-servidor, havendo a separação clara entre as camadas de interface com o usuário (Frontend) e de processamento de regras de negócio (Backend). A comunicação entre as partes ocorre por meio de uma API RESTful.

Para a construção do frontend, optou-se pela utilização da biblioteca React, combinada com TypeScript, HTML5 e CSS3. Essa escolha permitiu a criação de interfaces responsivas e de fácil manutenção.

No backend, a aplicação foi desenvolvida em linguagem Java, utilizando o framework Spring Boot e gerenciamento de dependências via Maven. Essa estrutura fornece um ecossistema sólido para a criação da API REST, facilitando configurações e injeção de dependências.

O armazenamento de dados é feito por meio do Sistema de Gerenciamento de Banco de Dados Relacional (SGBDR) PostgreSQL, escolhido por sua confiabilidade e integridade no trato de dados estruturados, como informações de usuários, publicações e históricos de estudo.

A segurança da aplicação foi tratada como prioridade. A autenticação dos usuários é realizada sem senhas tradicionais (Passwordless) ou através de Single Sign-On (SSO) com Google e GitHub. Após a autenticação, a autorização e controle de sessões são geridos por meio de tokens JWT (JSON Web Token), com senhas/dados sensíveis criptografados utilizando o algoritmo bcrypt.

## 2.2 Funcionalidades Principais e Casos de Uso
O sistema foi estruturado para atender a três perfis de usuários principais: Visitante, Usuário Comum e Administrador.

- **Comunidade e Interação:** Usuários autenticados podem criar posts classificados por matéria e categoria, além de comentar e curtir publicações de outros estudantes. Existe um sistema comunitário de moderação baseado em denúncias, no qual conteúdos com excesso de reportes são ocultados automaticamente até a revisão por um administrador.
- **Técnica Pomodoro e Metas:** O módulo de estudos conta com um cronômetro que permite tanto o estudo livre quanto ciclos Pomodoro automatizados. O tempo registrado é salvo e converte-se em dados gráficos para acompanhamento de desempenho, ajudando no cumprimento de metas diárias ou semanais.
- **Gamificação (Sistema de XP):** Cada bloco de tempo estudado rende pontos de experiência (XP) ao aluno, além de bônus por ciclos completos. Esse mecanismo atua como reforço positivo.

---

# 3 CONSIDERAÇÕES FINAIS

O projeto "Cola Limpa" demonstrou que a integração de metodologias de estudo, como a técnica Pomodoro, aliada à gamificação e a um ambiente de comunidade, possui grande potencial para auxiliar estudantes em sua jornada de aprendizagem.

Durante o desenvolvimento, a separação de responsabilidades (frontend e backend) aliada ao uso de React e Spring Boot permitiu a construção de um sistema moderno, pronto para expansão. As práticas de segurança implementadas, como o JWT e métodos de autenticação Passwordless e SSO, garantiram um sistema em conformidade com as atuais exigências de mercado.

Como trabalhos futuros, vislumbra-se a implementação de um sistema de recompensas visuais (como medalhas e níveis), expansão para um aplicativo mobile nativo e inserção de recursos baseados em inteligência artificial para recomendar cronogramas de estudos personalizados aos usuários.

---

# REFERÊNCIAS

*(Aqui você deve incluir os livros, sites e documentações que usaram para estudar Java, Spring Boot, React, Pomodoro, etc. Exemplo abaixo)*:

DOCUMENTAÇÃO OFICIAL DO SPRING BOOT. **Spring Boot Reference Guide**. [S. l.]: Spring, 2026. Disponível em: https://spring.io/projects/spring-boot. Acesso em: [Data de Acesso].

DOCUMENTAÇÃO OFICIAL DO REACT. **React – Uma biblioteca JavaScript para criar interfaces de usuário**. [S. l.]: Meta, 2026. Disponível em: https://pt-br.reactjs.org/. Acesso em: [Data de Acesso].
