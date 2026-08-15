# Documento 5 — Diagrama de Classes

## Projeto: Cola Limpa

---

# 1. Objetivo do Documento

Este documento define as classes principais do sistema Cola Limpa, seus atributos, métodos e relacionamentos. Ele serve como base para a implementação orientada a objetos no backend (Java/Spring Boot) e para a documentação técnica do sistema.

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
* MetaService
* NotificacaoService

---

# 3. Classe Usuario

## Atributos

* id
* nome
* email
* telefone
* dataCriacao
* fotoUrl
* xp
* metaDiariaMinutos
* isAdmin

## Métodos

* cadastrar()
* loginSso()
* loginCodigoEmail()
* editarPerfil()
* excluirConta()
* adicionarXp()

## Observações

* autenticação passwordless (sem senhas)
* email e telefone devem ser únicos
* isAdmin define permissões administrativas para moderação

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
* qtDenuncias
* dataCriacao

## Métodos

* criarPost()
* editarPost()
* removerPost()
* denunciarPost()
* adicionarCurtida()
* removerCurtida()

## Observações

* posts vão direto ao ar
* posts ocultados automaticamente caso qtDenuncias atinja o limite

---

# 5. Classe Comentario

## Atributos

* id
* postId
* usuarioId
* texto
* qtCurtidas
* qtDenuncias
* dataCriacao

## Métodos

* criarComentario()
* editarComentario()
* removerComentario()
* denunciarComentario()
* adicionarCurtida()
* removerCurtida()

## Observações

* vão direto ao ar, sujeitos a denúncias
* não há respostas encadeadas

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

---

# 7. Classe CronometroHistorico

## Atributos

* id
* usuarioId
* tempoSegundos
* tipoSessao
* dataCriacao

## Métodos

* iniciarCiclo()
* pausarCiclo()
* salvarTempo()
* calcularXp()

## Observações

* suporta Pomodoro e Estudo Livre
* limite máximo contínuo: 16 horas

---

# 8. Classe AuthService

## Responsabilidade

Controla autenticação passwordless e SSO.

## Métodos

* gerarCodigoAcesso()
* validarCodigo()
* autenticarSso()
* gerarTokenJWT()
* validarToken()

---

# 9. Classe PostService

## Responsabilidade

Controla as regras de negócio de postagens.

## Métodos

* criar()
* editar()
* remover()
* listarPosts()
* denunciar()
* ocultarPostDenunciado()
* pesquisar()
* filtrarPorCategoria()

---

# 10. Classe ComentarioService

## Responsabilidade

Controla criação e denúncias de comentários.

## Métodos

* criar()
* editar()
* remover()
* listarPorPost()
* denunciar()

---

# 11. Classe LikeService

## Responsabilidade

Controla curtidas.

## Métodos

* curtirPost()
* curtirComentario()
* removerLike()

---

# 12. Classe CronometroService

## Responsabilidade

Controla a técnica Pomodoro e sessões de estudo.

## Métodos

* iniciar()
* pausar()
* registrarTempo()
* listarHistorico()

---

# 13. Classe MetaService

## Responsabilidade

Gerencia as metas de estudo e exibe os gráficos de desempenho.

## Métodos

* definirMeta()
* consultarProgresso()
* gerarDadosGrafico()

---

# 14. Classe NotificacaoService

## Responsabilidade

Controla as notificações.

## Métodos

* enviarNotificacaoDiaria()
* registrarPermissao()

---

# 15. Conclusão

O diagrama de classes do Cola Limpa reflete a arquitetura Java/Spring Boot moderna, focada em moderação por denúncias, login passwordless e ferramentas avançadas de estudo (Pomodoro/Metas).
