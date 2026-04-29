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

# Start server - use server.py directly since it has uvicorn server in __main__
PORT="${PORT}"
if [ -z "$PORT" ]; then
    echo "ERROR: PORT environment variable is not set!" >&2
    exit 1
fi
echo "🚀 Starting server on port ${PORT}..."
export PORT
exec python server.py
