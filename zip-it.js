const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const outDir = path.join(__dirname, 'out');
const zipFile = path.join(__dirname, 'deploy.zip');

console.log('--- Creating ZIP using Windows System TAR ---');

try {
    // Determine path to tar. On Windows, we want the system tar (bsdtar) which supports -a for zip
    // In Git Bash, 'tar' is GNU tar, which might not support -a for zip.
    // We explicitly try to use the Windows one if available.
    let tarCmd = 'tar';
    if (process.platform === 'win32') {
        const winTar = 'C:\\Windows\\System32\\tar.exe';
        if (fs.existsSync(winTar)) {
            tarCmd = `"${winTar}"`;
        }
    }

    // Go to out directory
    process.chdir(outDir);

    // Command: tar -a (auto-compress based on ext) -c (create) -f (file) 
    // We assume deploy.zip is in parent.
    // We include * and explicitly .htaccess
    // Windows tar handles * properly in this context.
    console.log(`Using command: ${tarCmd}`);
    execSync(`${tarCmd} -a -c -f ../deploy.zip * .htaccess`, { stdio: 'inherit' });

    console.log('Successfully created deploy.zip');

} catch (error) {
    console.error('Error creating zip:', error.message);
    // Fallback: If tar fails (e.g. older Windows), suggest user manual zip or fix-perms
    console.log('TIP: If zip creation failed, try using standard Windows zip context menu on "out" folder content.');
    process.exit(1);
}
