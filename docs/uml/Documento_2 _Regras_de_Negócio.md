# Documento 2 — Regras de Negócio

## Projeto: Cola Limpa

---

# 1. Objetivo do Documento

Este documento define as regras de negócio do sistema Cola Limpa.

As regras descritas aqui determinam:

* restrições do sistema;
* validações;
* comportamentos obrigatórios;
* permissões;
* funcionamento interno das funcionalidades.

---

# 2. Regras de Cadastro

## RN001 — Cadastro Obrigatório

O sistema deverá exigir cadastro para:

* criar posts;
* comentar;
* utilizar cronômetro;
* responder questões;
* curtir conteúdos.

Visitantes poderão apenas visualizar conteúdos públicos.

---

## RN002 — Email ou Telefone Obrigatório

O usuário deverá informar:

* email;
  ou
* telefone.

Pelo menos um dos dois deverá ser obrigatório.

---

## RN003 — Email Único

Não poderão existir dois usuários com o mesmo email.

---

## RN004 — Telefone Único

Não poderão existir dois usuários com o mesmo telefone.

---

## RN005 — Senha Criptografada

A senha do usuário deverá ser armazenada utilizando bcrypt.

O sistema jamais deverá salvar senha em texto puro.

---

## RN006 — Verificação de Conta

O sistema deverá enviar código de verificação:

* por email;
  ou
* por telefone.

A conta só poderá ser utilizada após validação do código.

---

# 3. Regras de Recuperação de Senha

## RN007 — Expiração do Código

O código de recuperação deverá expirar em:

* 5 minutos.

---

## RN008 — Reenvio de Código

O usuário poderá solicitar novo código apenas:

* após 30 segundos.

---

## RN009 — Limite Diário

O sistema deverá permitir:

* máximo de 4 códigos por dia.

---

# 4. Regras de Login

## RN010 — Autenticação

O sistema deverá autenticar usuários utilizando:

* JWT.

---

## RN011 — Logout Automático

O sistema deverá encerrar automaticamente sessões inativas após determinado período.

---

## RN012 — Proteção de Rotas

Rotas privadas deverão exigir:

* token válido;
* autenticação ativa.

---

# 5. Regras de Usuário

## RN013 — Tipos de Usuário

O sistema possuirá:

* usuário comum;
* administrador.

---

## RN014 — Controle Administrativo

Usuários administradores poderão:

* aprovar posts;
* aprovar comentários;
* remover posts;
* remover comentários;
* remover usuários.

---

## RN015 — Painel Administrativo

Funções administrativas deverão existir em painel separado.

---

# 6. Regras de Posts

## RN016 — Aprovação Obrigatória

Todo post criado deverá iniciar como:

* não aprovado.

---

## RN017 — Visibilidade do Post

Posts não aprovados:

* não deverão aparecer publicamente.

---

## RN018 — Mensagem de Aprovação

O autor deverá visualizar:

* “Aguardando aprovação de um administrador”.

---

## RN019 — Estrutura do Post

Todo post deverá possuir:

* título;
* texto;
* categoria;
* matéria;
* autor;
* data de criação.

---

## RN020 — Categorias Pré-definidas

Categorias deverão ser definidas pelo sistema.

Exemplos:

* Dicas;
* Dúvidas;
* Redação;
* Vestibular.

---

## RN021 — Matérias Pré-definidas

Matérias deverão utilizar lista fixa do sistema.

---

## RN022 — Conteúdo Permitido

Posts deverão permitir:

* apenas texto.

---

## RN023 — Exclusão em Cascata

Ao remover um post:

* comentários relacionados também deverão ser removidos.

---

# 7. Regras de Comentários

## RN024 — Aprovação Obrigatória

Comentários deverão iniciar:

* não aprovados.

---

## RN025 — Estrutura Simples

Comentários:

* não possuirão respostas encadeadas.

---

## RN026 — Curtidas em Comentários

Comentários poderão receber curtidas.

---

## RN027 — Exclusão de Comentários

Comentários removidos deverão ser apagados permanentemente.

---

# 8. Regras de Curtidas

## RN028 — Uma Curtida por Usuário

Cada usuário poderá:

* curtir apenas uma vez o mesmo conteúdo.

---

## RN029 — Controle de Curtidas

O sistema deverá utilizar tabela de controle de likes para:

* impedir múltiplas curtidas.

---

## RN030 — Quantidade Total

Posts e comentários deverão armazenar:

* quantidade total de curtidas.

---

# 9. Regras do Cronômetro

## RN031 — Controle Manual

O cronômetro deverá:

* iniciar manualmente;
* pausar manualmente.

---

## RN032 — Persistência Parcial

Ao fechar a aba:

* o cronômetro deverá pausar;
* o tempo deverá permanecer salvo.

---

## RN033 — Tempo Máximo

O cronômetro não poderá ultrapassar:

* 16 horas contínuas.

---

## RN034 — Aviso de Saúde

Ao atingir limite máximo:

* sistema deverá exibir aviso de saúde.

---

## RN035 — Valores Inválidos

O cronômetro:

* não poderá registrar tempo negativo.

---

## RN036 — Histórico de Estudo

O sistema deverá armazenar:

* tempo estudado;
* data;
* horário;
* usuário relacionado.

---

# 10. Regras das Questões com IA

## RN037 — Questão Individual

O sistema deverá gerar:

* uma questão por vez.

---

## RN038 — Geração Externa

As questões deverão ser geradas utilizando:

* API externa de inteligência artificial.

---

## RN039 — Estrutura da Questão

Toda questão deverá possuir:

* enunciado;
* alternativas A, B, C, D e E.

---

## RN040 — Dados Informados pelo Usuário

O usuário deverá informar:

* matéria;
* assunto;
* dificuldade.

---

## RN041 — Não Persistência

Questões geradas:

* não deverão ser armazenadas no banco.

---

## RN042 — Sem Histórico

O sistema:

* não deverá manter histórico de desempenho.

---

## RN043 — Próxima Questão

Após responder:

* sistema deverá apenas permitir próxima questão.

---

# 11. Regras de XP

## RN044 — XP por Estudo

O usuário receberá:

* 1 XP a cada 3 minutos estudados.

---

## RN045 — XP por Questão

O usuário receberá:

* 1 XP por questão respondida.

---

## RN046 — Exibição de XP

O sistema deverá exibir:

* XP total acumulado.

---

# 12. Regras de Busca

## RN047 — Pesquisa de Posts

A busca deverá pesquisar:

* título;
* matéria;
* categoria.

---

## RN048 — Ordenação

O sistema deverá permitir ordenação por:

* data;
* popularidade.

---

# 13. Regras de Notificação

## RN049 — Notificação Diária

O sistema deverá enviar:

* uma notificação diária no navegador.

Objetivo:

* incentivar o usuário a estudar.

---

# 14. Regras de Perfil

## RN050 — Foto de Perfil

O sistema deverá armazenar:

* apenas URL da imagem.

---

## RN051 — Perfil Privado

Usuários:

* não possuirão perfil público.

---

# 15. Regras de Exclusão de Usuário

## RN052 — Exclusão em Cascata

Ao remover usuário:

* posts deverão ser removidos;
* comentários deverão ser removidos;
* históricos deverão ser removidos;
* curtidas deverão ser removidas.

---

# 16. Regras de Segurança

## RN053 — Rotas Protegidas

Rotas administrativas deverão exigir:

* autenticação;
* permissão administrativa.

---

## RN054 — Validação de Entrada

O backend deverá validar:

* campos obrigatórios;
* tipos de dados;
* permissões;
* limites de caracteres.

---

## RN055 — Segurança da API

A API deverá:

* validar JWT;
* impedir acesso não autorizado;
* proteger dados sensíveis.

---

# 17. Regras Arquiteturais

## RN056 — Arquitetura MVC

O backend deverá seguir:

* Model;
* View;
* Controller.

---

## RN057 — Separação de Camadas

O sistema deverá possuir:

* frontend separado;
* backend separado;
* comunicação via API REST.

---

## RN058 — Responsividade

O sistema deverá funcionar adequadamente em:

* dispositivos móveis;
* tablets;
* desktops.

---

## RN059 — Escalabilidade

A arquitetura deverá permitir:

* expansão futura;
* novas funcionalidades;
* aumento de usuários.

---

## RN060 — Acessibilidade

O sistema deverá considerar:

* boa leitura;
* contraste adequado;
* navegação intuitiva.

