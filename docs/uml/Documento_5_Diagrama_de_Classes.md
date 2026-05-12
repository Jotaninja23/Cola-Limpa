# Documento 5 — Diagrama de Classes

## Projeto: Cola Limpa

---

# 1. Objetivo do Documento

Este documento define as classes principais do sistema Cola Limpa, seus atributos, métodos e relacionamentos. Ele serve como base para a implementação orientada a objetos no backend e também para a documentação técnica do sistema.

---

# 2. Visão Geral das Classes

As classes centrais do sistema são:

* Usuario
* Post
* Comentario
* Like
* CronometroHistorico
* AuthService
* PostService
* ComentarioService
* LikeService
* CronometroService
* IAService
* NotificacaoService

As classes de serviço representam a lógica de negócio e apoio do sistema, enquanto as entidades representam os dados principais.

---

# 3. Classe Usuario

## Atributos

* id
* nome
* email
* telefone
* senha
* dataCriacao
* fotoUrl
* xp
* isAdmin

## Métodos

* cadastrar()
* autenticar()
* recuperarSenha()
* editarPerfil()
* excluirConta()
* adicionarXp()

## Observações

* senha deve ser criptografada
* email e telefone devem ser únicos
* isAdmin define permissões administrativas

---

# 4. Classe Post

## Atributos

* id
* usuarioId
* titulo
* texto
* categoria
* materia
* qtCurtidas
* aprovado
* dataCriacao

## Métodos

* criarPost()
* editarPost()
* removerPost()
* aprovarPost()
* adicionarCurtida()
* removerCurtida()

## Observações

* posts começam como não aprovados
* somente texto é permitido
* um post pertence a um usuário

---

# 5. Classe Comentario

## Atributos

* id
* postId
* usuarioId
* texto
* qtCurtidas
* aprovado
* dataCriacao

## Métodos

* criarComentario()
* editarComentario()
* removerComentario()
* aprovarComentario()
* adicionarCurtida()
* removerCurtida()

## Observações

* comentários também precisam de aprovação
* não há respostas encadeadas
* um comentário pertence a um post e a um usuário

---

# 6. Classe Like

## Atributos

* id
* usuarioId
* postId
* comentarioId
* dataCriacao

## Métodos

* registrarLike()
* removerLike()
* verificarDuplicidade()

## Observações

* um like deve estar vinculado a um post ou a um comentário
* o sistema impede múltiplos likes do mesmo usuário no mesmo conteúdo

---

# 7. Classe CronometroHistorico

## Atributos

* id
* usuarioId
* tempoSegundos
* dataCriacao

## Métodos

* iniciarCronometro()
* pausarCronometro()
* salvarTempo()
* validarTempo()
* calcularXp()

## Observações

* tempo não pode ser negativo
* limite máximo contínuo: 16 horas
* cada registro representa um período de estudo

---

# 8. Classe AuthService

## Responsabilidade

Controla autenticação, login, logout, geração de token e recuperação de senha.

## Métodos

* login()
* logout()
* gerarTokenJWT()
* validarToken()
* enviarCodigoRecuperacao()
* verificarCodigo()
* redefinirSenha()

---

# 9. Classe PostService

## Responsabilidade

Controla as regras de negócio relacionadas a postagens.

## Métodos

* criar()
* editar()
* remover()
* listarAprovados()
* listarPendentes()
* aprovar()
* pesquisar()
* filtrarPorCategoria()
* filtrarPorMateria()

---

# 10. Classe ComentarioService

## Responsabilidade

Controla criação, aprovação, listagem e remoção de comentários.

## Métodos

* criar()
* editar()
* remover()
* listarPorPost()
* aprovar()

---

# 11. Classe LikeService

## Responsabilidade

Controla curtidas em posts e comentários.

## Métodos

* curtirPost()
* curtirComentario()
* removerLike()
* verificarSeJaCurtiu()

---

# 12. Classe CronometroService

## Responsabilidade

Controla tempo de estudo e histórico do usuário.

## Métodos

* iniciar()
* pausar()
* registrarTempo()
* listarHistorico()
* validarLimite()

---

# 13. Classe IAService

## Responsabilidade

Integra a aplicação com a API externa de inteligência artificial.

## Métodos

* gerarQuestao()
* montarPrompt()
* receberRespostaDaApi()

## Observações

* gera apenas uma questão por vez
* não salva histórico de questões
* retorna enunciado e alternativas A, B, C, D e E

---

# 14. Classe NotificacaoService

## Responsabilidade

Controla as notificações do navegador.

## Métodos

* enviarNotificacaoDiaria()
* registrarPermissao()
* verificarDisponibilidade()
* dispararAviso()

---

# 15. Relacionamentos Entre Classes

## 15.1 Usuario e Post

* um usuário pode criar muitos posts
* cada post pertence a um único usuário

Cardinalidade:

* Usuario 1 → N Post

---

## 15.2 Usuario e Comentario

* um usuário pode criar muitos comentários
* cada comentário pertence a um único usuário

Cardinalidade:

* Usuario 1 → N Comentario

---

## 15.3 Post e Comentario

* um post pode ter muitos comentários
* cada comentário pertence a um único post

Cardinalidade:

* Post 1 → N Comentario

---

## 15.4 Usuario e Like

* um usuário pode realizar muitos likes
* cada like pertence a um único usuário

Cardinalidade:

* Usuario 1 → N Like

---

## 15.5 Post e Like

* um post pode receber vários likes

Cardinalidade:

* Post 1 → N Like

---

## 15.6 Comentario e Like

* um comentário pode receber vários likes

Cardinalidade:

* Comentario 1 → N Like

---

## 15.7 Usuario e CronometroHistorico

* um usuário pode ter vários registros de tempo

Cardinalidade:

* Usuario 1 → N CronometroHistorico

---

# 16. Dependências Entre Classes de Serviço e Entidades

## AuthService

Depende de:

* Usuario

## PostService

Depende de:

* Usuario
* Post

## ComentarioService

Depende de:

* Usuario
* Post
* Comentario

## LikeService

Depende de:

* Usuario
* Post
* Comentario
* Like

## CronometroService

Depende de:

* Usuario
* CronometroHistorico

## IAService

Depende de:

* serviço externo de IA

## NotificacaoService

Depende de:

* Usuario

---

# 17. Regras Estruturais do Diagrama

* Usuario é a classe central do sistema
* Post e Comentario dependem de Usuario
* Like funciona como classe de controle de integridade
* CronometroHistorico registra tempo estudado
* Serviços concentram lógica de negócio
* A API externa de IA não faz parte do banco, apenas da integração

---

# 18. Resumo do Diagrama de Classes

O diagrama de classes do Cola Limpa deve demonstrar:

* entidades principais do domínio;
* atributos essenciais;
* métodos de operação;
* relacionamentos 1:N;
* separação entre entidades e serviços;
* integração com autenticação, IA e notificações.

---

# 19. Conclusão

O diagrama de classes do Cola Limpa está estruturado para refletir um sistema acadêmico com organização profissional. Ele cobre autenticação, comunidade, cronômetro, IA, curtidas e notificações, mantendo uma arquitetura adequada para implementação em backend com TypeScript e Node.js.

Próxima etapa: Diagrama de Casos de Uso.

