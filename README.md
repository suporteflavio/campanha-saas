# CampanhaOS - SaaS de Gestão de Campanhas Eleitorais

Uma plataforma completa, multi-tenant e em tempo real para gestão integrada de campanhas eleitorais, construída com **NestJS**, **Next.js 14**, **PostgreSQL**, **Prisma** e **RLS** para segurança de dados.

## 🎯 Características Principais

### Dashboard
- Contador regressivo para eleição
- Visualização de metas e votos em tempo real
- Mapa interativo de regiões
- Alertas automáticos baseados em IA

### Módulos do Sistema

| Módulo | Descrição |
|--------|-----------|
| **Lideranças** | CRM político com árvore hierárquica e gamificação |
| **Eleitores** | Captação via WhatsApp, segmentação e análise |
| **Reuniões/Eventos** | CRUD, métricas e agenda integrada |
| **Metas de Votos** | Distribuição, simulação e histórico eleitoral |
| **Financeiro** | Contas, notas fiscais e prestação de contas |
| **Vale-Combustível** | Postos conveniados e vouchers digitais |
| **Equipe** | Cadastro, pagamentos e escalas de trabalho |
| **Demandas** | Controle de pedidos de eleitores |
| **Marketing Digital** | Instagram, WhatsApp, E-mail, SMS e Pixel Meta |
| **Inteligência Artificial** | Previsão de votos e alertas automáticos |

### Segurança & Compliance
✅ **LGPD**: Consentimento, criptografia, anonimização, direito ao esquecimento  
✅ **RLS**: Row Level Security em PostgreSQL  
✅ **Multi-Tenancy**: Isolamento completo de dados  
✅ **JWT**: Autenticação segura com tokens  
✅ **RBAC**: Controle de roles (admin, manager, finance, user)  

---

## 📋 Pré-requisitos

- **Node.js** 18+
- **PostgreSQL** 13+
- **Redis** (para cache/filas)
- **npm** ou **yarn**

---

## 🚀 Instalação & Configuração

### 1. Clonar Repositório

```bash
git clone <seu-repositorio>
cd campanha-saas
```

### 2. Configurar Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais PostgreSQL e JWT_SECRET

# Executar migrations do Prisma
npx prisma migrate dev --name init

# Popular banco com dados de demonstração
npm run seed

# Iniciar servidor (desenvolvimento)
npm run start:dev
```

#### Variáveis de Ambiente (`.env`)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/campanha_saas"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="seu-token-super-secreto"
JWT_EXPIRATION="7d"
PORT=3001
NODE_ENV="development"
```

### 3. Configurar Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com URL da API

# Iniciar servidor (desenvolvimento)
npm run dev
```

#### Variáveis de Ambiente (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_PWA_ENABLED=true
```

---

## 🔐 Credenciais Iniciais

Após executar `npm run seed`, as seguintes credenciais estão disponíveis:

### Root Admin
```
CPF:   000.000.000-00
Senha: Admin@2026
```

### Demo Admin (Campanha Goiás)
```
CPF:   123.456.789-00
Senha: Campanha@2026
```

---

## 📊 Estrutura do Banco de Dados

### Multi-Tenancy
- Cada tenant (campanha) tem isolamento completo via `tenant_id`
- **RLS** (Row Level Security) garante que usuários só acessem dados de seu tenant
- Relacionamento M:N entre `users` e `tenants` via `tenant_users`

### Tabelas Principais

```
tenants
├── users (M:N) → tenant_users
├── liderancas
├── eleitores
├── reunioes
├── metas
├── contas / notas_fiscais
├── vale_vouchers
├── equipe_membros
├── demandas
└── campanhas_marketing
```

---

## 🔌 Endpoints da API

### Autenticação
```
POST   /auth/login              Login
POST   /auth/register           Registrar novo tenant
POST   /auth/refresh-token      Renovar access token
POST   /auth/logout             Logout
```

### Recursos Protegidos (requer JWT)
```
GET    /dashboard/resumo        Resumo do dashboard
GET    /dashboard/metricas      Métricas detalhadas
GET    /dashboard/alertas       Alertas automáticos

GET    /liderancas              Listar lideranças
POST   /liderancas              Criar liderança
GET    /liderancas/:id          Detalhes da liderança
POST   /liderancas/:id          Atualizar liderança

GET    /eleitores               Listar eleitores
POST   /eleitores               Criar eleitor
GET    /eleitores/:id           Detalhes do eleitor

GET    /metas                   Listar metas
POST   /metas                   Criar meta
GET    /metas/:id               Detalhes da meta

GET    /financeiro/contas       Contas bancárias
GET    /financeiro/notas        Notas fiscais
GET    /financeiro/resumo       Resumo financeiro

GET    /equipe                  Membros da equipe
POST   /equipe                  Adicionar membro

GET    /demandas                Demandas do eleitor
POST   /demandas                Criar demanda

GET    /marketing               Campanhas de marketing
POST   /marketing               Criar campanha
```

---

## 🧪 Testes

### Backend
```bash
cd backend
npm test                        # Testes unitários
npm run test:cov              # Coverage
```

### Frontend
```bash
cd frontend
npm test                       # Testes com Jest/React Testing Library
```

---

## 🚢 Deployment no Railway

Para deploy em produção no Railway com banco de dados, frontend e backend sincronizados via GitHub:

### Guia Completo
**→ Acesse o arquivo [DEPLOYMENT.md](DEPLOYMENT.md) para instruções detalhadas**

Resumo rápido:
1. Conectar repositório GitHub ao Railway
2. Railway provisiona PostgreSQL automaticamente
3. Configurar variáveis de ambiente na UI
4. Push para main → Railway faz deploy automático

Nenhuma configuração manual de CLI necessária! ✨

---

## 🐳 Docker (Opcional)

### docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: campanha
      POSTGRES_PASSWORD: password
      POSTGRES_DB: campanha_saas
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://campanha:password@postgres:5432/campanha_saas
      REDIS_URL: redis://redis:6379
      JWT_SECRET: secret
    depends_on:
      - postgres
      - redis

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001

volumes:
  postgres_data:
```

### Executar
```bash
docker-compose up -d
```

---

## 📱 PWA (Progressive Web App)

A aplicação fronten é completamente instalável como PWA:

✅ Offline-first (com Service Workers)  
✅ Responsive (Mobile-first)  
✅ Cacheable (Dados sincronizados)  
✅ Installable (Ícone na home screen)  

Para instalar:
1. Acesse `https://seu-dominio.com`
2. Clique em "Instalar" (Chrome/Edge) ou "Adicionar à tela inicial" (Safari)

---

## 📚 Documentação Adicional

### Arquitetura
- **Backend**: NestJS + Prisma + PostgreSQL
- **Frontend**: Next.js 14 (App Router) + Zustand + Tailwind
- **Segurança**: JWT, RLS, HTTPS

### Padrões de Código
- Validação com `class-validator`
- DTO (Data Transfer Objects)
- Services injetados por dependency injection
- Guards customizados para autenticação

### Performance
- Redis para cache
- Queries otimizadas no Prisma
- Next.js Image Optimization
- Code splitting automático

---

## 🐛 Troubleshooting

### Erro: "Cannot find module '@prisma/client'"
```bash
cd backend && npm install
npx prisma generate
```

### Erro: "Connection refused" (PostgreSQL)
```bash
# Verificar se PostgreSQL está rodando
psql -U postgres

# Verificar DATABASE_URL no .env
echo $DATABASE_URL
```

### Erro: "JWT token inválido"
```bash
# Verifique se JWT_SECRET está configurado
grep JWT_SECRET backend/.env

# Limpar localStorage no navegador:
# DevTools → Application → Storage → Clear All
```

---

## 📝 Roadmap

- [ ] Integrações com Pixel Meta (rastreamento)
- [ ] API de WhatsApp Business
- [ ] Webhooks para eventos
- [ ] Relatórios em PDF/Excel avançados
- [ ] Previsões com Machine Learning
- [ ] Analytics avançado com Mixpanel

---

## 📄 Licença

MIT License - Veja o arquivo LICENSE

---

## 💬 Suporte

Para suporte, entre em contato via:
- Email: support@campanha-os.com
- Issues: GitHub Issues
- Docs: https://docs.campanha-os.com

---

**Desenvolvido com ❤️ para campanhas eleitorais brasileiras**

🇧🇷 _Conformidade total com LGPD e legislação sanitária de campanhas_
