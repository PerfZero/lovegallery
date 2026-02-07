#!/bin/bash

# Beloved Project Build Script
# (Based on AutoPetroleum Logic)

echo "=========================================="
echo "     Beloved Build Script"
echo "     (MinGW/Git Bash Edition)"
echo "=========================================="
echo ""

# 1. Сборка
echo "[1/3] Frontend Build (Static Export)..."
# Force clean
rm -rf .next out deploy.zip

npm run build
if [ $? -ne 0 ]; then
    echo "[ERROR] Build Failed!"
    exit 1
fi

echo ""
echo "[2/3] Preparing files in 'out'..."

# Create data dir just like in reference
mkdir -p out/data

# Copy critical PHP/Htaccess files explicitly
echo "Copying config files..."
cp public/.htaccess out/ 2>/dev/null || true
cp public/*.php out/ 2>/dev/null || true
# Ensure fix-perms is there
cp public/fix-perms.php out/ 2>/dev/null || true

echo ""
echo "[3/3] Creating archive 'deploy.zip'..."

# Run the node zipper
node zip-it.js

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo " SUCCESS! "
    echo ""
    echo " 1. File 'deploy.zip' created."
    echo " 2. Upload to hosting."
    echo ""
    echo " ВАЖНО / IMPORTANT:"
    echo " Если видите 403 Forbidden или 404 на JS файлы:"
    echo " Откройте: your-site.com/fix-perms.php"
    echo " (как и в AutoPetroleum, это исправляет права)"
    echo "=========================================="
else
    echo "[ERROR] Zipping failed."
    exit 1
fi
