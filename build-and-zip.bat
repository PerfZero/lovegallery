@echo off
setlocal
set "PROJECT_DIR=%~dp0"
cd /d "%PROJECT_DIR%"

echo ==========================================
echo      Beloved Project Build Script
echo      (Windows Batch Edition)
echo ==========================================
echo.

REM 1. Clean previous build artifacts
echo [1/3] Cleaning previous build...
if exist ".next" rmdir /s /q ".next"
if exist "out" rmdir /s /q "out"
if exist "deploy.zip" del "deploy.zip"

REM 2. Run Next.js Build
echo.
echo [1/3] Running Frontend Build (Static Export)...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed!
    pause
    exit /b %ERRORLEVEL%
)

REM 3. Post-Build Setup (Copying critical files)
echo.
echo [2/3] Verifying critical files in 'out'...

REM Ensure .htaccess is copied (sometimes dotfiles are skipped)
if exist "public\.htaccess" (
    echo Copying .htaccess...
    copy /y "public\.htaccess" "out\.htaccess" >nul
)

REM Ensure PHP files are copied
if exist "public\*.php" (
    echo Copying PHP scripts...
    copy /y "public\*.php" "out\" >nul
)
if exist "public\fix-perms.php" (
    echo Copying fix-perms.php...
    copy /y "public\fix-perms.php" "out\fix-perms.php" >nul
)

REM 4. Create Zip Archive
echo.
echo [3/3] Creating archive 'deploy.zip'...

REM Using Node.js script with TAR (Better permissions)
call node zip-it.js

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to create archive.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ==========================================
echo  DONE!
echo.
echo  1. File 'deploy.zip' created successfully.
echo  2. Upload contents of 'deploy.zip' to your hosting root.
echo ==========================================
pause
