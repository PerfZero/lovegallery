<?php
/**
 * AutoPetroleum Permission Fixer
 * Upload this file to your root directory and visit it in browser.
 */

header('Content-Type: text/plain');

echo "Starting permission fix...\n";
echo "--------------------------------\n";

function fix_permissions($dir) {
    // Set directory permissions to 755
    if (!chmod($dir, 0755)) {
        echo "Failed to chmod dir: $dir\n";
    }

    $files = scandir($dir);
    foreach ($files as $file) {
        if ($file == '.' || $file == '..') continue;
        
        $path = $dir . '/' . $file;
        
        if (is_dir($path)) {
            fix_permissions($path);
        } else {
            // Set file permissions to 644
            if (!chmod($path, 0644)) {
                echo "Failed to chmod file: $path\n";
            }
        }
    }
}

// Start from current directory
fix_permissions(__DIR__);

echo "--------------------------------\n";
echo "Done! All directories set to 755, files to 644.\n";
echo "You can now delete this file.";
?>
