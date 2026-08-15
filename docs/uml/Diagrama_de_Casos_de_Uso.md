# Documento 6 — Diagrama de Casos de Uso

## Projeto: Cola Limpa

---

# 1. Objetivo do Documento

Este documento descreve os casos de uso do sistema Cola Limpa, mostrando as principais interações entre os usuários e a plataforma.

---

# 2. Atores do Sistema

## 2.1 Visitante

Pode: visualizar conteúdos públicos.
Não pode: comentar, curtir, postar, denunciar, usar cronômetro.

## 2.2 Usuário

Pode:
* cadastrar-se e logar (via SSO ou email);
* editar perfil;
* criar post e comentar;
* curtir e denunciar conteúdos;
* usar cronômetro (Pomodoro) e definir metas;
* visualizar gráficos de desempenho;
* receber notificações.

## 2.3 Administrador / Moderador

Pode:
* revisar denúncias de posts e comentários;
* remover conteúdos e usuários;
* acessar painel administrativo.

## 2.4 Serviço de SSO Externa

Participa da autenticação OAuth2 (Google/GitHub).

---

# 3. Casos de Uso do Usuário

## 3.1 Login e Cadastro Passwordless

Autenticação rápida sem senha, usando código no email ou botões sociais.
Resultado: JWT gerado e conta acessada/criada.

## 3.2 Denunciar Conteúdo

Permite reportar posts/comentários que ferem regras.
Resultado: Conteúdo ocultado se atingir limite de reports.

## 3.3 Usar Pomodoro e Metas

Permite ciclos de estudo automático e visualização gráfica.
Resultado: XP atribuído e métricas geradas.

---

# 4. Casos de Uso do Administrador

## 4.1 Revisar Denúncias

Permite ver a fila de posts ocultados pela comunidade.
Resultado: Administrador deleta definitivamente ou restaura o post.

---

# 5. Fluxos Principais

## 5.1 Fluxo de Login Passwordless
1. Usuário informa email.
2. Sistema envia código.
3. Usuário digita código.
4. JWT gerado.

## 5.2 Fluxo de Denúncia
1. Usuário clica em denunciar post.
2. Sistema incrementa `qt_denuncias`.
3. Se atingir limite, post é ocultado.
4. Admin analisa no painel.

## 5.3 Fluxo Pomodoro
1. Usuário inicia ciclo.
2. Sistema conta 25 min.
3. Sistema avisa pausa.
4. XP extra se completar ciclo.

---

# 6. Conclusão

O diagrama de casos de uso foca na experiência contínua do usuário, tirando os gargalos administrativos (aprovação manual) e focando em gamificação e estudo.
