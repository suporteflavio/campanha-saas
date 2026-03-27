# 📋 Estrutura do CampanhaOS - Guia de Arquivos

## 📁 Estrutura Completa Criada

```
campanha-saas/
│
├── 🔷 BACKEND (NestJS)
│   ├── src/
│   │   ├── main.ts                           # Entry point
│   │   ├── app.module.ts                     # Main module
│   │   │
│   │   ├── 🟦 common/                        # Shared utilities
│   │   │   ├── prisma/
│   │   │   │   ├── prisma.service.ts         # DB connection
│   │   │   │   └── prisma.module.ts
│   │   │   ├── guards/
│   │   │   │   ├── jwt-auth.guard.ts         # JWT validation
│   │   │   │   └── role.guard.ts             # RBAC
│   │   │   └── decorators/
│   │   │       └── index.ts                  # @CurrentUser, @CurrentTenant
│   │   │
│   │   └── 🟨 modules/                       # Feature modules
│   │       ├── auth/
│   │       │   ├── auth.controller.ts        # /auth/login, /auth/register
│   │       │   ├── auth.service.ts           # Login logic, JWT tokens
│   │       │   ├── auth.dto.ts               # LoginDto, RegisterDto
│   │       │   └── auth.module.ts
│   │       │
│   │       ├── dashboard/
│   │       │   ├── dashboard.controller.ts   # /dashboard/resumo, /metricas
│   │       │   ├── dashboard.service.ts      # KPI calculations
│   │       │   └── dashboard.module.ts
│   │       │
│   │       ├── tenants/                      # Multi-tenant management
│   │       ├── liderancas/                   # Political leaders
│   │       ├── eleitores/                    # Voters
│   │       ├── reunioes/                     # Meetings/Events
│   │       ├── metas/                        # Vote targets
│   │       ├── financeiro/                   # Financial (contas, notas)
│   │       ├── equipe/                       # Team members
│   │       ├── demandas/                     # Voter requests
│   │       └── marketing/                    # Digital campaigns
│   │
│   ├── prisma/
│   │   ├── schema.prisma                     # Database models (12 tables)
│   │   ├── rls_setup.sql                     # Row Level Security policies
│   │   └── seed.ts                           # Demo data (Goiás municipalities)
│   │
│   ├── .env.example                          # Environment template
│   ├── tsconfig.json                         # TypeScript config
│   ├── nest-cli.json                         # NestJS config
│   └── package.json                          # Dependencies (NestJS, Prisma, etc)
│
├── 🔵 FRONTEND (Next.js 14)
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx                    # Root layout + PWA manifest
│   │   │   ├── globals.css                   # Tailwind base styles
│   │   │   ├── page.tsx                      # Home page (landing)
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── login/page.tsx            # Login form
│   │   │   │   └── register/page.tsx         # Register new campaign
│   │   │   │
│   │   │   └── dashboard/
│   │   │       └── page.tsx                  # Main dashboard (KPIs, metrics)
│   │   │
│   │   ├── components/                       # React components (empty, ready for UI)
│   │   │
│   │   ├── lib/
│   │   │   └── api.ts                        # Axios API client + interceptors
│   │   │
│   │   └── store/
│   │       └── auth.ts                       # Zustand auth store (JWT, user)
│   │
│   ├── public/
│   │   └── manifest.json                     # PWA configuration
│   │
│   ├── next.config.js                        # Next.js + PWA config
│   ├── tailwind.config.js                    # Tailwind CSS theme
│   ├── postcss.config.js                     # PostCSS config
│   ├── tsconfig.json                         # TypeScript config
│   ├── .env.example                          # Environment template
│   └── package.json                          # Dependencies (Next.js, Tailwind, Zustand)
│
├── 📄 Documentação & Configuração
│   ├── README.md                             # Complete documentation + deployment
│   ├── setup.sh                              # Quick setup script (Linux/Mac)
│   ├── setup.bat                             # Quick setup script (Windows)
│   ├── docker-compose.yml                    # Docker orchestration (optional)
│   ├── .gitignore                            # Git ignore rules
│   └── .github/
│       └── copilot-instructions.md           # Copilot AI context
│
└── 📋 ESTRUTURA RESUMIDA
    ├── 12 Tabelas PostgreSQL
    ├── 10 Módulos NestJS
    ├── Multi-tenancy com RLS
    ├── JWT Auth + RBAC
    ├── Next.js PWA frontend
    └── Fully responsive UI
```

---

## 🔑 Arquivos Críticos

| Arquivo | Função | Descrição |
|---------|--------|-----------|
| `backend/prisma/schema.prisma` | Database | Define 12 tabelas com multi-tenancy |
| `backend/prisma/seed.ts` | Demo Data | 50+ registros de demonstração (Goiás) |
| `backend/src/app.module.ts` | Main | Importa todos os 10 módulos |
| `backend/src/modules/auth/auth.service.ts` | Auth | Login, registro, JWT tokens |
| `backend/src/common/guards/jwt-auth.guard.ts` | Security | Valida JWT em rotas protegidas |
| `frontend/src/app/page.tsx` | Landing | Homepage com call-to-action |
| `frontend/src/app/dashboard/page.tsx` | Dashboard | KPIs, métricas, gráficos |
| `frontend/src/store/auth.ts` | State | Zustand store para auth |
| `.env.example` (ambos) | Config | Template de variáveis de ambiente |

---

## 🗄️ Database Schema

### 13 Tabelas Criadas

```
┌─────────────────────────────━━━━━━━━━━━━━━━━━━━━━━━┐
│                    MULTI-TENANCY CORE              │
├─────────────────────────────━━━━━━━━━━━━━━━━━━━━━─┤
│  tenants            (id, name, cnpj, slug, ...)   │
│  users              (id, cpf, name, email, pwd)   │
│  tenant_users       (tenantId, userId, role)      │
└─────────────────────────────━━━━━━━━━━━━━━━━━━━━━┘

┌─────────────────────────────━━━━━━━━━━━━━━━━━━━━━┐
│                   BUSINESS MODULES                 │
├─────────────────────────────━━━━━━━━━━━━━━━━━━━━━─┤
│ liderancas          (CRM político c/ hierarquia)  │
│ eleitores           (captação, segmentação)       │
│ reunioes            (eventos, presença)           │
│ metas               (votos por município)         │
│ contas              (bancárias)                   │
│ notas_fiscais       (receita/despesa)             │
│ vale_vouchers       (combustível digital)         │
│ equipe_membros      (payroll, escalas)            │
│ demandas            (pedidos de eleitores)        │
│ campanhas_marketing (Instagram, WhatsApp, etc)    │
│ predicoes_ia        (IA/ML predictions)           │
│ consentimentos_lgpd (LGPD compliance)             │
│ logs_auditoria      (security audit trail)        │
└─────────────────────────────━━━━━━━━━━━━━━━━━━━━┘
```

---

## 🔐 Segurança Implementada

✅ **JWT Authentication**
- Tokens com expiração (1h acesso, 7d refresh)
- Bcryptjs para hash de senhas

✅ **Row Level Security (RLS)**
- Políticas SQL bloqueia acesso entre tenants
- `tenant_id` obrigatório em todas as queries

✅ **RBAC (Role-Based Access Control)**
- Admin, Manager, Finance, User roles
- Guards customizados por role

✅ **Input Validation**
- DTOs com class-validator
- Sanitização de inputs

✅ **LGPD Compliance**
- Tabela de consentimentos
- Logs de auditoria
- Direito ao esquecimento

---

## 🚀 Endpoints Principais

### Autenticação
```
POST   /auth/login              # CPF + Senha → JWT
POST   /auth/register           # Novo tenant
POST   /auth/refresh-token      # Renovar token
POST   /auth/logout             # Logout
```

### Protected Routes (requer JWT no header)
```
GET    /dashboard/resumo        # KPIs
GET    /liderancas              # Listar políticos
POST   /liderancas              # Criar líder
GET    /eleitores               # Listar eleitores
POST   /eleitores               # Registrar eleitor
GET    /metas                   # Metas por município
GET    /financeiro/resumo       # Balanço financeiro
```

---

## 📦 Stack Técnico Completo

### Backend
- **NestJS** v10 - Framework backend
- **Prisma** v5 - ORM + migrations
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Bcryptjs** - Hash de senhas
- **Class Validator** - Validação
- **Redis** - Cache/filas (opcional)

### Frontend
- **Next.js** 14 - Framework React
- **App Router** - Routing v14+
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Axios** - HTTP client
- **React Hook Form** - Formulários
- **Recharts** - Gráficos
- **next-pwa** - Progressive Web App

### DevOps
- **Docker Compose** - Orquestração
- **Railway** - Deployment ready
- **GitHub Actions** - CI/CD (pronto para setup)

---

## 🎯 Como Começar

### 1️⃣ Básico (sem Docker)
```bash
# Setup automático
cd campanha-saas
bash setup.sh           # Linux/Mac
# ou update setup.bat  # Windows

# Migrations
cd backend
npx prisma migrate dev --name init
npm run seed

# Start
cd backend && npm run start:dev      # Terminal 1
cd frontend && npm run dev           # Terminal 2
```

### 2️⃣ Com Docker
```bash
cd campanha-saas
docker-compose up -d

# Migrations dentro do container
docker exec campanha_backend npx prisma migrate deploy
docker exec campanha_backend npm run seed
```

### 3️⃣ Production Ready
- Deploy Backend no Railway
- Deploy Frontend no Vercel
- PostgreSQL gerenciado
- Variáveis de ambiente seguras

---

## 🧪 Testes & Validação

### Credenciais Padrão
```
Root Admin:
  CPF:   000.000.000-00
  Senha: Admin@2026

Demo Campaign Admin:
  CPF:   123.456.789-00
  Senha: Campanha@2026
```

### Testar API
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"cpf": "123.456.789-00", "password": "Campanha@2026"}'
```

### Testar Frontend
```
http://localhost:3000      # Landing page
http://localhost:3000/auth/login       # Login
http://localhost:3000/dashboard        # Dashboard (after auth)
```

---

## 📚 Próximos Passos

**Fáceis de Adicionar:**
- [ ] Componentes React adiconais (tabelas, cards, modais)
- [ ] Mais páginas (lideranças, eleitores, reuniões)
- [ ] Filtros e busca avançada
- [ ] Exportar relatórios (PDF/Excel)
- [ ] Notificações em tempo real (Socket.io)
- [ ] Testes unitários e E2E
- [ ] CI/CD com GitHub Actions
- [ ] Integração com WhatsApp Business API
- [ ] Integração com Instagram Graph API

---

**Status:** ✅ **PRONTO PARA DESENVOLVIMENTO**

📝 Todos os arquivos foram criados. Siga o README.md para iniciar!
