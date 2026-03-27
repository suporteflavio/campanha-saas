-- CreateTable
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "subscriptionStatus" TEXT NOT NULL DEFAULT 'active',
    "subscriptionDueDate" DATETIME,
    "gracePeriodDays" INTEGER NOT NULL DEFAULT 5,
    "mrr" DECIMAL DEFAULT 0
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cpf" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "tenant_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "tenant_users_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "tenant_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "dashboards" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "contadorVotos" INTEGER NOT NULL DEFAULT 0,
    "metaVotos" INTEGER NOT NULL DEFAULT 1000,
    "alertas" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "liderancas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "nivel" INTEGER NOT NULL DEFAULT 1,
    "regiao" TEXT,
    "mapa" TEXT,
    "score" INTEGER NOT NULL DEFAULT 0,
    "pai_id" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    CONSTRAINT "liderancas_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "liderancas_pai_id_fkey" FOREIGN KEY ("pai_id") REFERENCES "liderancas" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "eleitores" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT,
    "whatsapp" TEXT,
    "consentimento" BOOLEAN NOT NULL DEFAULT false,
    "segmento" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    CONSTRAINT "eleitores_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "reunioes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "data" DATETIME NOT NULL,
    "local" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "presentes" INTEGER NOT NULL DEFAULT 0,
    "tipo" TEXT NOT NULL DEFAULT 'reuniao',
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    CONSTRAINT "reunioes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "metas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,
    "votosNecessarios" INTEGER NOT NULL,
    "votosAtual" INTEGER NOT NULL DEFAULT 0,
    "historico" TEXT,
    "simulacao" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    CONSTRAINT "metas_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "contas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "saldo" DECIMAL NOT NULL DEFAULT 0,
    "tipo" TEXT NOT NULL DEFAULT 'corrente',
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    CONSTRAINT "contas_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "notas_fiscais" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DECIMAL NOT NULL,
    "data" DATETIME NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'despesa',
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    CONSTRAINT "notas_fiscais_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "postos_conveniados" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "vale_vouchers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "valor" DECIMAL NOT NULL,
    "membro_id" TEXT,
    "postaId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ativo',
    "dataUso" DATETIME,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    CONSTRAINT "vale_vouchers_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "equipe_membros" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "salario" DECIMAL NOT NULL,
    "dataAdmissao" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ativo',
    "escala" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    CONSTRAINT "equipe_membros_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "demandas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "eleitorId" TEXT,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "prioridade" TEXT NOT NULL DEFAULT 'media',
    "status" TEXT NOT NULL DEFAULT 'aberta',
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    CONSTRAINT "demandas_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "campanhas_marketing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "plataforma" TEXT NOT NULL,
    "conteudo" TEXT,
    "dataInicio" DATETIME NOT NULL,
    "dataFim" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'planejada',
    "alcance" INTEGER NOT NULL DEFAULT 0,
    "engajamento" INTEGER NOT NULL DEFAULT 0,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    CONSTRAINT "campanhas_marketing_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "predicoes_ia" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "dados" TEXT,
    "previsao" TEXT,
    "confianca" DECIMAL NOT NULL DEFAULT 0,
    "processadaEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "consentimentos_lgpd" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usuarioId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "aceito" BOOLEAN NOT NULL,
    "dataAceite" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "logs_auditoria" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usuarioId" TEXT,
    "acao" TEXT NOT NULL,
    "tabela" TEXT NOT NULL,
    "dados" TEXT,
    "ip" TEXT,
    "dataAcao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "tenantUserId" TEXT NOT NULL,
    "modulo" TEXT NOT NULL,
    "canRead" BOOLEAN NOT NULL DEFAULT false,
    "canCreate" BOOLEAN NOT NULL DEFAULT false,
    "canUpdate" BOOLEAN NOT NULL DEFAULT false,
    "canDelete" BOOLEAN NOT NULL DEFAULT false,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    CONSTRAINT "permissions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "permissions_tenantUserId_fkey" FOREIGN KEY ("tenantUserId") REFERENCES "tenant_users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "financial_categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    CONSTRAINT "financial_categories_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "meeting_attendances" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reuniaoId" TEXT NOT NULL,
    "nomeVotante" TEXT NOT NULL,
    "cpfVotante" TEXT,
    "telefoneVotante" TEXT,
    "whatsappVotante" TEXT,
    "interesses" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "distanciaMetros" INTEGER,
    "valida" BOOLEAN NOT NULL DEFAULT false,
    "consentimentoLGPD" BOOLEAN NOT NULL DEFAULT false,
    "registradaEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "meeting_attendances_reuniaoId_fkey" FOREIGN KEY ("reuniaoId") REFERENCES "reunioes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "competitors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "partido" TEXT NOT NULL,
    "cargoPretendido" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "votosAnteriores" INTEGER,
    "despesaDeclarada" DECIMAL,
    "notas" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL,
    CONSTRAINT "competitors_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "configuracoes_tenant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenantId" TEXT NOT NULL,
    "chaveInstagram" TEXT,
    "chaveWhatsapp" TEXT,
    "pixelMeta" TEXT,
    "emailConfigurado" BOOLEAN NOT NULL DEFAULT false,
    "smsConfigurado" BOOLEAN NOT NULL DEFAULT false,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_cnpj_key" ON "tenants"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_slug_key" ON "tenants"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_users_tenantId_userId_key" ON "tenant_users"("tenantId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "notas_fiscais_numero_key" ON "notas_fiscais"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "postos_conveniados_cnpj_key" ON "postos_conveniados"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "vale_vouchers_codigo_key" ON "vale_vouchers"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "equipe_membros_cpf_key" ON "equipe_membros"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_tenantId_tenantUserId_modulo_key" ON "permissions"("tenantId", "tenantUserId", "modulo");

-- CreateIndex
CREATE UNIQUE INDEX "meeting_attendances_cpfVotante_key" ON "meeting_attendances"("cpfVotante");

-- CreateIndex
CREATE UNIQUE INDEX "meeting_attendances_whatsappVotante_key" ON "meeting_attendances"("whatsappVotante");
