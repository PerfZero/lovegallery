$ErrorActionPreference = "Stop"
$Server = "root@85.198.101.110"
$Key = "$HOME\.ssh\id_rsa_vps"

Write-Host "🔄 1/4 Installing Docker on server..." -ForegroundColor Cyan
ssh -i $Key $Server "curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh && apt-get update && apt-get install -y docker-compose-v2"

Write-Host "📦 2/4 Archiving project files..." -ForegroundColor Cyan
if (Test-Path deploy.tar.gz) { Remove-Item deploy.tar.gz }
# Using tar to bundle files locally to avoid transferring node_modules
tar -czf deploy.tar.gz --exclude node_modules --exclude .next --exclude .git .

Write-Host "🚀 3/4 Uploading to server..." -ForegroundColor Cyan
scp -i $Key deploy.tar.gz "$($Server):/root/deploy.tar.gz"

Write-Host "🏗️  4/4 Building and starting..." -ForegroundColor Cyan
ssh -i $Key $Server "
    mkdir -p beloved-nextjs
    tar -xzf deploy.tar.gz -C beloved-nextjs
    cd beloved-nextjs
    docker compose down
    docker compose up -d --build
    rm ../deploy.tar.gz
"

Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host "Check your site at: http://85.198.101.110:3000" -ForegroundColor Green
