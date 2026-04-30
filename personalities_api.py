# personalities_api.py
# API endpoints for Hermes Personalities and Virtual Office

import os
import yaml
from pathlib import Path
from starlette.responses import JSONResponse, HTMLResponse, Response

async def route_personalities(request):
    """GET /api/personalities - Return Hermes personalities from config.yaml"""
    try:
        # Get config path from HERMES_HOME env (same as server.py)
        hermes_home = os.environ.get("HERMES_HOME", "/data/.hermes")
        config_path = os.path.join(hermes_home, "config.yaml")
        
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
    """GET /office* - Reverse Proxy to Next.js (Phaser Virtual Office)"""
    import httpx
    import os
    
    # Next.js server URL (default to localhost for local dev)
    NEXTJS_URL = os.getenv("NEXTJS_URL", "http://localhost:3459")
    
    # Get the path after /office
    path = request.path_params.get("path", "")
    # Proxy to Next.js root (Virtual Office is at /)
    target_url = f"{NEXTJS_URL}/{path}" if path else NEXTJS_URL + "/"
    
    try:
        async with httpx.AsyncClient() as client:
            # Forward the request to Next.js
            response = await client.request(
                method=request.method,
                url=target_url,
                headers=dict(request.headers),
                params=dict(request.query_params),
                content=await request.body() if request.method != "GET" else None,
                timeout=30.0
            )
            
            # Return the proxied response
            return Response(
                content=response.content,
                status_code=response.status_code,
                headers=dict(response.headers)
            )
    except Exception as e:
        # Fallback error page if Next.js is not running
        html = f"""
        <!DOCTYPE html>
        <html lang="th">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Virtual Office - Next.js Offline</title>
            <style>
                body {{ 
                    font-family: sans-serif; 
                    text-align: center; 
                    padding: 50px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    min-height: 100vh;
                    margin: 0;
                }}
            </style>
        </head>
        <body>
            <h1>🏢 Virtual Office</h1>
            <p>⚠️ Next.js Server is not running on port 3456</p>
            <p>Error: {str(e)}</p>
            <p>Please start it with: <code>cd virtual-office && npm run dev</code></p>
        </body>
        </html>
        """
        return HTMLResponse(html, status_code=503)
