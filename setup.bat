@echo off
REM CampanhaOS - Quick Start Script (Windows)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║         CampanhaOS - Quick Start Setup (Windows)           ║
echo ╚════════════════════════════════════════════════════════════╝

REM 1. Backend Setup
echo.
echo 🔧 Configurando Backend...
cd backend

echo   📦 Instalando dependências...
call npm install

echo   📝 Configurando variáveis de ambiente...
if not exist .env (
    copy .env.example .env
    echo   ⚠️  Edite backend\.env com suas credenciais PostgreSQL
) else (
    echo   ✅ .env já existe
)

echo   ✅ Backend pronto (NestJS)
cd ..

REM 2. Frontend Setup
echo.
echo 🎨 Configurando Frontend...
cd frontend

echo   📦 Instalando dependências...
call npm install

echo   📝 Configurando variáveis de ambiente...
if not exist .env.local (
    copy .env.example .env.local
    echo   ✅ .env.local criado
) else (
    echo   ✅ .env.local já existe
)

echo   ✅ Frontend pronto (Next.js)
cd ..

REM 3. Sumário Final
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                    ✅ Setup Concluído!                     ║
echo ╚════════════════════════════════════════════════════════════╝

echo.
echo 🚀 PRÓXIMOS PASSOS:
echo.
echo 1. Configure o Banco de Dados:
echo    - Edite backend\.env com DATABASE_URL (PostgreSQL)
echo    - Crie um banco de dados vazio: createdb campanha_saas
echo.
echo 2. Execute as Migrations:
echo    cd backend
echo    npx prisma migrate dev --name init
echo    npm run seed
echo.
echo 3. Inicie o Servidor (Terminal 1):
echo    cd backend
echo    npm run start:dev
echo.
echo 4. Inicie o Frontend (Terminal 2):
echo    cd frontend
echo    npm run dev
echo.
echo 🔐 CREDENCIAIS DE TESTE:
echo    CPF:   123.456.789-00
echo    Senha: Campanha@2026
echo.
pause
