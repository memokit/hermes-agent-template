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

# Check if NEXTJS_URL is set (for Railway multi-service setup)
if [ -z "$NEXTJS_URL" ]; then
    echo "⚠️  WARNING: NEXTJS_URL not set. Using default http://localhost:3459"
    export NEXTJS_URL="http://localhost:3459"
else
    echo "✅ NEXTJS_URL configured: $NEXTJS_URL"
fi

# Start Python server (Railway sets PORT automatically)
echo "🚀 Starting Hermes API on port ${PORT:-8080}..."
exec python server.py
