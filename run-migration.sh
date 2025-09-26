#!/bin/bash
cd /Users/macbookpro/Coding/iwanna

# Попробуем разные пути к npm
if command -v npm &> /dev/null; then
    npm run migrate:mock-data
elif [ -f "$HOME/.nvm/nvm.sh" ]; then
    source "$HOME/.nvm/nvm.sh"
    npm run migrate:mock-data
elif [ -f "/usr/local/bin/npm" ]; then
    /usr/local/bin/npm run migrate:mock-data
elif [ -f "/opt/homebrew/bin/npm" ]; then
    /opt/homebrew/bin/npm run migrate:mock-data
else
    echo "npm not found"
    exit 1
fi
