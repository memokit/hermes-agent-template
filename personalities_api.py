# personalities_api.py
# API endpoints for Hermes Personalities and Virtual Office

import os
import yaml
from pathlib import Path
from starlette.responses import JSONResponse, HTMLResponse

async def route_personalities(request):
    """GET /api/personalities - Return Hermes personalities from config.yaml"""
    try:
        # Get config path from env or default
        config_path = os.environ.get(
            "HERMES_CONFIG_PATH", 
            str(Path.home() / ".hermes/config.yaml")
        )
        
        if not os.path.exists(config_path):
            return JSONResponse(
                {"success": False, "error": f"config.yaml not found at {config_path}"},
                status_code=404
            )
        
        # Read and parse config.yaml
        with open(config_path, 'r', encoding='utf-8') as f:
            config = yaml.safe_load(f)
        
        # Extract personalities
        personalities = config.get('personalities', [])
        
        return JSONResponse({
            "success": True,
            "count": len(personalities),
            "personalities": personalities,
            "source": "hermes-config"
        })
    except Exception as e:
        return JSONResponse(
            {"success": False, "error": str(e)},
            status_code=500
        )


async def route_office(request):
    """GET /office - Virtual Office entry point"""
    html = """
    <!DOCTYPE html>
    <html lang="th">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Virtual Office - Hermes Agent</title>
        <style>
            body { 
                font-family: sans-serif; 
                text-align: center; 
                padding: 50px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                min-height: 100vh;
                margin: 0;
            }
            h1 { font-size: 3em; margin-bottom: 20px; }
            p { font-size: 1.2em; margin: 10px 0; }
            .card {
                background: rgba(255,255,255,0.1);
                backdrop-filter: blur(10px);
                border-radius: 15px;
                padding: 30px;
                max-width: 600px;
                margin: 30px auto;
            }
            a { 
                color: #ffd700; 
                text-decoration: none; 
                font-weight: bold;
            }
            a:hover { text-decoration: underline; }
        </style>
    </head>
    <body>
        <div class="card">
            <h1>🏢 Virtual Office</h1>
            <p>Welcome to Hermes Agent Virtual Office!</p>
            <p>Status: <strong>Online</strong> ✅</p>
            <p>
                <a href="/api/personalities">📊 View Personalities API</a>
            </p>
            <p>
                <a href="/">← Back to Hermes Dashboard</a>
            </p>
        </div>
    </body>
    </html>
    """
    return HTMLResponse(html)
