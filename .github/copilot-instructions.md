// Markdown configuration for VS Code Copilot

## About This Project

This is **CampanhaOS**, a complete multi-tenant SaaS platform for managing electoral campaigns in Brazil.

### Tech Stack
- Backend: NestJS + TypeScript + Prisma ORM + PostgreSQL
- Frontend: Next.js 14 (App Router) + Tailwind CSS + Zustand
- Security: JWT Auth + RLS + LGPD compliance
- Deployment: Railway

### Project Structure
```
campanha-saas/
├── backend/              # NestJS API
│   ├── src/
│   │   ├── common/       # Guards, decorators, Prisma service
│   │   ├── modules/      # Feature modules (auth, dashboard, etc.)
│   │   └── main.ts
│   ├── prisma/
│   │   ├── schema.prisma # Database schema
│   │   ├── rls_setup.sql # Row Level Security
│   │   └── seed.ts       # Demo data
│   └── package.json
├── frontend/             # Next.js App
│   ├── src/
│   │   ├── app/          # Pages and layouts
│   │   ├── components/   # React components
│   │   ├── lib/          # Utilities (API client)
│   │   └── store/        # Zustand stores
│   ├── public/           # Static assets
│   └── package.json
└── README.md
```

### Key Development Patterns

1. **Authentication**: JWT tokens stored in localStorage + Zustand
2. **Multi-Tenancy**: `tenant_id` in all queries + RLS enforcement
3. **API Routes**: RESTful with `/auth`, `/dashboard`, `/liderancas`, etc.
4. **Database**: Prisma migrations + RLS policies + seed data
5. **Styling**: Tailwind CSS utility classes

### Common Tasks

- **Run Backend**: `cd backend && npm run start:dev`
- **Run Frontend**: `cd frontend && npm run dev`
- **Generate DB**: `cd backend && npx prisma migrate dev --name <name>`
- **Seed Data**: `cd backend && npm run seed`
- **Build Frontend**: `cd frontend && npm run build`

### Testing Credentials

- **Root**: CPF `000.000.000-00` | Password `Admin@2026`
- **Demo**: CPF `123.456.789-00` | Password `Campanha@2026`

### Important Files

- Backend Prisma Schema: `backend/prisma/schema.prisma`
- RLS Policies: `backend/prisma/rls_setup.sql`
- Frontend Config: `frontend/next.config.js`
- Auth Module: `backend/src/modules/auth/`
- Dashboard: `frontend/src/app/dashboard/page.tsx`

### Database Models

Key entities:
- `Tenant` - Campaign/organization
- `User` - Application user
- `TenantUser` - User-tenant relationship with roles
- `Lideranca` - Political leaders (hierarchical)
- `Eleitor` - Voters with segments
- `Meta` - Vote targets by municipality
- `Reuniao` - Meetings/events
- `Conta`, `NotaFiscal` - Financial tracking
- `CampanhaMarketing` - Social media campaigns

All tables include `tenantId` for multi-tenant isolation.

### Security Notes

- RLS enabled on all business tables
- JWT expires in 1 hour (access token), 7 days (refresh token)
- Passwords hashed with bcryptjs
- CORS enabled for frontend origin
- Validation with class-validator on all inputs

---

**This is a production-ready template. Customize as needed for your campaigns.**
