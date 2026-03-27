#!/bin/bash

# 🚀 CampanhaOS - Quick Start Script
# Este script configura o ambiente completo

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         🚀 CampanhaOS - Quick Start Setup                  ║"
echo "╚════════════════════════════════════════════════════════════╝"

# ============================================================
# 1. Validar Pré-requisitos
# ============================================================
echo ""
echo "📋 Verificando pré-requisitos..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Baixe em: https://nodejs.org"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm não está instalado."
    exit 1
fi

echo "✅ Node.js $(node --version) encontrado"
echo "✅ npm $(npm --version) encontrado"

# ============================================================
# 2. Backend Setup
# ============================================================
echo ""
echo "🔧 Configurando Backend..."

cd backend

echo "  📦 Instalando dependências..."
npm install

echo "  📝 Configurando variáveis de ambiente..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "  ⚠️  Edite backend/.env com suas credenciais PostgreSQL"
else
    echo "  ✅ .env já existe"
fi

echo "  ✅ Backend pronto (NestJS)"

cd ..

# ============================================================
# 3. Frontend Setup
# ============================================================
echo ""
echo "🎨 Configurando Frontend..."

cd frontend

echo "  📦 Instalando dependências..."
npm install

echo "  📝 Configurando variáveis de ambiente..."
if [ ! -f .env.local ]; then
    cp .env.example .env.local
    echo "  ✅ .env.local criado"
else
    echo "  ✅ .env.local já existe"
fi

echo "  ✅ Frontend pronto (Next.js)"

cd ..

# ============================================================
# 4. Sumário Final
# ============================================================
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    ✅ Setup Concluído!                     ║"
echo "╚════════════════════════════════════════════════════════════╝"

echo ""
echo "🚀 PRÓXIMOS PASSOS:"
echo ""
echo "1️⃣  Configure o Banco de Dados:"
echo "   - Edite backend/.env com DATABASE_URL (PostgreSQL)"
echo "   - Crie um banco de dados vazio: createdb campanha_saas"
echo ""
echo "2️⃣  Execute as Migrations:"
echo "   cd backend"
echo "   npx prisma migrate dev --name init"
echo "   npm run seed"
echo ""
echo "3️⃣  Inicie o Servidor (Terminal 1):"
echo "   cd backend"
echo "   npm run start:dev"
echo "   # A API estará em http://localhost:3001"
echo ""
echo "4️⃣  Inicie o Frontend (Terminal 2):"
echo "   cd frontend"
echo "   npm run dev"
echo "   # A app estará em http://localhost:3000"
echo ""
echo "🔐 CREDENCIAIS DE TESTE:"
echo "   CPF:   123.456.789-00"
echo "   Senha: Campanha@2026"
echo ""
echo "📚 Documentação: Veja README.md"
echo ""
