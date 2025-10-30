# Tico vs Teco 🎮

Jogo da Velha em **React + TypeScript + Vite**, com **três modos de jogo** (Local, vs **Bot com Gemini**, e **Online** com salas), **ranking** e **perfil** integrados ao **Firebase**.

> **Visualizar:** https://tico-vs-teco.vercel.app

## ✨ Funcionalidades

- 🕹️ **Modos de jogo:** Local (2 jogadores), vs **Bot (Gemini)** e **Online** (salas públicas).
- 👤 **Autenticação** (Firebase Auth) com Login/Registro/Reset.
- 🏆 **Ranking** global (Firestore) e **perfil** do jogador (nome, país, pontos).
- 🔁 **Salas online** com criação, listagem, entrada/saída e pedido de revanche.
- 📱 **UI responsiva** com **Tailwind CSS** e ícones **lucide-react**.
- ⚡️ Build rápido com **Vite**.

## 🧱 Stack

- **React 18** + **TypeScript**
- **Vite 5**
- **Tailwind CSS 3**
- **Firebase** (Auth, Firestore, Analytics)
- **Google Generative AI** (`@google/generative-ai`) — movimentos do Bot
- (Optionals no `package.json`: ESLint, TypeScript ESLint)

## 📦 Requisitos

- **Node.js 18+** (recomendado 18 LTS ou 20)
- **npm** (ou pnpm/yarn, se preferir)

## 🚀 Como rodar localmente

```bash
# 1) Clone o repositório
git clone https://github.com/JHOW2004/tico-vs-teco.git
cd <PASTA_DO_ARQUIVO>

# 2) Instale as dependências
npm install

# 3) Crie o arquivo de variáveis de ambiente
cp .env.example .env
# preencha os valores (veja seção "Variáveis de Ambiente")

# 4) Rode em desenvolvimento
npm run dev

# 5) Build de produção (opcional)
npm run build
npm run preview
```

> A aplicação foi criada com Vite. O _output_ de produção é gerado na pasta `dist/`.

## 🔐 Variáveis de Ambiente

Copie `.env.example` para `.env` e preencha:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_GEMINI_API_KEY=
```

### Passos rápidos — Firebase
1. Crie um projeto no **Firebase Console**.
2. Em **Auth**, habilite **Email/Password** (ou outros provedores que desejar).
3. Em **Firestore**, crie um banco (modo de teste para desenvolvimento).
4. Em **Configurações do projeto → Apps**, adicione um **App Web** e copie as credenciais para as variáveis acima.
5. (Opcional) **Analytics**: habilite no projeto e informe o `VITE_FIREBASE_MEASUREMENT_ID`.

> As coleções são criadas dinamicamente pelo app (ex.: perfis, ranking, salas). Garanta permissões adequadas nas **regras do Firestore** de acordo com seu ambiente (dev/prod).

### Passos rápidos — Gemini (Bot)
1. Gere uma **API Key** do **Google Generative AI**.
2. Defina `VITE_GEMINI_API_KEY` no `.env`.

## 🧭 Estrutura de pastas (principal)

```
src/
  components/
    Auth/ (Login, Register, ResetPassword)
    OnlineGame/ (RoomList, OnlineGameRoom)
    BotGame.tsx
    LocalGame.tsx
    GameBoard.tsx
    MainMenu.tsx
    Profile.tsx
    Ranking.tsx
  hooks/
    useAuth.ts
  lib/
    firebase.ts       # inicialização do Firebase
    gemini.ts         # lógica do Bot (Gemini)
  utils/
    gameLogic.ts
  types/
    game.ts
  App.tsx
  main.tsx
index.html
tailwind.config.js
vite.config.ts
```

## 🧪 Scripts úteis

- `npm run dev` — ambiente de desenvolvimento
- `npm run build` — build de produção
- `npm run preview` — serve o build localmente
- `npm run lint` — linting
- `npm run typecheck` — checagem de tipos

## ☁️ Deploy na Vercel

1. Faça _push_ do projeto para o **GitHub**.
2. Na **Vercel**, importe o repositório.
3. **Build Command:** `npm run build`  
   **Output Directory:** `dist`
4. Adicione em **Project Settings → Environment Variables** as variáveis do `.env`.
5. Deploy e pronto ✅ — o app ficará disponível (ex.: `tico-vs-teco.vercel.app`).

## 👥 Agradecimentos / Participantes

- [@francielesevilha](https://github.com/francielesevilha)
- [@JHOW2004](https://github.com/JHOW2004)
- [@MihhSantos](https://github.com/MihhSantos)
- [@ViniciusAraujoMoraes](https://github.com/ViniciusAraujoMoraes)

## 💡 Roadmap (sugestões)

- Matchmaking automático
- Emotes/chat nas salas
- Modo torneio e temporadas de ranking
- Testes automatizados (unitários/E2E)
- PWA (instalável)

## 📝 Licença

Nenhuma licença definida no repositório.

---
Feito com ❤️ por Fran, Jhow, Mi e Vini.
