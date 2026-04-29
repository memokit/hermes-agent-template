#!/bin/bash
set -e

# For Railway: use HOME directory for Hermes data
export HERMES_HOME="${HERMES_HOME:-$HOME/.hermes}"
mkdir -p "$HERMES_HOME"

# Create minimal config.yaml if not exists (for personalities API to work)
if [ ! -f "$HERMES_HOME/config.yaml" ]; then
    cat > "$HERMES_HOME/config.yaml" << 'EOF'
model:
  default: "anthropic/claude-3.5-sonnet"
  provider: "auto"

personalities:
  - name: "Luffy"
    description: "Full Stack Developer Assistant"
    system_prompt: "You are Luffy, a helpful AI assistant."
EOF
fi

# Start server (WORKDIR is /app, so server.py is found automatically)
echo "🚀 Starting server on port ${PORT:-8080}..."
exec python server.py
