# Documento 8 — Diagrama de Atividades

## Projeto: Cola Limpa

---

# 1. Objetivo do Documento

Este documento descreve os fluxos de atividade do sistema, mostrando validações e decisões.

---

# 2. Atividade — Login Passwordless

1. Acessa tela de login.
2. Informa email.
3. Sistema envia código de 6 dígitos.
4. Digita código.
5. [Decisão] Código válido? 
   - NÃO: Exibe erro.
   - SIM: Entra no sistema (Gera JWT).

---

# 3. Atividade — Moderação Comunitária (Denúncia)

1. Usuário vê post ofensivo e clica em Denunciar.
2. Sistema incrementa contador.
3. [Decisão] Contador atingiu o limite (ex: 5 denúncias)?
   - NÃO: Nada acontece publicamente.
   - SIM: Post é ocultado da timeline e enviado para revisão.
4. Admin analisa.
5. [Decisão] Post fere as regras?
   - SIM: Deletado.
   - NÃO: Restaurado (contador zerado).

---

# 4. Atividade — Sessão Pomodoro

1. Usuário clica "Iniciar Pomodoro".
2. Conta 25 minutos.
3. Alerta de fim de foco.
4. Conta 5 minutos de descanso.
5. Sistema salva os 25 min no histórico.
6. Adiciona XP ao usuário.
7. Atualiza gráfico de meta diária.

---

# 5. Conclusão

Os diagramas de atividade refletem um sistema moderno, focado em facilidade de uso (sem senhas), autonomia da comunidade (denúncias) e engajamento nos estudos (Pomodoro e gráficos).
