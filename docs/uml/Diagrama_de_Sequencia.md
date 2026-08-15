# Documento 7 — Diagrama de Sequência

## Projeto: Cola Limpa

---

# 1. Objetivo do Documento

Este documento descreve os fluxos de interação entre usuário, frontend, backend em Spring Boot, banco PostgreSQL e provedores externos.

---

# 2. Sequência — Login Passwordless

1. Usuário informa email.
2. Frontend chama a API Backend.
3. Backend gera código temporário e envia por email.
4. Usuário informa código na interface.
5. Backend valida código e gera token JWT.
6. Usuário logado.

---

# 3. Sequência — Login SSO (Google)

1. Usuário clica "Entrar com Google".
2. Frontend redireciona para OAuth2.
3. Google retorna código de autorização.
4. Backend troca código por dados do usuário.
5. Backend cria/atualiza usuário no banco e gera JWT.
6. Usuário logado.

---

# 4. Sequência — Criar Post

1. Usuário escreve post.
2. Backend salva o post.
3. Post já aparece no feed da comunidade imediatamente.

---

# 5. Sequência — Denunciar e Moderar Post

1. Usuário clica em "Denunciar".
2. Backend incrementa `qt_denuncias`.
3. Backend verifica se `qt_denuncias >= X`. Se sim, `oculto = true`.
4. Administrador vê post na fila de moderação.
5. Administrador exclui post definitivamente ou zera denúncias.

---

# 6. Sequência — Pomodoro e Metas

1. Usuário define meta de 2 horas e inicia Pomodoro.
2. Frontend roda timer de 25min (local).
3. Ao fim do ciclo, frontend chama API para salvar sessão.
4. Backend salva `CronometroHistorico` e soma XP.
5. Frontend atualiza o gráfico de progresso da meta diária.
