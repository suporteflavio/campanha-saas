# 🚀 Guia de Deployment - Railway

Este guia descreve como fazer deploy da aplicação CampanhaOS no Railway.

## 📋 Pré-requisitos

- Conta no [Railway](https://railway.app)
- Repositório GitHub conectado
- Node.js 18+ (para desenvolvimento local)

---

## 🛠️ Configuração Inicial do Railway

### 1. Conectar GitHub ao Railway

1. Acesse [railway.app](https://railway.app) e faça login
2. Clique em **"New Project"**
3. Selecione **"Deploy from GitHub"**
4. Autorize o Railway a acessar seu repositório GitHub
5. Selecione o repositório `campanha-saas`

### 2. Criar Banco de Dados PostgreSQL

1. No dashboard do Railway, clique em **"+ Add"**
2. Selecione **"PostgreSQL"**
3. Aguarde a criação da instância
4. Copie a URL de conexão (aparecerá em `DATABASE_URL`)

### 3. Criar Variáveis de Ambiente

Os plugins do Railway criarão automaticamente `DATABASE_URL`. Você precisa adicionar as variáveis adicionais:

#### Para o Backend (NestJS)

```env
# Database (auto-criada pelo Railway)
DATABASE_URL=postgresql://...

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=7d

# Server
PORT=3001
NODE_ENV=production

# APIs Externas (opcional, mas necessário para funcionalidade completa)
INSTAGRAM_ACCESS_TOKEN=
INSTAGRAM_BUSINESS_ACCOUNT_ID=
WHATSAPP_BUSINESS_ACCOUNT_ID=
WHATSAPP_ACCESS_TOKEN=
AWS_SES_REGION=us-east-1
AWS_SES_ACCESS_KEY=
AWS_SES_SECRET_KEY=
META_PIXEL_ID=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
```

#### Para o Frontend (Next.js)

O Railway detectará automaticamente que é uma aplicação Next.js. Você precisa adicionar:

```env
NEXT_PUBLIC_API_URL=https://campanha-saas-backend-production.up.railway.app
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_APP_URL=https://campanha-saas-frontend-production.up.railway.app
NEXT_PUBLIC_APP_NAME=CampanhaOS
NEXT_PUBLIC_PWA_ENABLED=true
```

---

## 📦 Estrutura do Projeto para Railway

O Railway detectará automaticamente a estrutura do seu projeto:

```
campanha-saas/
├── backend/                 # Será deployado como serviço NestJS
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   ├── Dockerfile          # ✅ Criado automaticamente
│   └── .dockerignore       # ✅ Criado automaticamente
├── frontend/                # Será deployado como serviço Next.js
│   ├── src/
│   ├── package.json
│   ├── Dockerfile          # ✅ Criado automaticamente
│   └── .dockerignore       # ✅ Criado automaticamente
└── docker-compose.yml       # Para desenvolvimento local
```

---

## 🚀 Processo de Deployment Automático

### 1. Setup Inicial no Railway

```bash
# No seu terminal (apenas para setup inicial)
cd campanha-saas

# Railway CLI pode ser usado para facilitar, mas é opcional
# npm install -g @railway/cli
# railway login
# railway init
```

### 2. Criar Dois Serviços no Railway

**Backend:**
- Nome: `campanha-saas-backend`
- Root Directory: `backend`
- Build Command: `npm run build`
- Start Command: `npm run start:prod`
- Port: `3001`

**Frontend:**
- Nome: `campanha-saas-frontend`
- Root Directory: `frontend`
- Build Command: `npm run build`
- Start Command: `npm run start`
- Port: `3000`

### 3. Banco de Dados

- Railway provisiona o PostgreSQL automaticamente
- A variável `DATABASE_URL` fica disponível para ambos os serviços
- **Importante**: Configure Prisma para executar migrations automaticamente (veja seção abaixo)

---

## 🔄 Migrations do Banco de Dados

Para que o banco de dados seja inicializado automaticamente no Railway:

### Opção 1: Deploy Hook (Recomendado)

No Railway, configure um **Build Command** para o backend:

```bash
npm run build && npx prisma migrate deploy
```

### Opção 2: Seed Automático

Adicione um script ao `package.json` do backend:

```json
{
  "scripts": {
    "start:prod": "node dist/main.js",
    "db:migrate": "prisma migrate deploy",
    "db:seed": "ts-node prisma/seed.ts"
  }
}
```

Then update the start command:

```bash
npm run db:migrate && npm run start:prod
```

---

## 🔒 Segurança em Produção

### ✅ Checklist antes de fazer deploy:

- [ ] `JWT_SECRET` está alterado e forte
- [ ] `DATABASE_URL` usa credenciais seguras
- [ ] Não há `.env` ou credenciais no repositório (verify with `git check-ignore .env`)
- [ ] CORS está configurado para aceitar apenas origem do frontend
- [ ] RLS (Row Level Security) está ativado no PostgreSQL
- [ ] Variáveis sensíveis estão no Railway Secrets, não no código

### Configurar CORS no Backend

No `backend/src/main.ts`:

```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

---

## 📊 Monitoramento e Logs

Railway fornece:

- **Logs em Tempo Real**: Acesse via dashboard
- **Métricas**: CPU, memória, rede
- **Alerts**: Configure para downtime ou erros

```bash
# Ver logs localmente (com Railway CLI)
railway logs -f
```

---

## 🔄 Workflow de Desenvolvimento

1. **Desenvolva localmente**:
   ```bash
   docker-compose up -d
   cd backend && npm run start:dev
   cd frontend && npm run dev
   ```

2. **Commit e push**:
   ```bash
   git add .
   git commit -m "Feature: descrição"
   git push origin main
   ```

3. **Railway faz deploy automaticamente**:
   - Detecta mudanças no repositório
   - Executa build
   - Rola novo deploy
   - Atualiza aplicação em produção

---

## 🐛 Troubleshooting

### "Build failed"
- Verifique se `package.json` está correto
- Verifique se há erros de TypeScript (`npm run lint`)
- Confira se todas as variáveis de ambiente estão definidas

### "Connection refused"
- Verifique se `DATABASE_URL` está configurado
- Confira se o PostgreSQL está rodando
- Veja os logs do Railway para mais detalhes

### "Port already in use"
- Railway reatribui portas dinamicamente
- Use `process.env.PORT` em vez de hardcoded ports

### "Frontend não conecta ao Backend"
- Verifique `NEXT_PUBLIC_API_URL`
- Confira CORS no backend
- Veja se Frontend e Backend estão em serviços separados

---

## 📝 Variáveis de Ambiente Completas

Copie e customize o arquivo `.env.example` de cada serviço:

**Backend** (`.env`):
```bash
cp backend/.env.example backend/.env
```

**Frontend** (`.env.local`):
```bash
cp frontend/.env.example frontend/.env.local
```

Depois adicione ao Railway via UI ou CLI.

---

## 🎯 Próximos Passos

1. ✅ Conectar GitHub ao Railway
2. ✅ Criar banco de dados PostgreSQL
3. ✅ Configurar variáveis de ambiente
4. ✅ Fazer primeiro push
5. ✅ Monitorar deploy
6. ✅ Testar funcionalidades em produção
7. ✅ Configurar domain customizado (opcional)

---

**Para mais informações sobre Railway, acesse**: [docs.railway.app](https://docs.railway.app)
