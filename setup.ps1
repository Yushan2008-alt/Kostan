# Kostan Project Setup Script
Write-Host "🚀 Starting Kostan Project Setup..." -ForegroundColor Green

# 1. Add XAMPP MySQL to PATH
Write-Host "`n1️⃣  Adding XAMPP MySQL to PATH..." -ForegroundColor Yellow
$env:PATH += ";C:\xampp\mysql\bin"
mysql --version

# 2. Create Database
Write-Host "`n2️⃣  Creating Database..." -ForegroundColor Yellow
mysql -u root -e "CREATE DATABASE IF NOT EXISTS kostan_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database created successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Database creation failed" -ForegroundColor Red
    exit 1
}

# 3. Install NPM Dependencies
Write-Host "`n3️⃣  Installing NPM dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ NPM install failed" -ForegroundColor Red
    exit 1
}

# 4. Generate Prisma Client
Write-Host "`n4️⃣  Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Prisma generate failed" -ForegroundColor Red
    exit 1
}

# 5. Run Prisma Migration
Write-Host "`n5️⃣  Running Prisma Migrations..." -ForegroundColor Yellow
npx prisma migrate dev --name init
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Prisma migrate failed" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Setup completed successfully!" -ForegroundColor Green
Write-Host "`n🎮 To start the development server, run:" -ForegroundColor Cyan
Write-Host "npm run start:dev" -ForegroundColor Cyan
