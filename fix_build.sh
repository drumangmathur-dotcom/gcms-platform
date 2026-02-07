#!/bin/bash

# Get current user
USER=$(whoami)
echo "Fixing permissions for user: $USER"

# Fix .npm cache permissions
echo "Fixing global .npm cache..."
sudo chown -R $USER ~/.npm

# Fix current project ownership (Crucial for node_modules)
echo "Fixing project directory permissions..."
sudo chown -R $USER .

# Clear broken artifacts
echo "Cleaning up..."
rm -rf node_modules package-lock.json

echo "✅ Permissions fixed!"
echo "Now verifying npm..."
if command -v npm >/dev/null; then
    echo "Installing dependencies..."
    npm install
    echo "Building..."
    npm run build
else
    echo "⚠️ npm not found in script PATH. Please run 'npm install' manually after this script finishes."
fi
