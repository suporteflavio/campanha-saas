# 🚀 Guia de Deploy Railway - CampanhaOS

## Pré-requisitos
- Conta no Railway (https://railway.app)
- GitHub conectado ao Railway
- Este repositório no GitHub

---

## Passo 1: Conectar Railway ao GitHub

1. Acesse https://railway.app e faça login
2. Clique em **"New Project"** → **"Deploy from GitHub"**
3. Selecione este repositório: `suporteflavio/campanha-saas`
4. Railway automaticamente detectará que é umprojekt monorepo

---

## Passo 2: Criar Serviços no Railway

### A) PostgreSQL (Banco de Dados)

1. No dashboard Railway, clique **"+ New Service"** → **"PostgreSQL"**
2. Railway criará automaticamente uma instância
3. Copie a **DATABASE_URL** gerada (aparece em **Variables**)
4. Salve para usar no backend

### B) Redis (Cache)

1. Clique **"+ New Service"** → **"Redis"**
2. Railway criará a instância
3. Copie a **REDIS_URL** gerada
4. Salve para usar no backend

### C) Backend (NestJS)

1. Clique **"+ New Service"** → **"GitHub Repo"**
2. Selecione este repo
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node dist/main.js`

### D) Frontend (Next.js)

1. Clique **"+ New"** → **"GitHub Repo"**
2. Selecione este repo
3. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`

---

## Passo 3: Conectar Serviços (Linking)

1. Vá para o **Backend Service**
2. Em **"Variables"**, adicione:
   ```
   DATABASE_URL=<copie do PostgreSQL>
   REDIS_URL=<copie do Redis>
   JWT_SECRET=seu-secret-super-seguro-com-32-caracteres-aleatorios
   JWT_EXPIRES_IN=24h
   PORT=3001
   NODE_ENV=production
   BACKEND_URL=<URL gerada do Backend>
   ```

3. Abra **"Plugins"** → selecione **PostgreSQL** e **Redis**
4. Railway vinculará automaticamente

4. Vá para **Frontend Service**
5. Em **"Variables"**, adicione:
   ```
   NEXT_PUBLIC_API_URL=<URL do Backend>
   PORT=3000
   NODE_ENV=production
   ```

---

## Passo 4: Executar Node (Seed)

### Option A: Via Railway CLI (melhor)

```bash
# Instale Railway CLI
npm install -g @railway/cli

# Login
railway login

# Selecione o projeto
railway link

# Execute seed no servidor PostgreSQL
railway run npm run seed --root backend
```

### Option B: Via Dashboard (manual)

1. Clique no Backend → **"Deployments"**
2. Clique em **"View Logs"**
3. Procure um terminal/shell para executar:
   ```bash
   npm run seed
   ```

---

## Passo 5: Acessar Aplicação

- **Frontend**: https://<seu-frontend-url>.railway.app
- **Backend**: https://<seu-backend-url>.railway.app

### Credenciais Iniciais
```
👤 ROOT ADMIN
CPF: 000.000.000-00
Senha: Admin@2026

👤 DEMO CAMPAIGN
CPF: 123.456.789-00
Senha: Campanha@2026
```

---

## Troubleshooting

### ❌ Build falha com "module not found"
- Verifique se `package.json` tem todas as dependências
- Railway build log mostra o erro específico

### ❌ Database connection error
- Confirme DATABASE_URL está nos Environment Variables
- Verifique se PostgreSQL service está running (verde no dashboard)

### ❌ Port already in use
- Railway gerencia portas automaticamente via Railway
- Não altere a variável PORT

### ❌ CORS errors
- Verifique `BACKEND_URL` e `NEXT_PUBLIC_API_URL`
- Devem corresponder aos URLs reais do Railway

---

## Environment Variables Completo

```env
# PostgreSQL
DATABASE_URL=postgresql://user:pass@host:5432/database

# Redis
REDIS_URL=redis://:password@host:6379

# JWT
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
JWT_EXPIRES_IN=24h

# App
PORT=3001
NODE_ENV=production
BACKEND_URL=https://seu-backend.railway.app
NEXT_PUBLIC_API_URL=https://seu-backend.railway.app

# Instagram (opcional)
INSTAGRAM_APP_ID=seu_app_id
INSTAGRAM_APP_SECRET=seu_app_secret

# SMS/Email (opcional)
TWILIO_ACCOUNT_SID=seu_sid
TWILIO_AUTH_TOKEN=seu_token

# Telegram Bot (opcional)
TELEGRAM_BOT_TOKEN=seu_bot_token
TELEGRAM_CHAT_ID=seu_chat_id
```

---

##  Health Check

Acesse `https://seu-backend.railway.app/health` para confirmar:
```json
{
  "status": "ok",
  "timestamp": "2026-03-27T20:00:00.000Z"
}
```

---

## Próximos Passos

1. ✅ Deploy para Railway
2. ✅ Testar login e seed
3. 🔄 Integrar Instagram Graph API
4. 🔄 Configurar emails com Resend/SendGrid
5. 🔄 Adicionar Telegram bot para alertas
6. 🔄 Configurar PWA offline-first

---

**Dúvidas?** Acesse docs.railway.app ou contact support@railway.app
