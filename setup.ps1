# ============================================
# 🚀 MINEIRO BARBEARIA - Setup Script
# Execute após instalar o Node.js
# ============================================

Write-Host "🏪 Mineiro Barbearia - Setup do Projeto" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Verifica Node.js
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "❌ Node.js não encontrado! Instale em: https://nodejs.org" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js $nodeVersion detectado" -ForegroundColor Green

# Passo 1: Criar projeto Vite + React
Write-Host "`n📦 Criando projeto Vite + React..." -ForegroundColor Yellow
npx -y create-vite@latest ./ --template react

# Passo 2: Instalar dependências base
Write-Host "`n📥 Instalando dependências..." -ForegroundColor Yellow
npm install

# Passo 3: Instalar Tailwind CSS v4 (plugin Vite)
Write-Host "`n🎨 Instalando Tailwind CSS..." -ForegroundColor Yellow
npm install -D tailwindcss @tailwindcss/vite

# Passo 4: Instalar Supabase + React Router
Write-Host "`n🔌 Instalando Supabase e React Router..." -ForegroundColor Yellow
npm install @supabase/supabase-js react-router-dom

Write-Host "`n✅ Setup completo! Execute 'npm run dev' para iniciar." -ForegroundColor Green
